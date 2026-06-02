import type { IGetDailyInstallmentList } from '@/models/request/report/daliy-installment-payment/DailyInstallmentPayment.model'
import type { TGetDailyInstallmentPaymentListResponse } from '@/models/response/report/daily-installment-payment/DailyInstallmentPaymentRes'
import HttpRequest from '@/resources/HttpRequest'

export interface IDailyInstallmentPaymentProvider {
  getDailyInstallmentPaymentPaginate(query: IGetDailyInstallmentList): Promise<TGetDailyInstallmentPaymentListResponse>
}

class DailyInstallmentPaymentProvider extends HttpRequest implements IDailyInstallmentPaymentProvider {
  private urlPrefix: string = '/api/v1/management/report/daily-installment-payment'

  public async getDailyInstallmentPaymentPaginate (query: IGetDailyInstallmentList): Promise<TGetDailyInstallmentPaymentListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default DailyInstallmentPaymentProvider
