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
