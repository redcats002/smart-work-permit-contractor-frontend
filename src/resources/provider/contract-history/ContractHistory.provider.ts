import type {
  ICreateContractHistoryPayload,
  IGetContactHistoryList
} from '@/models/request/contract-history/ContractHistoryReq.model'
import type {
  TActionContractHistoryResponse,
  TGetContractHistoryByIdResponse,
  TGetContractHistoryListResponse
} from '@/models/response/contract-history/ContractHistoryRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IContractHistoryProvider {
  getContractHistoryList(id: TBaseParamsId, query?: IGetContactHistoryList): Promise<TGetContractHistoryListResponse>
  getContractHistoryById(id: TBaseParamsId): Promise<TGetContractHistoryByIdResponse>
  createContractHistory(id: TBaseParamsId, payload: ICreateContractHistoryPayload): Promise<TActionContractHistoryResponse>
  deleteContractHistory(id: TBaseParamsId): Promise<TActionContractHistoryResponse>
}

class ContractHistoryProvider extends HttpRequest implements IContractHistoryProvider {
  private urlPrefix: string = '/api/v1/management/contract-contact-history'

  public async getContractHistoryList (id: TBaseParamsId, query?: IGetContactHistoryList): Promise<TGetContractHistoryListResponse> {
    const response = await this.get(`${this.urlPrefix}/paginate/${id}`, query)
    return response
  }

  public async getContractHistoryById (id: TBaseParamsId): Promise<TGetContractHistoryByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async createContractHistory (id: TBaseParamsId, payload: ICreateContractHistoryPayload): Promise<TActionContractHistoryResponse> {
    const response = await this.post(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteContractHistory (id: TBaseParamsId): Promise<TActionContractHistoryResponse> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default ContractHistoryProvider
