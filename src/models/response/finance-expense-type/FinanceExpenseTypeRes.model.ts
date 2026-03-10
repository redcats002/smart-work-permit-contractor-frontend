import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IFinanceExpenseTypeList extends IEntity {
  name: string
}
export interface IFinanceExpenseTypeById {
  name: string
}

export type TGetFinanceExpenseTypeListResponse = IBasePaginationResponse<IFinanceExpenseTypeList>
export type TGetFinanceExpenseTypeByIdResponse = IBaseSuccessResponse<IFinanceExpenseTypeById>
export type TActionFinanceExpenseType = IBaseSuccessResponse<boolean>
