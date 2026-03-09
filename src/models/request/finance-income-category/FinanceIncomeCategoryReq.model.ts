import type { FinanceIncomeTypeFormValues } from '@/pages/setting/pages/financial/pages/income-category/schema/finance-income-type.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IActionFinanceIncomeTypePayload extends ICreateFinanceIncomeTypePayload, IUpdateFinanceIncomeTypePayload {}
export interface ICreateFinanceIncomeTypePayload extends FinanceIncomeTypeFormValues {}
export interface IUpdateFinanceIncomeTypePayload extends ICreateFinanceIncomeTypePayload {}

export interface IGetFinanceIncomeTypeList extends IBasePaginationRequest {}
