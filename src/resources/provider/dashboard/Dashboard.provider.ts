import HttpRequest from '@/resources/HttpRequest'

export interface IDashboardProvider {

}

class DashboardProvider extends HttpRequest implements IDashboardProvider {
  // private urlPrefix: string = '/api/v1/management/dashboard'
}

export default DashboardProvider
