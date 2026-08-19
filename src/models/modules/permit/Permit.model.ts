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

export interface IPermitBase {
  id: string
  type: TPermitType
  status: TPermitStatus
  title: string
  foreman: string
  location: string
  /** Sent as `YYYY-MM-DD`, returned as a full ISO timestamp. Format for display; never round-trip. */
  workDate: string
  /** Full ISO datetimes in both directions — not `'HH:mm'`. */
  workTimeStart: string
  workTimeEnd: string
  outdoorWork: boolean
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
