import { ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import { useApiError } from '@/composables/useApiError'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import type { IPermitWorker } from '@/models/modules/permit/Permit.model'
import CertificateProvider, { type ICertificateProvider } from '@/resources/provider/certificate/Certificate.provider'

/**
 * PMT-009 — the "worker certificates valid" pre-flight row on the review step.
 *
 * `GET /certificates/worker/:name` answers ONE certificate or null, and every row carries a
 * backend-computed `expired` flag. That flag is the verdict: expiry is NEVER recomputed here
 * (see src/utils/CertificateStatus.ts and the note on ICertificate.expired). The same rule is
 * enforced server-side at submit, which answers `CERT_MISSING` / `CERT_EXPIRED` — this row is a
 * heads-up, not the gate.
 */
export type TCertificatePreflightState = 'idle' | 'loading' | 'pass' | 'fail' | 'unknown'

export interface ICertificateProblem {
  workerName: string
  reason: 'MISSING' | 'EXPIRED'
}

export interface IUseCertificatePreflight {
  state: Ref<TCertificatePreflightState>
  problems: Ref<ICertificateProblem[]>
  check (workers: IPermitWorker[]): Promise<void>
}

export function useCertificatePreflight (): IUseCertificatePreflight {
  const { mapError } = useApiError()
  const CertificateService: ICertificateProvider = new CertificateProvider()

  const state = ref<TCertificatePreflightState>('idle')
  const problems = ref<ICertificateProblem[]>([])

  async function check (workers: IPermitWorker[]): Promise<void> {
    const named = workers.filter((worker: IPermitWorker): boolean => Boolean(worker.workerName?.trim()))
    problems.value = []

    if (named.length === 0) {
      state.value = 'unknown'
      return
    }

    state.value = 'loading'
    const found: ICertificateProblem[] = []

    const completed = await handleLoading(
      async (): Promise<boolean> => {
        for (const worker of named) {
          const { data } = await CertificateService.byWorker(worker.workerName)
          const certificate: ICertificate | null = data
          if (!certificate) found.push({ workerName: worker.workerName, reason: 'MISSING' })
          else if (certificate.expired) found.push({ workerName: worker.workerName, reason: 'EXPIRED' })
        }
        return true
      }, {}, (error: unknown): void => {
        // Never claim "valid" on a failed lookup — an unknown answer is not a pass.
        mapError(error)
      }
    )

    problems.value = found
    if (completed !== true) state.value = 'unknown'
    else state.value = found.length === 0 ? 'pass' : 'fail'
  }

  return { state, problems, check }
}

export default useCertificatePreflight
