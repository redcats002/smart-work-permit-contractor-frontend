import type { IEntity } from '@/models/Global.model'
import type { TExternalInternalExpense } from '@/enums/modules/finance/ExternalInternalExpense.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IFinanceExpenseCategoryList extends IEntity {
  name: string
  externalInternalExpense: TExternalInternalExpense
}
export interface IFinanceExpenseCategoryById {
  name: string
  externalInternalExpense: TExternalInternalExpense
}

export type TGetFinanceExpenseCategoryListResponse = IBasePaginationResponse<IFinanceExpenseCategoryList>
export type TGetFinanceExpenseCategoryByIdResponse = IBaseSuccessResponse<IFinanceExpenseCategoryById>
export type TActionFinanceExpenseCategory = IBaseSuccessResponse<boolean>
