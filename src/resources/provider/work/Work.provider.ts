import type { IGetNewWorkList } from '@/models/request/work/WorkReq.model'
import type { TGetNewWorkAppraisalListResponse, TGetNewWorkFollowUpListResponse } from '@/models/response/work/WorkRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IWorkProvider {
  getWorkAppraisalPaginate (query: IGetNewWorkList): Promise<TGetNewWorkAppraisalListResponse>
  getWorkFollowUpPaginate (query: IGetNewWorkList): Promise<TGetNewWorkFollowUpListResponse>
}

class WorkProvider extends HttpRequest implements IWorkProvider {
  private urlPrefix: string = '/api/v1/work'

  public async getWorkAppraisalPaginate (query: IGetNewWorkList): Promise<TGetNewWorkAppraisalListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async getWorkFollowUpPaginate (query: IGetNewWorkList): Promise<TGetNewWorkFollowUpListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default WorkProvider
