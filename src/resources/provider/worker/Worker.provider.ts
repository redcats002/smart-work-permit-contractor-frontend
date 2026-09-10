import type { ICreateWorkerPayload, IGetWorkerListQuery, IUpdateWorkerPayload } from '@/models/request/worker/WorkerReq.model'
import type {
  TCreateWorkerResponse, TDeleteWorkerResponse, TGetWorkerListResponse, TGetWorkerResponse, TUpdateWorkerResponse
} from '@/models/response/worker/WorkerRes.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * Workers are scoped to the calling contractor server-side (wayfinder 060) — this app never
 * sees another employer's people, and must not try to filter by employer client-side.
 *
 * `getById`/`update`/`delete` back the worker directory (wayfinder 062).
 */
export interface IWorkerProvider {
  list (query?: IGetWorkerListQuery): Promise<TGetWorkerListResponse>
  create (payload: ICreateWorkerPayload): Promise<TCreateWorkerResponse>
  getById (id: number): Promise<TGetWorkerResponse>
  update (id: number, payload: IUpdateWorkerPayload): Promise<TUpdateWorkerResponse>
  /** Named `retire`, not `delete` — `HttpRequest.delete`'s signature is `(endPoint, ...)`, and there is no hard delete anyway. */
  retire (id: number): Promise<TDeleteWorkerResponse>
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

  /** One worker with their certificates and the permits they appear on (wayfinder 062). */
  public async getById (id: number): Promise<TGetWorkerResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  /** A rename propagates to every certificate/permit row that references this worker by id. */
  public async update (id: number, payload: IUpdateWorkerPayload): Promise<TUpdateWorkerResponse> {
    const response = await this.patch(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  /** Soft delete only — sets `deletedAt`. There is no hard delete on the wire. */
  public async retire (id: number): Promise<TDeleteWorkerResponse> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default WorkerProvider
