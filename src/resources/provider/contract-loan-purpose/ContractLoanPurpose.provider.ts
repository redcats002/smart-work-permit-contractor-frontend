import type {
  ICreateContractLoanPurposePayload,
  IGetContractLoanPurposeList,
  IUpdateContractLoanPurposePayload
} from '@/models/request/contract-loan-purpose/ContractLoanPurposeReq.model'
import type {
  TActionContractLoanPurpose,
  TGetContractLoanPurposeByIdResponse,
  TGetContractLoanPurposeListResponse
} from '@/models/response/contract-loan-purpose/ContractLoanPurposeRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IContractLoanPurposeProvider {
  getContractLoanPurposePaginate (query: IGetContractLoanPurposeList): Promise<TGetContractLoanPurposeListResponse>
  createContractLoanPurpose (payload: ICreateContractLoanPurposePayload): Promise<TActionContractLoanPurpose>
  updateContractLoanPurpose (id: TBaseParamsId, payload: IUpdateContractLoanPurposePayload): Promise<TActionContractLoanPurpose>
  deleteContractLoanPurpose (id: TBaseParamsId): Promise<TActionContractLoanPurpose>
  getContractLoanPurposeFindOne (id: TBaseParamsId): Promise<TGetContractLoanPurposeByIdResponse>
}

class ContractLoanPurposeProvider extends HttpRequest implements IContractLoanPurposeProvider {
  private urlPrefix: string = '/api/v1/contract-loan-purpose'

  public async getContractLoanPurposePaginate (query: IGetContractLoanPurposeList): Promise<TGetContractLoanPurposeListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createContractLoanPurpose (payload: ICreateContractLoanPurposePayload): Promise<TActionContractLoanPurpose> {
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateContractLoanPurpose (id: TBaseParamsId, payload: IUpdateContractLoanPurposePayload): Promise<TActionContractLoanPurpose> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteContractLoanPurpose (id: TBaseParamsId): Promise<TActionContractLoanPurpose> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getContractLoanPurposeFindOne (id: TBaseParamsId): Promise<TGetContractLoanPurposeByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default ContractLoanPurposeProvider
