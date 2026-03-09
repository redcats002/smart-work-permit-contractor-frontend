import type { FinanceExpenseCategoryFormValues } from '@/pages/setting/pages/financial/pages/expense-category/schema/finance-expense-category.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IActionFinanceExpenseCategoryPayload extends ICreateFinanceExpenseCategoryPayload, IUpdateFinanceExpenseCategoryPayload {}
export interface ICreateFinanceExpenseCategoryPayload extends FinanceExpenseCategoryFormValues {}
export interface IUpdateFinanceExpenseCategoryPayload extends ICreateFinanceExpenseCategoryPayload {}

export interface IGetFinanceExpenseCategoryList extends IBasePaginationRequest {}
