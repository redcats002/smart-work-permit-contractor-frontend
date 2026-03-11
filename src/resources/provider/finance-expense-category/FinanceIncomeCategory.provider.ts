import type {
  ICreateFinanceExpenseTypePayload,
  IGetFinanceExpenseTypeList,
  IUpdateFinanceExpenseTypePayload
} from '@/models/request/finance-expense-type/FinanceExpenseTypeReq.model'
import type {
  TActionFinanceExpenseCategory,
  TGetFinanceExpenseCategoryByIdResponse,
  TGetFinanceExpenseCategoryListResponse
} from '@/models/response/finance-expense-category/FinanceExpenseCategoryRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IFinanceExpenseCategoryProvider {
  getFinanceExpenseCategoryPaginate (query: IGetFinanceExpenseTypeList): Promise<TGetFinanceExpenseCategoryListResponse>
  createFinanceExpenseCategory (payload: ICreateFinanceExpenseTypePayload): Promise<TActionFinanceExpenseCategory>
  updateFinanceExpenseCategory (id: TBaseParamsId, payload: IUpdateFinanceExpenseTypePayload): Promise<TActionFinanceExpenseCategory>
  deleteFinanceExpenseCategory (id: number): Promise<TActionFinanceExpenseCategory>
  getFinanceExpenseCategoryFindOne (id: TBaseParamsId): Promise<TGetFinanceExpenseCategoryByIdResponse>
}

class FinanceExpenseCategoryProvider extends HttpRequest implements IFinanceExpenseCategoryProvider {
  private urlPrefix: string = '/api/v1/finance-expense-category'

  public async getFinanceExpenseCategoryPaginate (query: IGetFinanceExpenseTypeList): Promise<TGetFinanceExpenseCategoryListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createFinanceExpenseCategory (payload: ICreateFinanceExpenseTypePayload): Promise<TActionFinanceExpenseCategory> {
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateFinanceExpenseCategory (id: TBaseParamsId, payload: IUpdateFinanceExpenseTypePayload): Promise<TActionFinanceExpenseCategory> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteFinanceExpenseCategory (id: number): Promise<TActionFinanceExpenseCategory> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getFinanceExpenseCategoryFindOne (id: TBaseParamsId): Promise<TGetFinanceExpenseCategoryByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default FinanceExpenseCategoryProvider
