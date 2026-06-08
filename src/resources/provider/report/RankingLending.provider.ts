import type { IGetRankLendingList } from '@/models/request/report/rank-lending/RankLendingReq.model'
import type { TGetRankLendingListResponse } from '@/models/response/report/rank-lending/RankLendingRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IRankingLendingProvider {
  getRankingLendingList(query: IGetRankLendingList): Promise<TGetRankLendingListResponse>
}

class RankingLendingProvider extends HttpRequest implements IRankingLendingProvider {
  private urlPrefix: string = '/api/v1/management/report/ranking-lending'

  public async getRankingLendingList (query: IGetRankLendingList): Promise<TGetRankLendingListResponse> {
    this.setLogHeaders({ menu: 'REPORT', subMenu: 'รายงานอันดับ 1-25 การปล่อยสินเชื่อ' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default RankingLendingProvider
