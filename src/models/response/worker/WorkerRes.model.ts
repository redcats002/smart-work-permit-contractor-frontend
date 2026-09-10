import type { IWorker, IWorkerDetail } from '@/models/modules/worker/Worker.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

/** GET /workers */
export type TGetWorkerListResponse = IBasePaginationResponse<IWorker>

/** POST /workers */
export type TCreateWorkerResponse = IBaseSuccessResponse<IWorker>

/** GET /workers/:id — wayfinder 062. */
export type TGetWorkerResponse = IBaseSuccessResponse<IWorkerDetail>

/** PATCH /workers/:id */
export type TUpdateWorkerResponse = IBaseSuccessResponse<IWorker>

/** DELETE /workers/:id — a bare success envelope, no `data`. */
export type TDeleteWorkerResponse = { message: string }
