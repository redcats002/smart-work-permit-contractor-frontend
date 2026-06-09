import type { ICreateCustomerGroupPayload, IGetCustomerGroupList, IUpdateCustomerGroupPayload } from '@/models/request/customer-group/CustomerGroupReq.model'
import type {
  TActionCustomerGroup,
  TGetCustomerGroupByIdResponse,
  TGetCustomerGroupListResponse
} from '@/models/response/customer-group/CustomerGroupRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface ICustomerGroupProvider {
  getCustomerGroupPaginate (query: IGetCustomerGroupList): Promise<TGetCustomerGroupListResponse>
  createCustomerGroup (payload: ICreateCustomerGroupPayload): Promise<TActionCustomerGroup>
  updateCustomerGroup (id: TBaseParamsId, payload: IUpdateCustomerGroupPayload): Promise<TActionCustomerGroup>
  deleteCustomerGroup (id: TBaseParamsId): Promise<TActionCustomerGroup>
  getCustomerGroupFindOne (id: TBaseParamsId): Promise<TGetCustomerGroupByIdResponse>
}

class CustomerGroupProvider extends HttpRequest implements ICustomerGroupProvider {
  private urlPrefix: string = '/api/v1/management/customer-group'

  public async getCustomerGroupPaginate (query: IGetCustomerGroupList): Promise<TGetCustomerGroupListResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'กลุ่มลูกค้า' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createCustomerGroup (payload: ICreateCustomerGroupPayload): Promise<TActionCustomerGroup> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'กลุ่มลูกค้า' })
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateCustomerGroup (id: TBaseParamsId, payload: IUpdateCustomerGroupPayload): Promise<TActionCustomerGroup> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'กลุ่มลูกค้า' })
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteCustomerGroup (id: TBaseParamsId): Promise<TActionCustomerGroup> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'กลุ่มลูกค้า' })
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getCustomerGroupFindOne (id: TBaseParamsId): Promise<TGetCustomerGroupByIdResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'กลุ่มลูกค้า' })
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default CustomerGroupProvider
