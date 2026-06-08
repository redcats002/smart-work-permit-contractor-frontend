import type {
  ICreateIncome,
  IGetIncomeList,
  IUpdateIncome
} from '@/models/request/contract-income/ContractIncomeReq.model'
import type {
  TActionContractIncomeResponse,
  TGetContractIncomeByIdResponse,
  TGetContractIncomeListResponse
} from '@/models/response/contract-income/ContractIncomeRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IContractIncomeProvider {
  getIncomeList(id: TBaseParamsId, query?: IGetIncomeList): Promise<TGetContractIncomeListResponse>
  getIncomeById(id: TBaseParamsId): Promise<TGetContractIncomeByIdResponse>
  createIncome(id: TBaseParamsId, payload: ICreateIncome): Promise<TActionContractIncomeResponse>
  updateIncome(id: TBaseParamsId, payload: IUpdateIncome): Promise<TActionContractIncomeResponse>
  deleteIncome(id: TBaseParamsId): Promise<TActionContractIncomeResponse>
}

class ContractIncomeProvider extends HttpRequest implements IContractIncomeProvider {
  private urlPrefix: string = '/api/v1/management/contract-income'

  public async getIncomeList (id: TBaseParamsId, query?: IGetIncomeList): Promise<TGetContractIncomeListResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา > รายได้' })
    const response = await this.get(`${this.urlPrefix}/paginate/${id}`, query)
    return response
  }

  public async getIncomeById (id: TBaseParamsId): Promise<TGetContractIncomeByIdResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา > รายได้' })
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async createIncome (id: TBaseParamsId, payload: ICreateIncome): Promise<TActionContractIncomeResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา > รายได้' })
    const response = await this.post(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async updateIncome (id: TBaseParamsId, payload: IUpdateIncome): Promise<TActionContractIncomeResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา > รายได้' })
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteIncome (id: TBaseParamsId): Promise<TActionContractIncomeResponse> {
    this.setLogHeaders({ menu: 'CONTRACT', subMenu: 'สัญญา > รายได้' })
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default ContractIncomeProvider
