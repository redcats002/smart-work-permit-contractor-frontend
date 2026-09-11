import type {
  IJsaStep, IPermitPhoto, IPermitSafetyReading, IPermitWorker
} from '@/models/modules/permit/Permit.model'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IBasePaginationRequest } from '../Request.model'

/**
 * POST /permits — `type`, `title`, `foreman`, `startDate`, `endDate`, `dailyStart`, `dailyEnd`
 * are required by the backend; `location` is nullable on the wire (wayfinder 070's openapi
 * refresh dropped it from POST's `required` list) but this app keeps it a required field of its
 * OWN wizard UX regardless — see `Step2BasicInfo.schema.ts`. Nothing outside the wizard may
 * assume `location` is always present.
 */
export interface ICreatePermitDraftPayload {
  type: TPermitType
  title: string
  location?: string | null
  foreman: string
  /** `YYYY-MM-DD` */
  startDate: string
  /** `YYYY-MM-DD` */
  endDate: string
  /**
   * wayfinder 067. Full ISO datetime, `1970-01-01`-anchored — only the UTC clock time is read
   * server-side. See `IPermitBase`'s doc comment for the local-time rendering trap this implies.
   */
  dailyStart: string
  dailyEnd: string
  /** Free text for what the window cannot express ("not working Sat/Sun"). Nothing queries it. */
  scheduleNote?: string | null
  outdoorWork?: boolean
  /**
   * wayfinder 105/107. Replaces the old `mapUrl`/`latitude`/`longitude` (068, reversed) and the
   * old `position`/`planId`/`planX`/`planY` (feat-023, collapsed into this one reference — the
   * pin knows its own plan). `null` clears a pin; omitted leaves it unchanged (PATCH semantics —
   * this field is NOT a collection, so omitting it never wipes an already-persisted pin).
   * Required by the wizard's own client-side gate before submit only once an active pin on an
   * active plan exists — see `usePinPreflight`; the server is authoritative and answers
   * `PERMIT_POSITION_REQUIRED` regardless of what the client thinks.
   */
  pinId?: number | null
}

/**
 * PATCH /permits/:id — DRAFT only (403 `PERMIT_NOT_EDITABLE` otherwise).
 *
 * ⚠ Collection semantics differ per field, and getting this wrong destroys user data:
 * - `jsaSteps` and `workers` are **REPLACED WHOLESALE**. Send the complete list every time —
 *   a partial list silently deletes the rest.
 * - `safetyReading` (singular) **APPENDS** a new reading row.
 * - `photos` **UPSERT per `slotKey`**.
 *
 * wayfinder 105/107 — the `Omit<..., 'latitude' | 'longitude'>` override this interface used to
 * need is gone with those fields: `pinId` is a plain scalar reference, so
 * `Partial<ICreatePermitDraftPayload>` already gives it the right `number | null | undefined`
 * shape with no re-declaration required.
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
 * `status` takes one value OR an array (feat-009 — repeated `?status=A&status=B`, matching
 * `docs/api/openapi.json`'s `anyOf` for this param). The "Active" filter chip (ACTIVE +
 * FIRE_MONITOR) and "Closed" (CLOSED + REJECTED) send the array and let the server filter and
 * paginate the group — do NOT go back to fetching unfiltered and narrowing client-side; that
 * narrowing predates feat-009 and, combined with a real pager, produces a short last page (the
 * same silent-truncation defect an explicit `limit: 9999` guards against elsewhere in this app —
 * see `useCertificates.ts`'s `fetchWorkers`).
 */
export interface IGetPermitListQuery extends IBasePaginationRequest {
  status?: TPermitStatus | TPermitStatus[]
  type?: TPermitType
  /** `YYYY-MM-DD`, filtered server-side on `startDate`. */
  dateFrom?: string
  dateTo?: string
}
