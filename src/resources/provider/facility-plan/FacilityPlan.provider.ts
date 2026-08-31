import type { TGetActiveFacilityPlanResponse, TGetFacilityPlanResponse } from '@/models/response/facility-plan/FacilityPlanRes.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * Read-only against `/api/v1/facility-plans` — this app never uploads, creates or activates a
 * plan version (that is a Safety Officer action in the sibling repo; `facility-plans` is a
 * server-owned upload prefix, see ../PROMPT-LOG.md "the facility plan is not an ordinary
 * upload"). `getActive`/`getById` are open to every role, including a contractor placing a pin
 * while drafting (feat-023).
 */
export interface IFacilityPlanProvider {
  getActive (): Promise<TGetActiveFacilityPlanResponse>
  getById (id: number): Promise<TGetFacilityPlanResponse>
}

class FacilityPlanProvider extends HttpRequest implements IFacilityPlanProvider {
  private urlPrefix: string = '/api/v1/facility-plans'

  /** `null` when no plan has ever been activated — the current production state today. */
  public async getActive (): Promise<TGetActiveFacilityPlanResponse> {
    const response = await this.get(`${this.urlPrefix}/active`)
    return response
  }

  /**
   * Resolves ANY version by id, active or not — required so a permit frozen against an older
   * plan can still render the version it was actually placed on (plan versions are immutable
   * and retained forever; the active endpoint alone cannot answer this).
   */
  public async getById (id: number): Promise<TGetFacilityPlanResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default FacilityPlanProvider
