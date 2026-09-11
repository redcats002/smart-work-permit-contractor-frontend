import type { IGetPinListQuery } from '@/models/request/pin/PinReq.model'
import type { TGetPinDetailResponse, TGetPinListResponse } from '@/models/response/pin/PinRes.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * wayfinder ticket 107 (backend: 104/105). `create`/`update`/`deactivate` are deliberately
 * absent — placing, renaming and deactivating a pin are all `safety_officer`-only and answer
 * `403 FORBIDDEN_ROLE` for a contractor account. The contractor is read-only against this
 * resource, same posture as `IFacilityPlanProvider`.
 */
export interface IPinProvider {
  list (query: IGetPinListQuery): Promise<TGetPinListResponse>
  getById (id: number): Promise<TGetPinDetailResponse>
}

class PinProvider extends HttpRequest implements IPinProvider {
  private urlPrefix: string = '/api/v1/pins'

  /** Every role may read this. Callers wanting the full active set on one plan must pass an explicit `limit`. */
  public async list (query: IGetPinListQuery): Promise<TGetPinListResponse> {
    const response = await this.get(this.urlPrefix, query)
    return response
  }

  /** Resolves ANY pin by id, active or not — required so a permit's referenced pin still resolves even once retired. */
  public async getById (id: number): Promise<TGetPinDetailResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default PinProvider
