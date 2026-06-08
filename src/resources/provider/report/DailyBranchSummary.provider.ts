import type { IGetDailyBranchSummaryList } from '@/models/request/report/daily-branch-summary/DailyBranchSummaryReq.model'
import type { TGetDailyBranchSummaryListResponse } from '@/models/response/report/daily-branch-summary/DailyBranchSummaryRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IDailyBranchSummaryProvider {
  getDailyBranchSummaryPaginate(query: IGetDailyBranchSummaryList): Promise<TGetDailyBranchSummaryListResponse>
}

class DailyBranchSummaryProvider extends HttpRequest implements IDailyBranchSummaryProvider {
  private urlPrefix: string = '/api/v1/management/report/daily-branch-summary'

  public async getDailyBranchSummaryPaginate (query: IGetDailyBranchSummaryList): Promise<TGetDailyBranchSummaryListResponse> {
    this.setLogHeaders({ menu: 'REPORT' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default DailyBranchSummaryProvider
