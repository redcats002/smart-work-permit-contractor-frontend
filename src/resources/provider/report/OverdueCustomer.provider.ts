import type { IGetOverdueCustomerList } from '@/models/request/report/overdue-customer/OverdueCustomerReq.model'
import type { TGetOverdueCustomerListResponse } from '@/models/response/report/overdue-customer/OverdueCustomerRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IOverdueCustomerProvider {
  getOverdueCustomerPaginate(query: IGetOverdueCustomerList): Promise<TGetOverdueCustomerListResponse>
}

class OverdueCustomerProvider extends HttpRequest implements IOverdueCustomerProvider {
  private urlPrefix: string = '/api/v1/management/report/overdue-customer'

  public async getOverdueCustomerPaginate (
    query: IGetOverdueCustomerList
  ): Promise<TGetOverdueCustomerListResponse> {
    this.setLogHeaders({ menu: 'REPORT' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default OverdueCustomerProvider
