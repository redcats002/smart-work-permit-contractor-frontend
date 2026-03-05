import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IContractLoanPurposeList extends IEntity {
  name: string
}
export interface IContractLoanPurposeById {}

export type TGetContractLoanPurposeListResponse = IBasePaginationResponse<IContractLoanPurposeList>
export type TGetContractLoanPurposeByIdResponse = IBaseSuccessResponse<IContractLoanPurposeById>
export type TActionContractLoanPurpose = IBaseSuccessResponse<boolean>
