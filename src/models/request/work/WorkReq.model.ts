import type { TAssetType } from '@/enums/modules/asset/AssetType.enum'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import type { TDebtCollectionStatus } from '@/enums/modules/work/DebtCollectionStatus.enum'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetWorkAssetAppraisalListBase extends IBasePaginationRequest {
  status?: TPreContractStatus
  type?: TAssetType
}

export interface IGetNewWorkAssetAppraisalList extends IGetWorkAssetAppraisalListBase {}
export interface IGetCompleteWorkAssetAppraisalList extends IGetWorkAssetAppraisalListBase {}

export interface IGetDebtCollectionList extends IBasePaginationRequest {
  status?: TDebtCollectionStatus
}
