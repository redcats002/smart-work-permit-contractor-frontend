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
  /** Storage path/URL returned by Upload.provider, if a file was attached. */
  fileRef?: string
}
