import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IFinanceIncomeCategoryList extends IEntity {
  name: string
}
export interface IFinanceIncomeCategoryById {
  name: string
}

export type TGetFinanceIncomeCategoryListResponse = IBasePaginationResponse<IFinanceIncomeCategoryList>
export type TGetFinanceIncomeCategoryByIdResponse = IBaseSuccessResponse<IFinanceIncomeCategoryById>
export type TActionFinanceIncomeCategory = IBaseSuccessResponse<boolean>
