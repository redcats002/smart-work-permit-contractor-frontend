import type { IEntity } from '@/models/Global.model'
import type { ExpensesTypeEnum } from '@/enums/modules/finance/ExpenseType.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IExpensesFile {
  name: string
  url: string
  path: string
}

export interface IExpensesList extends IEntity {
  expenseDate: string
  type: ExpensesTypeEnum
  expenseTypeId?: number
  expenseType?: string
  expenseCategoryId?: number
  expenseCategory?: string
  referBranchId?: string
  referBranchName?: string
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
  expenseTypeId?: number
  expenseType?: string
  expenseCategoryId?: number
  expenseCategory?: string
  referBranchId?: string
  referBranchName?: string
  reason: string
  files: IExpensesFile[]
}

export type TGetExpensesListResponse = IBasePaginationResponse<IExpensesList>
export type TGetExpensesDetailResponse = IBaseSuccessResponse<IExpensesById>
export type TActionExpenses = IBaseSuccessResponse<boolean>
export type TCreateExpensesResponse = IBaseSuccessResponse<IExpensesById>
