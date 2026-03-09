import type { FinanceExpenseTypeFormValues } from '@/pages/setting/pages/financial/pages/expense-category/schema/finance-expense-type.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IActionFinanceExpenseTypePayload extends ICreateFinanceExpenseTypePayload, IUpdateFinanceExpenseTypePayload {}
export interface ICreateFinanceExpenseTypePayload extends FinanceExpenseTypeFormValues {}
export interface IUpdateFinanceExpenseTypePayload extends ICreateFinanceExpenseTypePayload {}

export interface IGetFinanceExpenseTypeList extends IBasePaginationRequest {
  incomeCategoryId?: number
}
