import type { IGetBranchIncomeExpenseList } from '@/models/request/report/branch-income-expense/BranchIncomeExpenseReq.model'

export type TBranchIncomeExpenseCategoryFilter = 'OVERALL' | 'COL1' | 'COL2'

export interface IBranchIncomeExpenseFilter extends IGetBranchIncomeExpenseList {
  financeCategory?: TBranchIncomeExpenseCategoryFilter
}
