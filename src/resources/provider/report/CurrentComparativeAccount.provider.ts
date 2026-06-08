import type { IGetCurrentComparativeList } from '@/models/request/report/current-comparative-account/CurrentComparativeReq.model'
import type { TGetCurrentComparativeAccountListResponse } from '@/models/response/report/current-comparative-account/CurrentComparativeAccountRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface ICurrentComparativeAccountProvider {
  getCurrentComparativeAccountPaginate(query: IGetCurrentComparativeList): Promise<TGetCurrentComparativeAccountListResponse>
}

class CurrentComparativeAccountProvider extends HttpRequest implements ICurrentComparativeAccountProvider {
  private urlPrefix: string = '/api/v1/management/report/current-comparative-account'

  public async getCurrentComparativeAccountPaginate (
    query: IGetCurrentComparativeList
  ): Promise<TGetCurrentComparativeAccountListResponse> {
    this.setLogHeaders({ menu: 'REPORT', subMenu: 'รายงานสรุปบัญชีเทียบปัจจุบัน' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default CurrentComparativeAccountProvider
