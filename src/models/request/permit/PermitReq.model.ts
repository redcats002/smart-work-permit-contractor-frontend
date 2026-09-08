import type {
  IJsaStep, IPermitPhoto, IPermitPosition, IPermitSafetyReading, IPermitWorker
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
  /**
   * feat-023. `null` clears a pin; omitted leaves it unchanged (PATCH semantics — this field is
   * NOT a collection, so omitting it never wipes an already-persisted pin). Required by the
   * wizard's own client-side gate before submit only once an active plan exists — see
   * `usePlanPosition`; the server is authoritative and answers `PERMIT_POSITION_REQUIRED`
   * regardless of what the client thinks.
   */
  position?: IPermitPosition | null
  /**
   * wayfinder ticket 037. `null` clears a reference; omitted leaves it unchanged (same PATCH
   * semantics as `position`). Only an `APPROVED` area may be referenced — the server enforces
   * this at write time (`400 AREA_NOT_APPROVED`), not this type. Optional at submit until a
   * deployment flag says otherwise (`400 AREA_REQUIRED`) — see `usePlanPosition`'s sibling
   * reasoning; there is no client-side gate on this field.
   */
  areaId?: number | null
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
