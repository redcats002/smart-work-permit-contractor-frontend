import type { ICreateExpensesPayload, IGetExpensesList, IUpdateExpensesPayload } from '@/models/request/expenses/ExpensesReq.model'
import type { TActionExpenses, TCreateExpensesResponse, TGetExpensesDetailResponse, TGetExpensesListResponse } from '@/models/response/expenses/ExpensesRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IExpensesProvider {
  getExpensesPaginate(query: IGetExpensesList): Promise<TGetExpensesListResponse>
  getExpensesById(id: TBaseParamsId): Promise<TGetExpensesDetailResponse>
  createExpenses(payload: ICreateExpensesPayload): Promise<TCreateExpensesResponse>
  updateExpenses(id: TBaseParamsId, payload: IUpdateExpensesPayload): Promise<TCreateExpensesResponse>
  deleteExpenses(id: TBaseParamsId): Promise<TActionExpenses>
}

class ExpensesProvider extends HttpRequest implements IExpensesProvider {
  private urlPrefix: string = '/api/v1/record-expense'

  public async getExpensesPaginate (query: IGetExpensesList): Promise<TGetExpensesListResponse> {
    return this.get(this.urlPrefix, query)
  }

  public async getExpensesById (id: TBaseParamsId): Promise<TGetExpensesDetailResponse> {
    return this.get(`${this.urlPrefix}/${id}`)
  }

  public async createExpenses (payload: ICreateExpensesPayload): Promise<TCreateExpensesResponse> {
    return this.post(this.urlPrefix, payload)
  }

  public async updateExpenses (id: TBaseParamsId, payload: IUpdateExpensesPayload): Promise<TCreateExpensesResponse> {
    return this.put(`${this.urlPrefix}/${id}`, payload)
  }

  public async deleteExpenses (id: TBaseParamsId): Promise<TActionExpenses> {
    return this.delete(`${this.urlPrefix}/${id}`)
  }
}

export default ExpensesProvider
