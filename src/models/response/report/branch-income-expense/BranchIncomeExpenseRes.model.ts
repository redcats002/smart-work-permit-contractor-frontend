import type { IEntity, TBaseModel } from '@/models/Global.model'
import type { IBasePaginationResponse } from '../../Response.model'

export interface IBranchIncomeExpenseList extends IEntity {
  category: TBaseModel
  income: number
  expense: number
}
export interface IBranchIncomeExpenseSummary {
  totalIncome: number
  totalExpense: number
}

export interface TGetBranchIncomeExpenseListResponse extends IBasePaginationResponse<IBranchIncomeExpenseList>, IBranchIncomeExpenseSummary {}
