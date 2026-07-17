import type { ICloseContractPayload } from '@/models/request/close-contract/CloseContractReq.model'
import type { TActionCloseContract, TGetCloseContractResponse } from '@/models/response/close-contract/CloseContractRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface ICloseContractProvider {
  getCloseContract(contractId: TBaseParamsId): Promise<TGetCloseContractResponse>
  createCloseContract(contractId: TBaseParamsId, payload: ICloseContractPayload): Promise<TActionCloseContract>
}

class CloseContractProvider extends HttpRequest implements ICloseContractProvider {
  private urlPrefix: string = '/api/v1/management/close-contract'

  public async getCloseContract (contractId: TBaseParamsId): Promise<TGetCloseContractResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'ปิดบัญชี' })
    const response = await this.get(`${this.urlPrefix}/${contractId}`)
    return response
  }

  public async createCloseContract (contractId: TBaseParamsId, payload: ICloseContractPayload): Promise<TActionCloseContract> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'ปิดบัญชี' })
    const response = await this.post(`${this.urlPrefix}/${contractId}`, payload)
    return response
  }
}

export default CloseContractProvider
