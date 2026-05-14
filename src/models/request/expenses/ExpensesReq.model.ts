import type { IBasePaginationRequest } from '../Request.model'

export interface IGetExpensesList extends IBasePaginationRequest {}

export interface IExpensesFile {
  name: string
  url: string
  path: string
}

export interface ICreateExpensesPayload {
  type: string
  expenseTypeId: number
  expenseCategoryId: number
  amount: number
  expenseDate: string
  reason: string
  files: IExpensesFile[]
}

export type IUpdateExpensesPayload = ICreateExpensesPayload
