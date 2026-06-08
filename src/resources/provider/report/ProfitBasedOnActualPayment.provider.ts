import type { IGetProfitBasedOnActualPaymentList } from '@/models/request/report/profit-based-on-actual-payment/ProfitBasedOnActualPaymentReq.model'
import type { TGetProfitBasedOnActualPaymentListResponse } from '@/models/response/report/profit-based-on-actual-payment/ProfitBasedOnActualPaymentRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IProfitBasedOnActualPaymentProvider {
  getProfitBasedOnActualPaymentPaginate(query: IGetProfitBasedOnActualPaymentList): Promise<TGetProfitBasedOnActualPaymentListResponse>
}

class ProfitBasedOnActualPaymentProvider extends HttpRequest implements IProfitBasedOnActualPaymentProvider {
  private urlPrefix: string = '/api/v1/management/report/profit-based-on-actual-payment'

  public async getProfitBasedOnActualPaymentPaginate (query: IGetProfitBasedOnActualPaymentList):
  Promise<TGetProfitBasedOnActualPaymentListResponse> {
    this.setLogHeaders({ menu: 'REPORT', subMenu: 'รายงานกำไรตามการรับชำระจริง' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default ProfitBasedOnActualPaymentProvider
