import type {
  ICreateContractLoanTypePayload,
  IGetContractLoanTypeList,
  IUpdateContractLoanTypePayload
} from '@/models/request/contract-loan-type/ContractLoanTypeReq.model'
import type {
  TActionContractLoanType,
  TGetContractLoanTypeByIdResponse,
  TGetContractLoanTypeListResponse
} from '@/models/response/contract-loan-type/ContractLoanTypeRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IContractLoanTypeProvider {
  getContractLoanTypePaginate (query: IGetContractLoanTypeList): Promise<TGetContractLoanTypeListResponse>
  createContractLoanType (payload: ICreateContractLoanTypePayload): Promise<TActionContractLoanType>
  updateContractLoanType (id: TBaseParamsId, payload: IUpdateContractLoanTypePayload): Promise<TActionContractLoanType>
  deleteContractLoanType (id: TBaseParamsId): Promise<TActionContractLoanType>
  getContractLoanTypeFindOne (id: TBaseParamsId): Promise<TGetContractLoanTypeByIdResponse>
}

class ContractLoanTypeProvider extends HttpRequest implements IContractLoanTypeProvider {
  private urlPrefix: string = '/api/v1/management/contract-loan-type'

  public async getContractLoanTypePaginate (query: IGetContractLoanTypeList): Promise<TGetContractLoanTypeListResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ประเภทสินเชื่อ' })
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createContractLoanType (payload: ICreateContractLoanTypePayload): Promise<TActionContractLoanType> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ประเภทสินเชื่อ' })
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateContractLoanType (id: TBaseParamsId, payload: IUpdateContractLoanTypePayload): Promise<TActionContractLoanType> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ประเภทสินเชื่อ' })
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteContractLoanType (id: TBaseParamsId): Promise<TActionContractLoanType> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ประเภทสินเชื่อ' })
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getContractLoanTypeFindOne (id: TBaseParamsId): Promise<TGetContractLoanTypeByIdResponse> {
    this.setLogHeaders({ menu: 'SETTING', subMenu: 'ประเภทสินเชื่อ' })
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default ContractLoanTypeProvider
