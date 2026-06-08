import type { IGetAnnualFinanceReceiptList } from '@/models/request/report/annual-finance-receipt/AnnualFinanceReceiptReq.model'
import type { TGetAnnualFinanceReceiptListResponse } from '@/models/response/report/annual-finance-receipt/AnnualFinanceReceiptRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IAnnualFinanceReceiptProvider {
  getAnnualFinanceReceiptPaginate(query: IGetAnnualFinanceReceiptList): Promise<TGetAnnualFinanceReceiptListResponse>
}

class AnnualFinanceReceiptProvider extends HttpRequest implements IAnnualFinanceReceiptProvider {
  private urlPrefix: string = '/api/v1/management/report/annual-finance-receipt'

  public async getAnnualFinanceReceiptPaginate (query: IGetAnnualFinanceReceiptList): Promise<TGetAnnualFinanceReceiptListResponse> {
    this.setLogHeaders({ menu: 'REPORT', subMenu: 'รายงานสรุปรับไฟแนนซ์ประจำปี' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default AnnualFinanceReceiptProvider
