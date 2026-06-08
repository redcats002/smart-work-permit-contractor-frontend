import type { IGetFinancialSummaryReportList } from '@/models/request/report/financial-summary/FinancialSummaryReq.model'
import type { TGetFinancialSummaryReportListResponse } from '@/models/response/report/financial-summary/FinancialSummaryRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IFinancialSummaryProvider {
  getFinancialSummaryPaginate(query: IGetFinancialSummaryReportList): Promise<TGetFinancialSummaryReportListResponse>
}

class FinancialSummaryProvider extends HttpRequest implements IFinancialSummaryProvider {
  private urlPrefix: string = '/api/v1/management/report/financial-summary'

  public async getFinancialSummaryPaginate (query: IGetFinancialSummaryReportList): Promise<TGetFinancialSummaryReportListResponse> {
    this.setLogHeaders({ menu: 'REPORT' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default FinancialSummaryProvider
