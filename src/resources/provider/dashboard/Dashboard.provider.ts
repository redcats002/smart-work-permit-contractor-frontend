import type { IDashboardData } from '@/models/response/dashboard/DashboardRes.model'
import HttpRequest from '@/resources/HttpRequest'
import { dashboardMock } from './Dashboard.mock'

export interface IDashboardProvider {
  getDashboard: () => Promise<IDashboardData>
}

class DashboardProvider extends HttpRequest implements IDashboardProvider {
  private urlPrefix: string = '/api/v1/management/dashboard'

  async getDashboard (): Promise<IDashboardData> {
    void this.urlPrefix
    return Promise.resolve(dashboardMock)
  }
}

export default DashboardProvider
