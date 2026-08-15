import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

/** GET /certificates — a contractor's own workers' certificates. */
export type TGetCertificateListResponse = IBasePaginationResponse<ICertificate>

/** POST /certificates */
export type TCreateCertificateResponse = IBaseSuccessResponse<ICertificate>

/** GET /certificates/worker/:name — used by the entry-check flow to validate expiry. */
export type TGetCertificateByWorkerResponse = IBaseSuccessResponse<ICertificate[]>
