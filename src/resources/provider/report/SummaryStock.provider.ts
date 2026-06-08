import type { IGetSummaryStockList } from '@/models/request/report/summary-stock/SummaryStockReq.model'
import type { TGetSummaryStockResponse } from '@/models/response/report/summary-stock/SummaryStockRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface ISummaryStockProvider {
  getSummaryStock(query?: IGetSummaryStockList): Promise<TGetSummaryStockResponse>
}

class SummaryStockProvider extends HttpRequest implements ISummaryStockProvider {
  private urlPrefix: string = '/api/v1/management/report/summary-stock'

  public async getSummaryStock (query?: IGetSummaryStockList): Promise<TGetSummaryStockResponse> {
    this.setLogHeaders({ menu: 'REPORT' })
    return this.get(this.urlPrefix, query)
  }
}

export default SummaryStockProvider
