import type {
  IGetCompleteWorkAssetAppraisalList,
  IGetCompleteWorkAssetFollowUpList,
  IGetNewWorkAssetAppraisalList,
  IGetNewWorkAssetFollowUpList
} from '@/models/request/work/WorkReq.model'
import type {
  TGetCompleteWorkAppraisalListResponse,
  TGetCompleteWorkFollowUpListResponse,
  TGetNewWorkAppraisalListResponse,
  TGetNewWorkFollowUpListResponse
} from '@/models/response/work/WorkRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IWorkProvider {
  getWorkAppraisalNewPaginate (query: IGetNewWorkAssetAppraisalList): Promise<TGetNewWorkAppraisalListResponse>
  getWorkAppraisalCompletePaginate (query: IGetCompleteWorkAssetAppraisalList): Promise<TGetCompleteWorkAppraisalListResponse>
  getWorkFollowUpNewPaginate (query: IGetNewWorkAssetFollowUpList): Promise<TGetNewWorkFollowUpListResponse>
  getWorkFollowUpCompletePaginate (query: IGetCompleteWorkAssetFollowUpList): Promise<TGetCompleteWorkFollowUpListResponse>
}

class WorkProvider extends HttpRequest implements IWorkProvider {
  private urlPrefix: string = '/api/v1/work'

  public async getWorkAppraisalNewPaginate (query: IGetNewWorkAssetAppraisalList): Promise<TGetNewWorkAppraisalListResponse> {
    const response = await this.get(`${this.urlPrefix}/assets-appraisal/new`, query)
    return response
  }

  public async getWorkAppraisalCompletePaginate (query: IGetCompleteWorkAssetAppraisalList): Promise<TGetCompleteWorkAppraisalListResponse> {
    const response = await this.get(`${this.urlPrefix}/assets-appraisal/complete`, query)
    return response
  }

  public async getWorkFollowUpNewPaginate (query: IGetNewWorkAssetFollowUpList): Promise<TGetNewWorkFollowUpListResponse> {
    const response = await this.get(`${this.urlPrefix}/follow-up/new`, query)
    return response
  }

  public async getWorkFollowUpCompletePaginate (query: IGetCompleteWorkAssetFollowUpList): Promise<TGetCompleteWorkFollowUpListResponse> {
    const response = await this.get(`${this.urlPrefix}/follow-up/complete`, query)
    return response
  }
}

export default WorkProvider
