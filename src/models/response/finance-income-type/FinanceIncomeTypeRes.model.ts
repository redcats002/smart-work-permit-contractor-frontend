import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IFinanceIncomeTypeList extends IEntity {
  name: string
}
export interface IFinanceIncomeTypeById {
  name: string
}

export type TGetFinanceIncomeTypeListResponse = IBasePaginationResponse<IFinanceIncomeTypeList>
export type TGetFinanceIncomeTypeByIdResponse = IBaseSuccessResponse<IFinanceIncomeTypeById>
export type TActionFinanceIncomeType = IBaseSuccessResponse<boolean>
