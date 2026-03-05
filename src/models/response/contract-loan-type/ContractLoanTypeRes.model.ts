import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IContractLoanTypeList extends IEntity {
  name: string
}
export interface IContractLoanTypeById {}

export type TGetContractLoanTypeListResponse = IBasePaginationResponse<IContractLoanTypeList>
export type TGetContractLoanTypeByIdResponse = IBaseSuccessResponse<IContractLoanTypeById>
export type TActionContractLoanType = IBaseSuccessResponse<boolean>
