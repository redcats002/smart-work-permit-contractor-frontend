import type { ICreateCustomerPayload, IGetCustomerList, IUpdateCustomerPayload } from '@/models/request/customer/CustomerReq.model'
import type { TActionCustomer, TGetCustomerByIdResponse, TGetCustomerListResponse } from '@/models/response/customer/CustomerRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface ICustomerProvider {
  getCustomerPaginate (query: IGetCustomerList): Promise<TGetCustomerListResponse>
  createCustomer (payload: ICreateCustomerPayload): Promise<TActionCustomer>
  updateCustomer (id: TBaseParamsId, payload: IUpdateCustomerPayload): Promise<TActionCustomer>
  deleteCustomer (id: number): Promise<TActionCustomer>
  getCustomerFindOne (id: TBaseParamsId): Promise<TGetCustomerByIdResponse>
}

class CustomerProvider extends HttpRequest implements ICustomerProvider {
  private urlPrefix: string = '/api/v1/customers'

  public async getCustomerPaginate (query: IGetCustomerList): Promise<TGetCustomerListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createCustomer (payload: ICreateCustomerPayload): Promise<TActionCustomer> {
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateCustomer (id: TBaseParamsId, payload: IUpdateCustomerPayload): Promise<TActionCustomer> {
    const response = await this.post(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteCustomer (id: number): Promise<TActionCustomer> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getCustomerFindOne (id: TBaseParamsId): Promise<TGetCustomerByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default CustomerProvider
