import type { IGetLeaderBranchReportList } from '@/models/request/leader-branch-report/LeaderBranchReportReq.model'
import type { TGetLeaderBranchReportListResponse } from '@/models/response/leader-branch-report/LeaderBranchReportRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface ILeaderBranchReportProvider {
  getLeaderBranchReportPaginate (
    query: IGetLeaderBranchReportList
  ): Promise<TGetLeaderBranchReportListResponse>
}

class LeaderBranchReportProvider extends HttpRequest implements ILeaderBranchReportProvider {
  private urlPrefix: string = '/api/v1/management/report/leader-branch-report'

  public async getLeaderBranchReportPaginate (
    query: IGetLeaderBranchReportList
  ): Promise<TGetLeaderBranchReportListResponse> {
    this.setLogHeaders({ menu: 'REPORT', subMenu: 'รายงานผลการเบิก' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default LeaderBranchReportProvider
