import type {
  ICreateCustomerOccupationPayload,
  IGetCustomerOccupationList,
  IUpdateCustomerOccupationPayload
} from '@/models/request/customer-occupation/CustomerOccupationReq.model'
import type {
  TActionCustomerOccupation,
  TGetCustomerOccupationByIdResponse,
  TGetCustomerOccupationListResponse
} from '@/models/response/customer-occupation/CustomerOccupationRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface ICustomerOccupationProvider {
  getCustomerOccupationPaginate (query: IGetCustomerOccupationList): Promise<TGetCustomerOccupationListResponse>
  createCustomerOccupation (payload: ICreateCustomerOccupationPayload): Promise<TActionCustomerOccupation>
  updateCustomerOccupation (id: TBaseParamsId, payload: IUpdateCustomerOccupationPayload): Promise<TActionCustomerOccupation>
  deleteCustomerOccupation (id: TBaseParamsId): Promise<TActionCustomerOccupation>
  getCustomerOccupationFindOne (id: TBaseParamsId): Promise<TGetCustomerOccupationByIdResponse>
}

class CustomerOccupationProvider extends HttpRequest implements ICustomerOccupationProvider {
  private urlPrefix: string = '/api/v1/customer-occupation'

  public async getCustomerOccupationPaginate (query: IGetCustomerOccupationList): Promise<TGetCustomerOccupationListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createCustomerOccupation (payload: ICreateCustomerOccupationPayload): Promise<TActionCustomerOccupation> {
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateCustomerOccupation (id: TBaseParamsId, payload: IUpdateCustomerOccupationPayload): Promise<TActionCustomerOccupation> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteCustomerOccupation (id: TBaseParamsId): Promise<TActionCustomerOccupation> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getCustomerOccupationFindOne (id: TBaseParamsId): Promise<TGetCustomerOccupationByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default CustomerOccupationProvider
