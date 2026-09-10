import type {
  IJsaStep, IPermitPhoto, IPermitPosition, IPermitSafetyReading, IPermitWorker
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
   * wayfinder 068. Parsed authoritatively server-side (`parse-map-coordinate.util.ts` in the
   * api). Mutually exclusive with `latitude`/`longitude` — sending both is a 400. The client
   * mirrors the same parser for instant feedback only; this is never a gate stricter than the
   * server's own parse.
   */
  mapUrl?: string
  /** Set together with `longitude`, or omitted. Never sent alongside `mapUrl`. */
  latitude?: number
  longitude?: number
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
 *
 * `latitude`/`longitude` are re-declared (not inherited via `Partial`) because PATCH additionally
 * accepts an explicit `null` pair to CLEAR a previously stored coordinate — `Partial` alone would
 * only ever give `number | undefined`.
 */
export interface IUpdatePermitDraftPayload extends Omit<Partial<ICreatePermitDraftPayload>, 'latitude' | 'longitude'> {
  latitude?: number | null
  longitude?: number | null
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
 * narrowing predates feat-009 and, combined with a real pager, produces a short last page (a
 * documented defect class on this map — see AreaPicker's `limit: 9999` note).
 */
export interface IGetPermitListQuery extends IBasePaginationRequest {
  status?: TPermitStatus | TPermitStatus[]
  type?: TPermitType
  /** `YYYY-MM-DD`, filtered server-side on `startDate`. */
  dateFrom?: string
  dateTo?: string
}
