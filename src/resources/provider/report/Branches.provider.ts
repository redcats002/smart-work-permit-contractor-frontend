import type { IGetBranchSummaryReportList } from '@/models/request/report/branch-summary/BranchSummaryReq.model'
import type { TGetBranchSummaryReportListResponse } from '@/models/response/report/branch-summary/BranchSummaryRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IReportBranchesProvider {
  getReportBranchesPaginate(query: IGetBranchSummaryReportList): Promise<TGetBranchSummaryReportListResponse>
}

class ReportBranchesProvider extends HttpRequest implements IReportBranchesProvider {
  private urlPrefix: string = '/api/v1/management/report/branch-summary'

  public async getReportBranchesPaginate (query: IGetBranchSummaryReportList): Promise<TGetBranchSummaryReportListResponse> {
    this.setLogHeaders({ menu: 'REPORT' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default ReportBranchesProvider
