import type {
  ICreateExpense,
  IGetExpenseList,
  IUpdateExpense
} from '@/models/request/contract-expense/ContractExpenseReq.model'
import type {
  TActionContractExpenseResponse,
  TGetContractExpenseByIdResponse,
  TGetContractExpenseListResponse
} from '@/models/response/contract-expense/ContractExpenseRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IContractExpenseProvider {
  getExpenseList(id: TBaseParamsId, query?: IGetExpenseList): Promise<TGetContractExpenseListResponse>
  getExpenseById(id: TBaseParamsId): Promise<TGetContractExpenseByIdResponse>
  createExpense(id: TBaseParamsId, payload: ICreateExpense): Promise<TActionContractExpenseResponse>
  updateExpense(id: TBaseParamsId, payload: IUpdateExpense): Promise<TActionContractExpenseResponse>
  deleteExpense(id: TBaseParamsId): Promise<TActionContractExpenseResponse>
}

class ContractExpenseProvider extends HttpRequest implements IContractExpenseProvider {
  private urlPrefix: string = '/api/v1/management/contract-expense'

  public async getExpenseList (id: TBaseParamsId, query?: IGetExpenseList): Promise<TGetContractExpenseListResponse> {
    const response = await this.get(`${this.urlPrefix}/paginate/${id}`, query)
    return response
  }

  public async getExpenseById (id: TBaseParamsId): Promise<TGetContractExpenseByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async createExpense (id: TBaseParamsId, payload: ICreateExpense): Promise<TActionContractExpenseResponse> {
    const response = await this.post(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async updateExpense (id: TBaseParamsId, payload: IUpdateExpense): Promise<TActionContractExpenseResponse> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteExpense (id: TBaseParamsId): Promise<TActionContractExpenseResponse> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default ContractExpenseProvider
