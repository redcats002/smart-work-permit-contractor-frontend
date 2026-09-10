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

/**
 * PATCH /workers/:id — wayfinder 062. Every field optional (only sent keys change); `idCardNo`/
 * `phone` accept an explicit `null` to clear them, same three-state contract as
 * `ICertificate`'s `filePath`. `restore` un-retires a soft-deleted worker.
 */
export interface IUpdateWorkerPayload {
  name?: string
  role?: string
  idCardNo?: string | null
  phone?: string | null
  restore?: boolean
}
