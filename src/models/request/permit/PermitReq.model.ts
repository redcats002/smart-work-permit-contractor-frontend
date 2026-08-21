import type {
  IJsaStep, IPermitPhoto, IPermitSafetyReading, IPermitWorker
} from '@/models/modules/permit/Permit.model'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IBasePaginationRequest } from '../Request.model'

/** POST /permits — every field here is required by the backend. */
export interface ICreatePermitDraftPayload {
  type: TPermitType
  title: string
  location: string
  foreman: string
  /** `YYYY-MM-DD` */
  workDate: string
  /** Full ISO datetime */
  workTimeStart: string
  workTimeEnd: string
  outdoorWork?: boolean
}

/**
 * PATCH /permits/:id — DRAFT only (403 `PERMIT_NOT_EDITABLE` otherwise).
 *
 * ⚠ Collection semantics differ per field, and getting this wrong destroys user data:
 * - `jsaSteps` and `workers` are **REPLACED WHOLESALE**. Send the complete list every time —
 *   a partial list silently deletes the rest.
 * - `safetyReading` (singular) **APPENDS** a new reading row.
 * - `photos` **UPSERT per `slotKey`**.
 */
export interface IUpdatePermitDraftPayload extends Partial<ICreatePermitDraftPayload> {
  safetyReading?: IPermitSafetyReading
  jsaSteps?: IJsaStep[]
  workers?: IPermitWorker[]
  photos?: IPermitPhoto[]
}

/** POST /permits/:id/submit — no body. Answers 400 with the first failing validation code. */
export interface ISubmitPermitPayload {}

/** POST /permits/:id/mark-complete — Hot Work only, no body. */
export interface IMarkPermitCompletePayload {}

/**
 * POST /permits/:id/close — both fields are REQUIRED by the backend.
 *
 * `checklist` is free-form (`patternProperties: { '^(.*)$': {} }` in openapi.json) and is stored
 * verbatim as `closureChecklist`. That is exactly why the transport does no case conversion
 * (`API-002`): camelizing would rewrite the caller's own item keys.
 */
export interface IClosePermitPayload {
  checklist: Record<string, 'yes' | 'no'>
  signature: string
}

/**
 * GET /permits. A contractor is scoped to their own permits automatically — `contractorId` is
 * ignored for contractor accounts, so it is not modelled here.
 *
 * `status` takes ONE value. The "Active" filter chip covers ACTIVE + FIRE_MONITOR, which the
 * backend cannot express in one call — see useMyPermits for how that is narrowed client-side.
 */
export interface IGetPermitListQuery extends IBasePaginationRequest {
  status?: TPermitStatus
  type?: TPermitType
  /** `YYYY-MM-DD`, filtered server-side on `workDate`. */
  dateFrom?: string
  dateTo?: string
}
