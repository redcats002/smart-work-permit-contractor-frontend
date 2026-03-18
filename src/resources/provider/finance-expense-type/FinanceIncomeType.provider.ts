import type {
  ICreateFinanceExpenseTypePayload,
  IGetFinanceExpenseTypeList,
  IUpdateFinanceExpenseTypePayload
} from '@/models/request/finance-expense-type/FinanceExpenseTypeReq.model'
import type {
  TActionFinanceExpenseType,
  TGetFinanceExpenseTypeByIdResponse,
  TGetFinanceExpenseTypeListResponse
} from '@/models/response/finance-expense-type/FinanceExpenseTypeRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IFinanceExpenseTypeProvider {
  getFinanceExpenseTypePaginate (query: IGetFinanceExpenseTypeList): Promise<TGetFinanceExpenseTypeListResponse>
  createFinanceExpenseType (payload: ICreateFinanceExpenseTypePayload): Promise<TActionFinanceExpenseType>
  updateFinanceExpenseType (id: TBaseParamsId, payload: IUpdateFinanceExpenseTypePayload): Promise<TActionFinanceExpenseType>
  deleteFinanceExpenseType (id: TBaseParamsId): Promise<TActionFinanceExpenseType>
  getFinanceExpenseTypeFindOne (id: TBaseParamsId): Promise<TGetFinanceExpenseTypeByIdResponse>
}

class FinanceExpenseTypeProvider extends HttpRequest implements IFinanceExpenseTypeProvider {
  private urlPrefix: string = '/api/v1/finance-expense-type'

  public async getFinanceExpenseTypePaginate (query: IGetFinanceExpenseTypeList): Promise<TGetFinanceExpenseTypeListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createFinanceExpenseType (payload: ICreateFinanceExpenseTypePayload): Promise<TActionFinanceExpenseType> {
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateFinanceExpenseType (id: TBaseParamsId, payload: IUpdateFinanceExpenseTypePayload): Promise<TActionFinanceExpenseType> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteFinanceExpenseType (id: TBaseParamsId): Promise<TActionFinanceExpenseType> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getFinanceExpenseTypeFindOne (id: TBaseParamsId): Promise<TGetFinanceExpenseTypeByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default FinanceExpenseTypeProvider
