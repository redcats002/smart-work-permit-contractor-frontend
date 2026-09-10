/**
 * Shared domain shape for the `worker` module (wayfinder 060).
 *
 * A worker is a RECORD, not a name. Before 060 a worker existed only as free text on each
 * certificate and each permit row, which is how the same person ended up spelled three ways and
 * holding certificates the gate could not join. `role` lives here now — it describes the person,
 * not the card, so it is no longer a certificate field.
 *
 * camelCase on the wire, no conversion in transport (API-002) — these names must match
 * docs/api/openapi.json exactly.
 */
export interface IWorker {
  id: number
  name: string
  role: string
  idCardNo?: string | null
  phone?: string | null
  employerId?: string
  createdAt?: string
  updatedAt?: string
  deletedAt?: string | null
  /** Server-computed rollups, present on the list. Read-only — never send these back. */
  certificateCount?: number
  permitCount?: number
  /** The furthest-out expiry across this worker's certificates, or null if they hold none. */
  latestExpiryDate?: string | null
}

/**
 * A certificate row as embedded in `GET /workers/:id`'s response — NOT the same shape as
 * `ICertificate` (no `workerId`/`workerName`, both implied by the page already being scoped to
 * this worker). wayfinder 062.
 */
export interface IWorkerDetailCertificate {
  id: number
  certType: string
  issuedDate: string
  expiryDate: string
  expired: boolean
  filePath?: string | null
}

/**
 * A permit row as embedded in `GET /workers/:id`'s response. `id` is the permit's own string id
 * (`WP-HOT-...`), not this worker's numeric one. wayfinder 062.
 */
export interface IWorkerDetailPermit {
  id: string
  title: string
  type: string
  status: string
  roleOnPermit: string
  startDate?: string | null
}

/** `GET /workers/:id` — one worker with their certificates and the permits they appear on. */
export interface IWorkerDetail extends IWorker {
  certificates: IWorkerDetailCertificate[]
  permits: IWorkerDetailPermit[]
}
