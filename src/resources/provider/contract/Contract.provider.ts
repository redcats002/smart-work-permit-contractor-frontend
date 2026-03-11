import type { ICreateContractPayload, IGetContractList, IUpdateContractPayload } from '@/models/request/contract/ContractReq.model'
import type { TActionContract, TGetContractByIdResponse, TGetContractListResponse } from '@/models/response/contract/ContractRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IContractProvider {
  getContractPaginate (query: IGetContractList): Promise<TGetContractListResponse>
  createContract (payload: ICreateContractPayload): Promise<TActionContract>
  updateContract (id: TBaseParamsId, payload: IUpdateContractPayload): Promise<TActionContract>
  deleteContract (id: number): Promise<TActionContract>
  getContractFindOne (id: TBaseParamsId): Promise<TGetContractByIdResponse>
  saveCollateralDetail (contractId: TBaseParamsId, collateralId: TBaseParamsId, formData: FormData): Promise<TActionContract>
  requestAssessmentPrice (id: TBaseParamsId): Promise<TActionContract>
}

class ContractProvider extends HttpRequest implements IContractProvider {
  private urlPrefix: string = '/api/v1/contract'

  public async getContractPaginate (query: IGetContractList): Promise<TGetContractListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createContract (payload: ICreateContractPayload): Promise<TActionContract> {
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateContract (id: TBaseParamsId, payload: IUpdateContractPayload): Promise<TActionContract> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteContract (id: number): Promise<TActionContract> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getContractFindOne (id: TBaseParamsId): Promise<TGetContractByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async saveCollateralDetail (
    contractId: TBaseParamsId,
    collateralId: TBaseParamsId,
    formData: FormData
  ): Promise<TActionContract> {
    this.setAuthHeader('BRANCH')
    const response = await this.put(
      `${this.urlPrefix}/${contractId}/collateral/${collateralId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }
    )
    return response
  }

  public async requestAssessmentPrice (id: TBaseParamsId): Promise<TActionContract> {
    this.setAuthHeader('BRANCH')
    const response = await this.post(`${this.urlPrefix}/${id}/request-assessment`, {})
    return response
  }
}
export default ContractProvider
