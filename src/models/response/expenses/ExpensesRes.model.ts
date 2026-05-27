import type { ExpensesTypeEnum } from '@/enums/modules/finance/ExpenseType.enum'
import type { IBranchList } from '../branch/BranchRes.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IExpensesFile {
  name: string
  url: string
  path: string
}

export interface IExpensesList {
  id: number
  idNo: string
  createdAt: string
  expenseDate: string
  type: ExpensesTypeEnum
  expenseType: string
  expenseCategory: string
  amount: number
}

export interface IExpensesById {
  id: number
  idNo: string
  createdAt: string
  expenseDate: string
  amount: number
  createdBy: string
  type: ExpensesTypeEnum
  expenseTypeId: number
  expenseType: string
  expenseCategoryId: number
  expenseCategory: string
  reason: string
  branch: IBranchList
  files: IExpensesFile[]
}

export type TGetExpensesListResponse = IBasePaginationResponse<IExpensesList>
export type TGetExpensesDetailResponse = IBaseSuccessResponse<IExpensesById>
export type TActionExpenses = IBaseSuccessResponse<boolean>
export type TCreateExpensesResponse = IBaseSuccessResponse<IExpensesById>
