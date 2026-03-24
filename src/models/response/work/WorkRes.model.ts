import type { IEntity } from '@/models/Global.model'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import type { TAssetType } from '@/enums/modules/asset/AssetType.enum'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import type { ICustomerById, ICustomerList } from '../customer/CustomerRes.model'
import type { IBasePaginationResponse } from '../Response.model'

export interface IAssetAppraisalBaseWorkList extends IEntity {
  status: TPreContractStatus
  customer: ICustomerList
  types: TAssetType[]
}
export interface IFollowUpBaseWorkList extends IEntity {
  status: TPreContractStatus
  customer: ICustomerById
  types: TAssetType[]
  asset: IPreAssetList
}

export interface IAssetAppraisalNewWorkList extends IAssetAppraisalBaseWorkList {}
export interface IAssetAppraisalCompleteWorkList extends IAssetAppraisalBaseWorkList {}
export interface IFollowUpNewWorkList extends IFollowUpBaseWorkList {}
export interface IFollowUpCompleteWorkList extends IFollowUpBaseWorkList {}

export type TGetNewWorkAppraisalListResponse = IBasePaginationResponse<IAssetAppraisalBaseWorkList>
export type TGetCompleteWorkAppraisalListResponse = IBasePaginationResponse<IAssetAppraisalBaseWorkList>
export type TGetNewWorkFollowUpListResponse = IBasePaginationResponse<IFollowUpBaseWorkList>
export type TGetCompleteWorkFollowUpListResponse = IBasePaginationResponse<IFollowUpBaseWorkList>
