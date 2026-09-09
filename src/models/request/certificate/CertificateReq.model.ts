import type { IBasePaginationRequest } from '../Request.model'

/** GET /certificates */
export interface IGetCertificateListQuery extends IBasePaginationRequest {}

/** POST /certificates */
export interface ICreateCertificatePayload {
  /** wayfinder 060 — a worker is a record. `workerName`/`role` are no longer accepted here. */
  workerId: number
  certType: string
  /** ISO date string (yyyy-mm-dd or full ISO timestamp). */
  issuedDate: string
  /** ISO date string (yyyy-mm-dd or full ISO timestamp). */
  expiryDate: string
  /**
   * Storage **path** (`filePath`) returned by Upload.provider, if a file was attached.
   *
   * Never the presigned `fileUrl` — that handle expires 60 seconds after upload
   * (REVIEW-2026-08-19 S4), so persisting it stores a dead link.
   *
   * Accepted by the API since wayfinder 056 — `docs/api/GAPS.md` row G is closed. Before that
   * the field was stripped silently and every uploaded file was orphaned in object storage.
   */
  filePath?: string
}

/** PATCH /certificates/:id */
export interface IUpdateCertificatePayload {
  /** Re-points the certificate at a different worker. Fixing a NAME is a Worker rename, not this. */
  workerId?: number
  certType?: string
  /** ISO date string (yyyy-mm-dd or full ISO timestamp). */
  issuedDate?: string
  /** ISO date string (yyyy-mm-dd or full ISO timestamp). */
  expiryDate?: string
  /**
   * Three distinct cases, which is why this is `string | null` and optional rather than just
   * optional: **omitted** keeps the current attachment, a **string** replaces it, and an explicit
   * **null** detaches it. An optional string alone could not express the third, and "omitted means
   * keep" is the whole contract of the edit form's empty file input.
   */
  filePath?: string | null
}
