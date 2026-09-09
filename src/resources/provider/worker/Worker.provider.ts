import type { ICreateWorkerPayload, IGetWorkerListQuery } from '@/models/request/worker/WorkerReq.model'
import type { TCreateWorkerResponse, TGetWorkerListResponse } from '@/models/response/worker/WorkerRes.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * Workers are scoped to the calling contractor server-side (wayfinder 060) — this app never
 * sees another employer's people, and must not try to filter by employer client-side.
 *
 * Only the two read/write methods this app needs today. `PATCH` and `DELETE /workers/:id` exist
 * on the wire but belong to the worker directory (wayfinder 062), which is not built here.
 */
export interface IWorkerProvider {
  list (query?: IGetWorkerListQuery): Promise<TGetWorkerListResponse>
  create (payload: ICreateWorkerPayload): Promise<TCreateWorkerResponse>
}

class WorkerProvider extends HttpRequest implements IWorkerProvider {
  private urlPrefix: string = '/api/v1/workers'

  public async list (query?: IGetWorkerListQuery): Promise<TGetWorkerListResponse> {
    const response = await this.get(this.urlPrefix, query)
    return response
  }

  /**
   * Answers `409 WORKER_ALREADY_EXISTS` when this contractor already has someone by that name,
   * and the error body carries the existing `workerId`. Callers should adopt that id rather than
   * surfacing the conflict — a duplicate name is the normal case when two forms race, not a
   * user error worth a dialog.
   */
  public async create (payload: ICreateWorkerPayload): Promise<TCreateWorkerResponse> {
    const response = await this.post(this.urlPrefix, payload)
    return response
  }
}

export default WorkerProvider
