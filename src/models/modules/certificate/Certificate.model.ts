/**
 * Shared domain shape for the `certificate` module. Field names mirror the backend
 * data model in docs/main/dev-handoff/01-backend-elysia-tasks.md ("certificates —
 * id, worker_name, role, cert_type, issued_date, expiry_date"), camelCased —
 * src/resources/Interceptors.ts handles snake_case<->camelCase conversion via humps,
 * so nothing here should use snake_case.
 */
export interface ICertificate {
  id: string | number
  workerName: string
  role: string
  certType: string
  /** ISO date string (yyyy-mm-dd or full ISO timestamp). */
  issuedDate: string
  /** ISO date string (yyyy-mm-dd or full ISO timestamp). Validity is derived from this. */
  expiryDate: string
  /** Storage path/URL for the uploaded certificate file, if one was attached. */
  fileRef?: string
}
