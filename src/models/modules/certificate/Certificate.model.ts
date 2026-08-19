/**
 * Shared domain shape for the `certificate` module. Field names mirror the backend
 * data model in docs/main/dev-handoff/01-backend-elysia-tasks.md ("certificates —
 * id, worker_name, role, cert_type, issued_date, expiry_date"), camelCased.
 * The API is camelCase on the wire — no conversion happens in the transport (API-002),
 * so these names must match docs/api/openapi.json exactly.
 */
export interface ICertificate {
  id: number
  workerName: string
  role: string
  certType: string
  /** Full ISO timestamp on the way out; sent as `YYYY-MM-DD`. */
  issuedDate: string
  expiryDate: string
  /**
   * Computed by the backend on every row. This — not `expiryDate` — decides whether a
   * certificate has lapsed; the client only adds the advisory "expiring soon" window on top
   * (src/utils/CertificateStatus.ts). Never recompute expiry client-side: the same flag gates
   * field entry server-side with no override.
   */
  expired: boolean
  createdById?: string
  createdAt?: string
  updatedAt?: string
}
