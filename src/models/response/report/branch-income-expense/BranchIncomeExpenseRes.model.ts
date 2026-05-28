import type { IBasePaginationResponse } from '../../Response.model'

export interface IBranchIncomeExpenseItem {
  date: string
  type: string
  code: number
  amount: number
  branchName?: string
  referBranchName?: string
}

export interface IBranchIncomeExpenseCodeSummary {
  code101: number
  code102: number
  code103: number
  code104: number
  code105: number
  code106: number
  total: number
}

export interface TGetBranchIncomeExpenseListResponse extends IBasePaginationResponse<IBranchIncomeExpenseItem> {
  summary: IBranchIncomeExpenseCodeSummary
}
