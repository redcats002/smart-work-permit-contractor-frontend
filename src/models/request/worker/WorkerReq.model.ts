import type { IBasePaginationRequest } from '../Request.model'

/** GET /workers */
export interface IGetWorkerListQuery extends IBasePaginationRequest {
  /** Exact-name filter. `search` is the fuzzy one — both are accepted. */
  name?: string
  /** Retired workers are excluded by default; a certificate must not silently point at one. */
  includeRetired?: boolean
}

/** POST /workers */
export interface ICreateWorkerPayload {
  name: string
  role: string
  idCardNo?: string
  phone?: string
}
