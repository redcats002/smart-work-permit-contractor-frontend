import type { TAssetType } from '@/enums/modules/contract/AssetType.enum'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetWorkAssetAppraisalListBase extends IBasePaginationRequest {
  status?: TPreContractStatus
  type?: TAssetType
}
export interface IGetWorkFollowUpListBase extends IBasePaginationRequest {
  status?: TPreContractStatus
  type?: TAssetType
}
export interface IGetNewWorkAssetAppraisalList extends IGetWorkAssetAppraisalListBase {}
export interface IGetCompleteWorkAssetAppraisalList extends IGetWorkAssetAppraisalListBase {}

export interface IGetNewWorkAssetFollowUpList extends IGetWorkAssetAppraisalListBase {}
export interface IGetCompleteWorkAssetFollowUpList extends IGetWorkAssetAppraisalListBase {}
