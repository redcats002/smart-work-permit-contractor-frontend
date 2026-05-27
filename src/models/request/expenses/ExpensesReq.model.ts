import type { TExpensesType } from '@/enums/modules/finance/ExpenseType.enum'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetExpensesList extends IBasePaginationRequest {
  type?: TExpensesType
  expenseTypeId?: number
  expenseCategoryId?: number
}

export interface IExpensesFile {
  name: string
  url: string
  path: string
}

export interface ICreateExpensesPayload {
  type: TExpensesType
  expenseCategoryId?: number
  expenseTypeId?: number
  branchId?: string
  amount: number
  expenseDate: string
  reason: string
  files: IExpensesFile[]
}

export type IUpdateExpensesPayload = ICreateExpensesPayload
