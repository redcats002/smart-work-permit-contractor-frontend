import type {
  ICreateFinanceExpenseCategoryPayload,
  IGetFinanceExpenseCategoryList,
  IUpdateFinanceExpenseCategoryPayload
} from '@/models/request/finance-expense-category/FinanceExpenseCategoryReq.model'
import type {
  TActionFinanceExpenseCategory,
  TGetFinanceExpenseCategoryByIdResponse,
  TGetFinanceExpenseCategoryListResponse
} from '@/models/response/finance-expense-category/FinanceExpenseCategoryRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IFinanceExpenseCategoryProvider {
  getFinanceExpenseCategoryPaginate(query: IGetFinanceExpenseCategoryList): Promise<TGetFinanceExpenseCategoryListResponse>
  createFinanceExpenseCategory(payload: ICreateFinanceExpenseCategoryPayload): Promise<TActionFinanceExpenseCategory>
  updateFinanceExpenseCategory(id: TBaseParamsId, payload: IUpdateFinanceExpenseCategoryPayload): Promise<TActionFinanceExpenseCategory>
  deleteFinanceExpenseCategory(id: TBaseParamsId): Promise<TActionFinanceExpenseCategory>
  getFinanceExpenseCategoryFindOne(id: TBaseParamsId): Promise<TGetFinanceExpenseCategoryByIdResponse>
}

class FinanceExpenseCategoryProvider extends HttpRequest implements IFinanceExpenseCategoryProvider {
  private urlPrefix: string = '/api/v1/management/finance-expense-category'

  public async getFinanceExpenseCategoryPaginate (query: IGetFinanceExpenseCategoryList): Promise<TGetFinanceExpenseCategoryListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createFinanceExpenseCategory (payload: ICreateFinanceExpenseCategoryPayload): Promise<TActionFinanceExpenseCategory> {
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateFinanceExpenseCategory (
    id: TBaseParamsId,
    payload: IUpdateFinanceExpenseCategoryPayload
  ): Promise<TActionFinanceExpenseCategory> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteFinanceExpenseCategory (id: TBaseParamsId): Promise<TActionFinanceExpenseCategory> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getFinanceExpenseCategoryFindOne (id: TBaseParamsId): Promise<TGetFinanceExpenseCategoryByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }
}

export default FinanceExpenseCategoryProvider
