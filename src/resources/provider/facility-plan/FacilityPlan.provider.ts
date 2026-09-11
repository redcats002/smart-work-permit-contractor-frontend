import type { IGetFacilityPlanListQuery } from '@/models/request/facility-plan/FacilityPlanReq.model'
import type { TGetFacilityPlanListResponse, TGetFacilityPlanResponse } from '@/models/response/facility-plan/FacilityPlanRes.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * Read-only against `/api/v1/facility-plans` — this app never uploads, creates, activates or
 * deactivates a plan (that is a Safety Officer action in the sibling repo; `facility-plans` is a
 * server-owned upload prefix, see ../PROMPT-LOG.md "the facility plan is not an ordinary
 * upload"). `list`/`getById` are open to every role, including a contractor picking a pin while
 * drafting (wayfinder 107).
 *
 * wayfinder 104/107 — `getActive(areaId?)` is gone. Plans are a flat named set with no group and
 * no area scoping any more; `list()` replaces it with the real paginated route the API now serves.
 */
export interface IFacilityPlanProvider {
  list (query: IGetFacilityPlanListQuery): Promise<TGetFacilityPlanListResponse>
  getById (id: number): Promise<TGetFacilityPlanResponse>
}

class FacilityPlanProvider extends HttpRequest implements IFacilityPlanProvider {
  private urlPrefix: string = '/api/v1/facility-plans'

  /** Every role may read this. Callers wanting the full active set must pass an explicit `limit`. */
  public async list (query: IGetFacilityPlanListQuery): Promise<TGetFacilityPlanListResponse> {
    const response = await this.get(this.urlPrefix, query)
    return response
  }

  /**
   * Resolves ANY plan by id, active or not — required so a pin placed on a since-deactivated
   * plan can still render the image it was actually placed against (plans are retained forever;
   * the active list alone cannot answer this).
   */
  public async getById (id: number): Promise<TGetFacilityPlanResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default FacilityPlanProvider
