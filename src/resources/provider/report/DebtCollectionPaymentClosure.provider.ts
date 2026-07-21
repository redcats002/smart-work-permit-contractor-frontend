import type { IGetAccountClosureList } from '@/models/request/report/account-closure/AccountClosureReq.model'
import type { TGetAccountClosureListResponse } from '@/models/response/report/account-closure/AccountClosureRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IDebtCollectionPaymentClosureProvider {
  getDebtCollectionPaymentClosurePaginate(query: IGetAccountClosureList): Promise<TGetAccountClosureListResponse>
}

class DebtCollectionPaymentClosureProvider extends HttpRequest implements IDebtCollectionPaymentClosureProvider {
  private urlPrefix: string = '/api/v1/management/report/debt-collection-payment-closure'

  public async getDebtCollectionPaymentClosurePaginate (
    query: IGetAccountClosureList
  ): Promise<TGetAccountClosureListResponse> {
    this.setLogHeaders({ menu: 'REPORT', subMenu: 'รายงานการรับชำระปิดบัญชี' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default DebtCollectionPaymentClosureProvider
