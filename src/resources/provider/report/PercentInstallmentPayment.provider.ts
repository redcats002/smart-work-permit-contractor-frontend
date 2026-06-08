import type { IGetPercentInstallmentList } from '@/models/request/report/percent-installment/PercentInstallmentReq.model'
import type { TGetPercentInstallmentListResponse } from '@/models/response/report/percent-installment/PercentInstallmentRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IPercentInstallmentPaymentProvider {
  getPercentInstallmentPaymentPaginate(query: IGetPercentInstallmentList): Promise<TGetPercentInstallmentListResponse>
}

class PercentInstallmentPaymentProvider extends HttpRequest implements IPercentInstallmentPaymentProvider {
  private urlPrefix: string = '/api/v1/management/report/percent-installment-payment'

  public async getPercentInstallmentPaymentPaginate (
    query: IGetPercentInstallmentList
  ): Promise<TGetPercentInstallmentListResponse> {
    this.setLogHeaders({ menu: 'REPORT', subMenu: 'รายงานรับชำระค่างวดคิดเป็นเปอร์เซ็นต์' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default PercentInstallmentPaymentProvider
