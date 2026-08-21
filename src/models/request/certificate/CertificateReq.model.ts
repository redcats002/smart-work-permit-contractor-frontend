import type { IBasePaginationRequest } from '../Request.model'

/** GET /certificates */
export interface IGetCertificateListQuery extends IBasePaginationRequest {}

/** POST /certificates */
export interface ICreateCertificatePayload {
  workerName: string
  role: string
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
   * NOTE: the API does not accept this field yet — `POST /certificates` declares no `filePath`
   * and Elysia strips unknown keys, so it is currently discarded server-side. See
   * `docs/api/GAPS.md` row G. The field is sent in its correct final shape so the feature works
   * the day the backend adds the column.
   */
  filePath?: string
}
