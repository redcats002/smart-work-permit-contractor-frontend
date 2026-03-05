import type { IEntity } from '@/models/Global.model'
import type { IAddressRequest, ICurrentAddressRequest, IWorkAddressRequest } from '@/models/request/AddressReq.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IContractList extends IEntity {}
export interface IContractById extends ICurrentAddressRequest, IAddressRequest, IWorkAddressRequest {}

export type TGetContractListResponse = IBasePaginationResponse<IContractList>
export type TGetContractByIdResponse = IBaseSuccessResponse<IContractById>
export type TActionContract = IBaseSuccessResponse<boolean>
