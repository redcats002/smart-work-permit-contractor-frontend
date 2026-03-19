import type { IGetBranchIncomeExpenseList } from '@/models/request/report/branch-income-expense/BranchIncomeExpenseReq.model'
import type { TGetBranchIncomeExpenseListResponse } from '@/models/response/report/branch-income-expense/BranchIncomeExpenseRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IBranchIncomeExpenseProvider {
  getBranchIncomeExpensePaginate(query: IGetBranchIncomeExpenseList): Promise<TGetBranchIncomeExpenseListResponse>
}

class BranchIncomeExpenseProvider extends HttpRequest implements IBranchIncomeExpenseProvider {
  private urlPrefix: string = '/api/v1/report/branch-income-expense'

  public async getBranchIncomeExpensePaginate (query: IGetBranchIncomeExpenseList): Promise<TGetBranchIncomeExpenseListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }
}

export default BranchIncomeExpenseProvider
