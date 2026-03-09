import type { FinanceIncomeCategoryFormValues } from '@/pages/setting/pages/financial/pages/income-category/schema/finance-income-category.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IActionFinanceIncomeCategoryPayload extends ICreateFinanceIncomeCategoryPayload, IUpdateFinanceIncomeCategoryPayload {}
export interface ICreateFinanceIncomeCategoryPayload extends FinanceIncomeCategoryFormValues {}
export interface IUpdateFinanceIncomeCategoryPayload extends ICreateFinanceIncomeCategoryPayload {}

export interface IGetFinanceIncomeCategoryList extends IBasePaginationRequest {}
