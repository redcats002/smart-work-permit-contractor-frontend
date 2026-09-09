import { ref, type Ref } from 'vue'
import { handleLoading } from '@/utils/HandleLoading'
import { useApiError } from '@/composables/useApiError'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import type { IPermitWorker } from '@/models/modules/permit/Permit.model'
import CertificateProvider, { type ICertificateProvider } from '@/resources/provider/certificate/Certificate.provider'

/**
 * PMT-009 / CRT-004 — the "worker certificates valid" pre-flight check, shared by the review
 * step's row (step 6) and the PPE & Workers step's per-worker gate (step 4, `useWizard`).
 *
 * `GET /certificates/worker/:name` answers ONE certificate or null, and every row carries a
 * backend-computed `expired` flag. That flag is the verdict: expiry is NEVER recomputed here
 * (see src/utils/CertificateStatus.ts and the note on ICertificate.expired). The same rule is
 * enforced server-side at submit, which answers `CERT_MISSING` / `CERT_EXPIRED` — this is a
 * heads-up / convenience gate, never a promise: the server's verdict on submit always wins.
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

/**
 * @param loadingUnit Optional local loading flag passed through to `handleLoading`. Without one,
 * `handleLoading` drives the GLOBAL loading store — and `check()` is called on every worker-list
 * edit (`useWizard`'s debounced watcher), which would otherwise flash a full-page spinner per
 * edit instead of a local "checking" state (already exposed via `state === 'loading'`).
 */
export function useCertificatePreflight (loadingUnit?: Ref<boolean>): IUseCertificatePreflight {
  const { mapError } = useApiError()
  const CertificateService: ICertificateProvider = new CertificateProvider()

  const state = ref<TCertificatePreflightState>('idle')
  const problems = ref<ICertificateProblem[]>([])

  // Bumped on every call and captured as `token`; a write is discarded once a later call has
  // started, so an in-flight lookup that resolves AFTER a newer one can never overwrite it with a
  // stale verdict. Without this, gating Next/Submit on `state` risks the exact class of bug
  // PROMPT-LOG warns about: a client rule stuck blocking a draft the server would accept.
  let sequence = 0

  async function check (workers: IPermitWorker[]): Promise<void> {
    const token = ++sequence
    // wayfinder 060: the lookup is by worker id, so a row that only has a typed name cannot be
    // checked at all until Step 4 collects an id (wayfinder 063). Such rows are left OUT rather
    // than looked up by name — the name-keyed route is gone, and guessing would be worse than
    // not knowing. With none checkable the state stays 'unknown', which does not block: this
    // composable's existing rule is that an unknown answer is not a pass, and equally not a fail.
    const named = workers.filter((worker: IPermitWorker): boolean => typeof worker.workerId === 'number')

    if (named.length === 0) {
      if (token !== sequence) return
      problems.value = []
      state.value = 'unknown'
      return
    }

    state.value = 'loading'
    problems.value = []
    const found: ICertificateProblem[] = []

    const completed = await handleLoading(
      async (): Promise<boolean> => {
        for (const worker of named) {
          const { data } = await CertificateService.byWorker(worker.workerId as number)
          const certificate: ICertificate | null = data
          if (!certificate) found.push({ workerName: worker.workerName, reason: 'MISSING' })
          else if (certificate.expired) found.push({ workerName: worker.workerName, reason: 'EXPIRED' })
        }
        return true
      }, { loadingUnit }, (error: unknown): void => {
        // Never claim "valid" on a failed lookup — an unknown answer is not a pass.
        mapError(error)
      }
    )

    if (token !== sequence) return

    problems.value = found
    if (completed !== true) state.value = 'unknown'
    else state.value = found.length === 0 ? 'pass' : 'fail'
  }

  return { state, problems, check }
}

export default useCertificatePreflight
