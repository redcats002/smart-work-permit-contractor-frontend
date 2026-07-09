import type { IRefinanceMakeAContractPayload, IRefinancePayload } from '@/models/request/refinance/RefinanceReq.model'
import type { TCreateRefinanceResponse, TGetRefinanceResponse, TMakeAContractResponse } from '@/models/response/refinance/RefinanceRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IRefinanceProvider {
  getRefinance(contractId: TBaseParamsId): Promise<TGetRefinanceResponse>
  createRefinance(contractId: TBaseParamsId, payload: IRefinancePayload): Promise<TCreateRefinanceResponse>
  makeAContract(contractId: TBaseParamsId, payload: IRefinanceMakeAContractPayload): Promise<TMakeAContractResponse>
}

class RefinanceProvider extends HttpRequest implements IRefinanceProvider {
  private urlPrefix: string = '/api/v1/management/refinance'

  public async getRefinance (contractId: TBaseParamsId): Promise<TGetRefinanceResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'รีไฟแนนซ์' })
    const response = await this.get(`${this.urlPrefix}/${contractId}`)
    return response
  }

  public async createRefinance (contractId: TBaseParamsId, payload: IRefinancePayload): Promise<TCreateRefinanceResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'รีไฟแนนซ์' })
    const response = await this.post(`${this.urlPrefix}/${contractId}`, payload)
    return response
  }

  public async makeAContract (contractId: TBaseParamsId, payload: IRefinanceMakeAContractPayload): Promise<TMakeAContractResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'รีไฟแนนซ์' })
    const response = await this.post(`${this.urlPrefix}/${contractId}/make-a-contract`, payload)
    return response
  }
}

export default RefinanceProvider
