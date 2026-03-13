import type { IGetExpensesList } from '@/models/request/expenses/ExpensesReq.model'
import type { TActionExpenses, TGetExpensesDetailResponse, TGetExpensesListResponse } from '@/models/response/expenses/ExpensesRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IExpensesProvider {
  getExpensesPaginate(query: IGetExpensesList): Promise<TGetExpensesListResponse>
  getExpensesById (id: TBaseParamsId): Promise<TGetExpensesDetailResponse>
  deleteExpenses(id: TBaseParamsId): Promise<TActionExpenses>
}

class ExpensesProvider extends HttpRequest implements IExpensesProvider {
  private urlPrefix: string = '/api/v1/expenses'

  public async getExpensesPaginate (query: IGetExpensesList): Promise<TGetExpensesListResponse> {
    return this.get(this.urlPrefix, query)
  }

  public async getExpensesById (id: TBaseParamsId): Promise<TGetExpensesDetailResponse> {
    return this.get(`${this.urlPrefix}/${id}`)
  }

  public async deleteExpenses (id: TBaseParamsId): Promise<TActionExpenses> {
    return this.delete(`${this.urlPrefix}/${id}`)
  }
}

export default ExpensesProvider
