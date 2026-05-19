import type { IGetOutstandingDebtorList } from '@/models/request/report/outstanding-debtor/OutstandingDebtorReq.model'
import type { TGetOutstandingDebtorListResponse } from '@/models/response/report/outstanding-debtor/OutstandingDebtorRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IOutstandingDebtorProvider {
  getOutstandingDebtorPaginate(query: IGetOutstandingDebtorList): Promise<TGetOutstandingDebtorListResponse>
}

class OutstandingDebtorProvider extends HttpRequest implements IOutstandingDebtorProvider {
  private urlPrefix: string = '/api/v1/management/report/outstanding-debtor'

  public async getOutstandingDebtorPaginate (
    query: IGetOutstandingDebtorList
  ): Promise<TGetOutstandingDebtorListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default OutstandingDebtorProvider
