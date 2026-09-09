import type { IWorker } from '@/models/modules/worker/Worker.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

/** GET /workers */
export type TGetWorkerListResponse = IBasePaginationResponse<IWorker>

/** POST /workers */
export type TCreateWorkerResponse = IBaseSuccessResponse<IWorker>
