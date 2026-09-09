import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

/** GET /certificates — a contractor's own workers' certificates. */
export type TGetCertificateListResponse = IBasePaginationResponse<ICertificate>

/** GET /certificates/:id */
export type TGetCertificateResponse = IBaseSuccessResponse<ICertificate>

/** POST /certificates */
export type TCreateCertificateResponse = IBaseSuccessResponse<ICertificate>

/** GET /certificates/worker/:name — ONE certificate or null, not an array. */
export type TGetCertificateByWorkerResponse = IBaseSuccessResponse<ICertificate | null>

/** PATCH /certificates/:id */
export type TUpdateCertificateResponse = IBaseSuccessResponse<ICertificate>
