/**
 * Shared domain shape for the `certificate` module. Field names mirror the backend
 * data model in docs/main/dev-handoff/01-backend-elysia-tasks.md ("certificates —
 * id, worker_name, role, cert_type, issued_date, expiry_date"), camelCased.
 * The API is camelCase on the wire — no conversion happens in the transport (API-002),
 * so these names must match docs/api/openapi.json exactly.
 */
export interface ICertificate {
  id: number
  /**
   * wayfinder 060 — identity. The certificate points at a Worker record; `workerName` below is
   * the server's echo for display only. Never join on the name: that is the free-text join this
   * FK replaced.
   */
  workerId: number
  /** Display echo of the worker's name. Read-only — correcting a name is a Worker rename. */
  workerName: string
  certType: string
  /** Full ISO timestamp on the way out; sent as `YYYY-MM-DD`. */
  issuedDate: string
  expiryDate: string
  /**
   * wayfinder 095/115. A certificate needs a licence number OR an attachment — at least one.
   * Required on the wire (docs/api/openapi.json), nullable — optional here only to match the
   * existing looseness of `createdById`/`createdAt`/`updatedAt` below, not because it can be
   * missing from a real response.
   */
  licenceNo?: string | null
  /** wayfinder 095/115 — free text for training/examination detail. Same optionality note as
   * `licenceNo` above. */
  description?: string | null
  /**
   * Computed by the backend on every row. This — not `expiryDate` — decides whether a
   * certificate has lapsed; the client only adds the advisory "expiring soon" window on top
   * (src/utils/CertificateStatus.ts). Never recompute expiry client-side: the same flag gates
   * field entry server-side with no override.
   */
  expired: boolean
  /**
   * Object-storage KEY for the scanned certificate, or null. Never a URL — resolve a download
   * through `Upload.provider.getFileUrl()` at click time, because the presigned handle the
   * upload returns expires 60 seconds later (REVIEW-2026-08-19 S4).
   *
   * Null on every certificate registered before the backend gained the column (wayfinder 056)
   * and on any registered without an attachment. Both are normal; neither is an error.
   */
  filePath: string | null
  createdById?: string
  createdAt?: string
  updatedAt?: string
}
