import type { TGetEntrantListResponse } from '@/models/response/entrant/EntrantRes.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * wayfinder 112. Read only — this app never scans an entrant in/out, that is the inspector app's
 * job. Mirrors the safety app's `Entrant.provider.ts` class/interface/method name for parity.
 *
 * `list()` returns only CURRENTLY-INSIDE workers, not a full in/out history — see the model's own
 * doc comment. The permit report derives the in/out history from the audit trail instead
 * (`usePermitReport.ts`) and uses this endpoint only for "who is inside right now".
 */
export interface IEntrantProvider {
  list (permitId: string): Promise<TGetEntrantListResponse>
}

class EntrantProvider extends HttpRequest implements IEntrantProvider {
  private urlPrefix: string = '/api/v1/permits'

  public async list (permitId: string): Promise<TGetEntrantListResponse> {
    const response = await this.get(`${this.urlPrefix}/${permitId}/entrants`)
    return response
  }
}

export default EntrantProvider
