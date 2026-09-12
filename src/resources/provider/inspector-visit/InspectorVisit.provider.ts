import type { IBasePaginationRequest } from '@/models/request/Request.model'
import type { TGetInspectorVisitListResponse } from '@/models/response/inspector-visit/InspectorVisitRes.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * wayfinder 112 (report) / 119 (api half, already shipped — api commits e589298/768156c). Read
 * only: this app never starts or submits a visit, that is the inspector app's job. Mirrors the
 * safety app's `InspectorVisit.provider.ts` class/interface/method names for parity — the safety
 * app is expected to build a near-identical copy of the report component next.
 *
 * `GET /permits/:id/inspector-visits` is own-permit-only for a contractor (map ruling 18) — a
 * request against another contractor's permit answers 403 with no `errorCode`.
 */
export interface IInspectorVisitProvider {
  list (permitId: string, query?: IBasePaginationRequest): Promise<TGetInspectorVisitListResponse>
}

class InspectorVisitProvider extends HttpRequest implements IInspectorVisitProvider {
  private urlPrefix: string = '/api/v1/permits'

  /** Newest first — one row per scan-started run, never the permit's own lifecycle state. */
  public async list (permitId: string, query?: IBasePaginationRequest): Promise<TGetInspectorVisitListResponse> {
    const response = await this.get(`${this.urlPrefix}/${permitId}/inspector-visits`, query)
    return response
  }
}

export default InspectorVisitProvider
