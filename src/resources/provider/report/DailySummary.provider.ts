import type { ICreateDailySummary, IGetDailySummaryList } from '@/models/request/report/daily-summary/DailySummary.model'
import type {
  IDailySummaryById,
  IDailySummaryFind,
  TGetDailySummaryListResponse
} from '@/models/response/report/daily-summary/DailySummaryRes'
import HttpRequest from '@/resources/HttpRequest'

export interface IDailySummaryProvider {
  getDailySummaryList(query: IGetDailySummaryList): Promise<TGetDailySummaryListResponse>
  getDailySummaryFind(): Promise<{ data: IDailySummaryFind }>
  getDailySummaryById(id: number): Promise<{ data: IDailySummaryById }>
  createDailySummary(body: ICreateDailySummary): Promise<void>
}

class DailySummaryProvider extends HttpRequest implements IDailySummaryProvider {
  private urlPrefix: string = '/api/v1/management/report/daily-summary'

  public async getDailySummaryList (query: IGetDailySummaryList): Promise<TGetDailySummaryListResponse> {
    this.setLogHeaders({ menu: 'REPORT', subMenu: 'รายงานสรุปประจำวัน' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async getDailySummaryFind (): Promise<{ data: IDailySummaryFind }> {
    this.setLogHeaders({ menu: 'REPORT', subMenu: 'รายงานสรุปประจำวัน' })
    const response = await this.get(`${this.urlPrefix}/find`)
    return response
  }

  public async getDailySummaryById (id: number): Promise<{ data: IDailySummaryById }> {
    this.setLogHeaders({ menu: 'REPORT', subMenu: 'รายงานสรุปประจำวัน' })
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async createDailySummary (body: ICreateDailySummary): Promise<void> {
    this.setLogHeaders({ menu: 'REPORT', subMenu: 'รายงานสรุปประจำวัน' })
    await this.post(`${this.urlPrefix}`, body)
  }
}

export default DailySummaryProvider
