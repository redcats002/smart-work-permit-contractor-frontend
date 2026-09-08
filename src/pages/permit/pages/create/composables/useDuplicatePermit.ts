import type { Ref } from 'vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { dayjs } from '@/plugins/dayjs.plugin'
import { toast } from '@/plugins/toast'
import { useApiError, type IApiErrorResult } from '@/composables/useApiError'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IJsaStep, IPermitSafetyReading, IPermitWorker } from '@/models/modules/permit/Permit.model'
import type { ICreatePermitDraftPayload, IUpdatePermitDraftPayload } from '@/models/request/permit/PermitReq.model'
import PermitProvider, { type IPermitProvider } from '@/resources/provider/permit/Permit.provider'
import { toSubmittableJsaSteps } from '../schema/Step5Jsa.schema'

const PermitService: IPermitProvider = new PermitProvider()

export interface IUseDuplicatePermit {
  duplicating: Ref<boolean>
  /** The server's localized verdict on the source fetch or the new-draft write — never its raw `message`. */
  duplicateError: Ref<IApiErrorResult | undefined>
  /**
   * Client-side clone (there is no clone endpoint on the wire — docs/api/openapi.json has no such
   * path): `GET /permits/:sourceId` to read the rejected permit, `POST /permits` with ONLY the
   * fields that route accepts (never `id`, `status`, `submittedAt`, `rejectedReason`/`rejectedAt`
   * or any approval/closure field — those simply have no home in `ICreatePermitDraftPayload`), then
   * one `PATCH` to copy `jsaSteps` / `workers` / `photos` / the latest `safetyReading` onto the new
   * draft. The reading is copied at most once, in this single PATCH — it is never resent by a
   * later edit (see useWizard.hydrate, which primes `lastPersistedReading` from the same PATCH's
   * response once the caller lands on the resume route for the new draft id).
   *
   * Resolves the new draft's id on success, `undefined` on failure.
   */
  duplicatePermit (sourceId: string): Promise<string | undefined>
}

/**
 * Strips server-assigned `id` — neither array is documented with one on the wire (openapi.json).
 *
 * wayfinder ticket 001. Also drops any blank/partial row and recomputes `sortOrder` per phase via
 * `toSubmittableJsaSteps` — the source permit's rows already passed the server's own `minLength: 1`
 * on their original save, so this is defensive rather than expected to change anything in
 * practice, but the invariant ("what this app sends never violates minLength") must hold on every
 * path that assembles a `jsaSteps` PATCH body, not just the wizard's own autosave.
 */
function toWireJsaSteps (steps: IJsaStep[]): Omit<IJsaStep, 'id'>[] {
  return toSubmittableJsaSteps(steps).map((step: IJsaStep): Omit<IJsaStep, 'id'> => ({
    phase: step.phase,
    step: step.step,
    hazard: step.hazard,
    control: step.control,
    sortOrder: step.sortOrder
  }))
}

/**
 * `bloodPressure`/`alcoholReading` are `string` on the wire — NOT nullable (docs/api/openapi.json:
 * `{ type: 'string' }`, no `anyOf` with null) — but GET returns `null` for a worker that never had
 * a health check (any non-Confined-Space permit, always). Sending that `null` back 400s
 * (`Expected property 'workers.N.bloodPressure' to be string but found: null`), so it must be
 * omitted, not round-tripped as `null`.
 */
function toWireWorkers (workers: IPermitWorker[]): Omit<IPermitWorker, 'id'>[] {
  return workers.map((worker: IPermitWorker): Omit<IPermitWorker, 'id'> => ({
    workerName: worker.workerName,
    roleOnPermit: worker.roleOnPermit,
    bloodPressure: worker.bloodPressure ?? undefined,
    alcoholReading: worker.alcoholReading ?? undefined
  }))
}

/** so2/recordedAt/recordedById are never accepted on PATCH — see useWizard's own toWireReading. */
function toWireReading (reading: IPermitSafetyReading): IPermitSafetyReading {
  return {
    lel: reading.lel,
    o2: reading.o2,
    co: reading.co,
    wind: reading.wind,
    height: reading.height
  }
}

export function useDuplicatePermit (): IUseDuplicatePermit {
  const { mapError } = useApiError()
  const { t } = useI18n()

  const duplicating = ref(false)
  const duplicateError = ref<IApiErrorResult | undefined>(undefined)

  async function duplicatePermit (sourceId: string): Promise<string | undefined> {
    duplicating.value = true
    duplicateError.value = undefined
    try {
      const source = await PermitService.detail(sourceId)
      const permit = source.data

      const createPayload: ICreatePermitDraftPayload = {
        type: permit.type as TPermitType,
        title: permit.title,
        location: permit.location,
        foreman: permit.foreman,
        // `workDate` round-trips as a full ISO timestamp (see IPermitBase) but POST /permits wants
        // `YYYY-MM-DD` — same Bangkok-tz-aware conversion useWizard.hydrate uses for the resume
        // route, not a plain `dayjs(...).format()` (that ignores `dayjs.tz.setDefault`).
        workDate: dayjs(permit.workDate).tz('Asia/Bangkok').format('YYYY-MM-DD'),
        workTimeStart: permit.workTimeStart,
        workTimeEnd: permit.workTimeEnd,
        outdoorWork: permit.outdoorWork
      }
      const created = await PermitService.create(createPayload)
      const newId = created.data.id

      const updatePayload: IUpdatePermitDraftPayload = {
        jsaSteps: toWireJsaSteps(permit.jsaSteps),
        workers: toWireWorkers(permit.workers),
        photos: permit.photos
      }
      if (permit.latestSafetyReading) updatePayload.safetyReading = toWireReading(permit.latestSafetyReading)

      await PermitService.update(newId, updatePayload)

      // wayfinder ticket 008 — "permit created" is sanctioned to toast. The caller navigates
      // straight into the new draft's edit wizard, so nothing on screen otherwise tells the
      // user a whole new permit now exists.
      toast.success(t('permit.toast.duplicated'))

      return newId
    } catch (error: unknown) {
      duplicateError.value = mapError(error)
      return undefined
    } finally {
      duplicating.value = false
    }
  }

  return { duplicating, duplicateError, duplicatePermit }
}

export default useDuplicatePermit
