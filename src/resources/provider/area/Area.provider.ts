import type { ICreateAreaPayload, IGetAreaListQuery } from '@/models/request/area/AreaReq.model'
import type { TCreateAreaResponse, TGetAreaDetailResponse, TGetAreaListResponse } from '@/models/response/area/AreaRes.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * wayfinder ticket 037 (backend: ticket 036). `approve`/`reject` are deliberately absent — both
 * are `safety_officer`-only and answer 403 `FORBIDDEN_ROLE` for a contractor account, same
 * reasoning as `IPermitProvider` omitting them (see the comment there).
 */
export interface IAreaProvider {
  list (query: IGetAreaListQuery): Promise<TGetAreaListResponse>
  getById (id: number): Promise<TGetAreaDetailResponse>
  create (payload: ICreateAreaPayload): Promise<TCreateAreaResponse>
}

class AreaProvider extends HttpRequest implements IAreaProvider {
  private urlPrefix: string = '/api/v1/areas'

  /** Every role may read this. Callers wanting the full approved set must pass an explicit `limit`. */
  public async list (query: IGetAreaListQuery): Promise<TGetAreaListResponse> {
    const response = await this.get(this.urlPrefix, query)
    return response
  }

  /** Resolves ANY area by id, any status — used to render a permit's already-referenced area even when it is no longer approved. */
  public async getById (id: number): Promise<TGetAreaDetailResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  /** Contractor only. Always creates `PENDING` — never immediately selectable. */
  public async create (payload: ICreateAreaPayload): Promise<TCreateAreaResponse> {
    const response = await this.post(this.urlPrefix, payload)
    return response
  }
}

export default AreaProvider
