import type {
  IAppraisalPricePayload,
  ICreatePreContractPayload,
  IGetPreContractList,
  IRequestReappraisalPayload,
  IUpdatePreContractPayload
} from '@/models/request/pre-contract/PreContractReq.model'
import type {
  TActionPreContract,
  TAppraisalPricePreContract,
  TConfirmAppraisalPreContract,
  TGetPreContractByIdResponse,
  TGetPreContractListResponse,
  TRequestReappraisalPreContract
} from '@/models/response/pre-contract/PreContractRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IPreContractProvider {
  getContractPaginate (query: IGetPreContractList): Promise<TGetPreContractListResponse>
  createContract (payload: ICreatePreContractPayload): Promise<TActionPreContract>
  updateContract (id: TBaseParamsId, payload: IUpdatePreContractPayload): Promise<TActionPreContract>
  deleteContract (id: number): Promise<TActionPreContract>
  getContractFindOne (id: TBaseParamsId): Promise<TGetPreContractByIdResponse>
  requestReappraisal (id: TBaseParamsId, payload: IRequestReappraisalPayload): Promise<TRequestReappraisalPreContract>
  appraisalPrice (id: TBaseParamsId, payload: IAppraisalPricePayload): Promise<TAppraisalPricePreContract>
  confirmAppraisal (id: TBaseParamsId): Promise<TConfirmAppraisalPreContract>
}

class PreContractProvider extends HttpRequest implements IPreContractProvider {
  private urlPrefix: string = '/api/v1/pre-contract'

  public async getContractPaginate (query: IGetPreContractList): Promise<TGetPreContractListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createContract (payload: ICreatePreContractPayload): Promise<TActionPreContract> {
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateContract (id: TBaseParamsId, payload: IUpdatePreContractPayload): Promise<TActionPreContract> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteContract (id: number): Promise<TActionPreContract> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getContractFindOne (id: TBaseParamsId): Promise<TGetPreContractByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async requestReappraisal (id: TBaseParamsId, payload: IRequestReappraisalPayload): Promise<TRequestReappraisalPreContract> {
    const response = await this.post(`${this.urlPrefix}/request-reappraisal/${id}`, payload)
    return response
  }

  public async confirmAppraisal (id: TBaseParamsId): Promise<TConfirmAppraisalPreContract> {
    const response = await this.post(`${this.urlPrefix}/confirm-appraisal/${id}`)
    return response
  }

  public async appraisalPrice (id: TBaseParamsId, payload: IAppraisalPricePayload): Promise<TAppraisalPricePreContract> {
    const response = await this.post(`${this.urlPrefix}/appraisal-price/${id}`, payload)
    return response
  }
}
export default PreContractProvider
