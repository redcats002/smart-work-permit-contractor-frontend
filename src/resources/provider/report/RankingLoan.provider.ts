import type { IGetRankLoanList } from '@/models/request/report/rank-loan/RankLoanReq.model'
import type { TGetRankLoanListResponse } from '@/models/response/report/rank-loan/RankLoanRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IRankingLoanProvider {
  getRankingLoanList(query: IGetRankLoanList): Promise<TGetRankLoanListResponse>
}

class RankingLoanProvider extends HttpRequest implements IRankingLoanProvider {
  private urlPrefix: string = '/api/v1/management/report/ranking-loan'

  public async getRankingLoanList (query: IGetRankLoanList): Promise<TGetRankLoanListResponse> {
    this.setLogHeaders({ menu: 'REPORT' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default RankingLoanProvider
