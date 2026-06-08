import type { IDashboardCardQuery, IDashboardChartQuery } from '@/models/request/dashboard/DashboardReq.model'
import type { TDashboardCardResponse, TDashboardChartResponse } from '@/models/response/dashboard/DashboardRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IDashboardProvider {
  getCard(query: IDashboardCardQuery): Promise<TDashboardCardResponse>
  getChartMarket(query: IDashboardChartQuery): Promise<TDashboardChartResponse>
  getChartLoan(query: IDashboardChartQuery): Promise<TDashboardChartResponse>
}

class DashboardProvider extends HttpRequest implements IDashboardProvider {
  private urlPrefix: string = '/api/v1/management/dashboard'

  async getCard (query: IDashboardCardQuery): Promise<TDashboardCardResponse> {
    this.setLogHeaders({ menu: 'DASHBOARD' })
    return this.get(`${this.urlPrefix}/card`, query)
  }

  async getChartMarket (query: IDashboardChartQuery): Promise<TDashboardChartResponse> {
    this.setLogHeaders({ menu: 'DASHBOARD' })
    return this.get(`${this.urlPrefix}/chart-market`, query)
  }

  async getChartLoan (query: IDashboardChartQuery): Promise<TDashboardChartResponse> {
    this.setLogHeaders({ menu: 'DASHBOARD' })
    return this.get(`${this.urlPrefix}/chart-loan`, query)
  }
}

export default DashboardProvider
