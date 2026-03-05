import type {
  ICreateCustomerPayload,
  IGetCustomerContactHistoryList,
  IGetCustomerContractList,
  IGetCustomerEstateList,
  IGetCustomerList,
  IGetCustomerPaymentHistoryList,
  IUpdateCustomerPayload
} from '@/models/request/customer/CustomerReq.model'
import type {
  TActionCustomer,
  TGetCustomerByIdResponse,
  TGetCustomerContactHistoryListResponse,
  TGetCustomerContractListResponse,
  TGetCustomerEstateListResponse,
  TGetCustomerListResponse,
  TGetCustomerPaymentHistoryListResponse
} from '@/models/response/customer/CustomerRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface ICustomerProvider {
  getCustomerPaginate (query: IGetCustomerList): Promise<TGetCustomerListResponse>
  createCustomer (payload: ICreateCustomerPayload): Promise<TActionCustomer>
  updateCustomer (id: TBaseParamsId, payload: IUpdateCustomerPayload): Promise<TActionCustomer>
  deleteCustomer (id: number): Promise<TActionCustomer>
  getCustomerFindOne (id: TBaseParamsId): Promise<TGetCustomerByIdResponse>
  getCustomerContracts (id: TBaseParamsId, query: IGetCustomerContractList): Promise<TGetCustomerContractListResponse>
  getCustomerPaymentHistory (id: TBaseParamsId, query: IGetCustomerPaymentHistoryList): Promise<TGetCustomerPaymentHistoryListResponse>
  getCustomerContactHistory (id: TBaseParamsId, query: IGetCustomerContactHistoryList): Promise<TGetCustomerContactHistoryListResponse>
  getCustomerEstates (id: TBaseParamsId, query: IGetCustomerEstateList): Promise<TGetCustomerEstateListResponse>
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
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
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

  public async getCustomerContracts (id: TBaseParamsId, query: IGetCustomerContractList): Promise<TGetCustomerContractListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/contracts`, query)
    return response
  }

  public async getCustomerPaymentHistory (id: TBaseParamsId, query: IGetCustomerPaymentHistoryList): Promise<TGetCustomerPaymentHistoryListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/payment-history`, query)
    return response
  }

  public async getCustomerContactHistory (id: TBaseParamsId, query: IGetCustomerContactHistoryList): Promise<TGetCustomerContactHistoryListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/contact-history`, query)
    return response
  }

  public async getCustomerEstates (id: TBaseParamsId, query: IGetCustomerEstateList): Promise<TGetCustomerEstateListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/estates`, query)
    return response
  }
}

export default CustomerProvider
