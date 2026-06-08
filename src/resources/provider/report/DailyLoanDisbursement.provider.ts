import type { IGetDailyLoanDisbursementList } from '@/models/request/report/daily-loan-disbursement/DailyLoanDisbursementReq.model'
import type { TGetDailyLoanDisbursementListResponse } from '@/models/response/report/daily-loan-disbursement/DailyLoanDisbursementRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IDailyLoanDisbursementProvider {
  getDailyLoanDisbursementPaginate(query: IGetDailyLoanDisbursementList): Promise<TGetDailyLoanDisbursementListResponse>
}

class DailyLoanDisbursementProvider extends HttpRequest implements IDailyLoanDisbursementProvider {
  private urlPrefix: string = '/api/v1/management/report/daily-loan-disbursement'

  public async getDailyLoanDisbursementPaginate (query: IGetDailyLoanDisbursementList): Promise<TGetDailyLoanDisbursementListResponse> {
    this.setLogHeaders({ menu: 'REPORT' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default DailyLoanDisbursementProvider
