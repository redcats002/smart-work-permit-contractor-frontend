import type { IEntity } from '@/models/Global.model'
import type { IPreContractList } from '../pre-contract/PreContractRes.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IContractList extends IPreContractList {}

export interface IContractById extends IEntity {}

export type TGetContractListResponse = IBasePaginationResponse<IContractList>
export type TGetContractByIdResponse = IBaseSuccessResponse<IContractById>
export type TActionContract = IBaseSuccessResponse<boolean>
