import type { IGetLoanDisbursementSummaryList } from '@/models/request/report/loan-disbursement-summary/LoanDisbursementSummaryReq.model'
import type { TGetLoanDisbursementSummaryListResponse } from '@/models/response/report/loan-disbursement-summary/LoanDisbursementSummaryRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface ILoanDisbursementSummaryProvider {
  getLoanDisbursementSummaryPaginate(query: IGetLoanDisbursementSummaryList): Promise<TGetLoanDisbursementSummaryListResponse>
}

class LoanDisbursementSummaryProvider extends HttpRequest implements ILoanDisbursementSummaryProvider {
  private urlPrefix: string = '/api/v1/management/report/loan-disbursement-summary'

  public async getLoanDisbursementSummaryPaginate (query: IGetLoanDisbursementSummaryList): Promise<TGetLoanDisbursementSummaryListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default LoanDisbursementSummaryProvider
