import type { TJsaPhase } from '@/enums/modules/permit/JsaPhase.enum'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { TWorkerRole } from '@/enums/modules/permit/WorkerRole.enum'

/**
 * Shared domain shapes for the `permit` module, matching the wire contract exactly
 * (docs/api/openapi.json; docs/main/dev-handoff/04-api-contract.md §4 is the readable version).
 * The API is camelCase and the transport converts nothing (API-002), so these names ARE the
 * wire names — renaming one here silently breaks a request.
 *
 * Permit ID format: `WP-{HOT|CONF|HT}-{YYYYMMDD}-{seq}` e.g. `WP-HOT-20260625-001`.
 */

/** Author fields (`createdBy`, `approvedBy`, `closedBy`) are objects or null — never name strings. */
export interface IPermitAuthor {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
}

/** Display name for an author, falling back to the email when the name fields are empty. */
export function permitAuthorName (author?: IPermitAuthor | null): string {
  if (!author) return ''
  const name = `${author.firstName ?? ''} ${author.lastName ?? ''}`.trim()
  return name || author.email
}

/**
 * feat-023 — the contractor's pin on the active facility plan. `planX`/`planY` are 0-100,
 * PERCENTAGES of the rendered plan frame — NOT pixels (docs/main/PROMPT-LOG.md session 11).
 * Sent on PATCH/POST as `position: IPermitPosition | null`; read back flattened as
 * `planId`/`planX`/`planY` on the permit entity (see IPermitListItem) — two different shapes for
 * the same data because that is what the two directions of the wire contract actually declare.
 */
export interface IPermitPosition {
  planId: number
  planX: number
  planY: number
}

/**
 * wayfinder 067. Replaces the single-day `workDate` + `workTimeStart`/`workTimeEnd` — a permit's
 * work window is now a daily window (`dailyStart`/`dailyEnd`) repeating every day between
 * `startDate` and `endDate`. `scheduleNote` is free text for what the window cannot express
 * ("not working Sat/Sun") — nothing queries it.
 *
 * ⚠ THE 067 UTC TRAP. `dailyStart`/`dailyEnd` are Postgres `@db.Time` columns with no date part —
 * on the wire they are full ISO datetimes anchored to `1970-01-01`, and only the UTC clock time
 * is meaningful; the date part is discarded server-side. The migration backfill took each
 * existing permit's `workTimeStart::time` (its UTC time-of-day) and `combineDateAndTime` reads it
 * back in UTC, so a migrated permit keeps the exact instant it always had **only while the client
 * renders these through the SAME local-time conversion `workTimeStart` used** — `Date#getHours`/
 * `Date#setHours` (browser-local), never `getUTCHours`/`setUTCHours`. Render as a UTC wall clock
 * and every migrated permit shifts by the deployment's offset with nothing failing. See
 * `Step3WhereWhen.vue`'s `extractTimeOfDay`/`composeDateTime`, copied verbatim from the old
 * Step2BasicInfo for this reason.
 */
export interface IPermitBase {
  id: string
  type: TPermitType
  status: TPermitStatus
  title: string
  foreman: string
  location: string | null
  /** `YYYY-MM-DD` in both directions. */
  startDate: string
  endDate: string
  /** Full ISO datetime, `1970-01-01` anchored on read — see the UTC-trap note above. */
  dailyStart: string
  dailyEnd: string
  scheduleNote: string | null
  outdoorWork: boolean
  /** wayfinder 068. A stored coordinate, not a map — render as an "open in maps" link. */
  latitude: number | null
  longitude: number | null
}

/**
 * One atmosphere reading. On PATCH this **appends** a new row; the permit only ever exposes the
 * most recent one back, as `latestSafetyReading`.
 */
export interface IPermitSafetyReading {
  lel?: number | null
  o2?: number | null
  co?: number | null
  so2?: number | null
  wind?: number | null
  height?: number | null
  recordedAt?: string
  recordedById?: string
}

/**
 * One failing reading inside `validationSummary`. `message` is backend-authored English and is
 * NEVER rendered — the UI localizes off `errorCode` (`LEL_MISSING`, `GAS_OUT_OF_RANGE`, …).
 * `so2` is absent from `field` on purpose: it is advisory and is not on the wire at all.
 */
export interface IPermitValidationFailure {
  field: 'lel' | 'o2' | 'co' | 'wind'
  errorCode: string
  message: string
}

/**
 * The server's own verdict on the safety readings, returned on every permit detail/command
 * response. Its `scope` is readings only — certificate gating happens at submit and is not in
 * here, so this must never be labelled "all checks passed". Render it; never recompute it.
 */
export interface IPermitValidationSummary {
  scope: 'safety_readings'
  passed: boolean
  failures: IPermitValidationFailure[]
}

export interface IJsaStep {
  id?: number
  phase: TJsaPhase
  step: string
  hazard: string
  control: string
  sortOrder?: number
}

/**
 * Health-check fields are **flat** on the wire, not nested — the backend takes
 * `{ workerName, roleOnPermit, bloodPressure?, alcoholReading? }`.
 */
export interface IPermitWorker {
  id?: number
  /**
   * wayfinder 060/063 — `PermitWorker.workerId` is `NOT NULL` on the wire. Step 4 collects a real
   * Worker record via `WorkerPicker` (wayfinder 063), so this is required, not a display echo of
   * a typed name — `workerName` is now the echo.
   */
  workerId: number
  workerName: string
  roleOnPermit: TWorkerRole
  /** Confined Space only — pre-work BP + alcohol reading per Thai ministerial regulation. */
  bloodPressure?: string | null
  alcoholReading?: string | null
}

/** Upserted per `slotKey`. `fileRef` is the `filePath` returned by POST /upload. */
export interface IPermitPhoto {
  slotKey: string
  fileRef: string
  originalName?: string | null
  fileType?: string | null
}

export interface IClosureChecklistAnswer {
  itemKey: string
  answer: 'yes' | 'no' | 'na'
}

/**
 * Server-computed Fire Watch state, present on every permit list row and detail payload since the
 * backend's 2026-08-21 pass (docs/api/GAPS.md row A). `null` unless `status === 'FIRE_MONITOR'`.
 *
 * `remainingSeconds` is clamped at 0 and is the authoritative remainder — it is immune to client
 * clock skew, unlike deriving from `startedAt` alone. `elapsed: false` is exactly the state in
 * which `POST /permits/:id/close` answers 403 `FIRE_WATCH_NOT_ELAPSED`.
 */
export interface IPermitFireWatch {
  startedAt: string
  elapsedSeconds: number
  remainingSeconds: number
  elapsed: boolean
}

/** GET /permits/:id/qr answers `{ token }` — nothing else. */
export interface IPermitQr {
  token: string
}

/** Append-only, hash-chained. There is no mutation endpoint by design. */
export interface IPermitAuditEntry {
  id: number
  permitId: string | null
  actorId: string | null
  actor: IPermitAuthor | null
  action: string
  payload?: unknown
  hash: string
  prevHash: string | null
  createdAt: string
}
