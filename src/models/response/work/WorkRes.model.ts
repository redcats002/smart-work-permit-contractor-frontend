import type { IEntity } from '@/models/Global.model'
import type { TAssetCategoryStatus } from '@/enums/modules/work/AssetCategoryStatus.enum'
import type { TWorkStatus } from '@/enums/modules/work/WorkStatus.enum'
import type { IBasePaginationResponse } from '../Response.model'

export interface IAssetAppraisalNewWorkList extends IEntity {
  contractNo: string | null
  customerName: string | null
  assetCategory: TAssetCategoryStatus
  status: TWorkStatus
}
export interface IFollowUpNewWorkList extends IEntity {
  assetNo: string | null
  contractNo: string | null
  customerName: string | null
  phoneNumber: string | null
  assetCategory: TAssetCategoryStatus
}


export type TGetNewWorkAppraisalListResponse = IBasePaginationResponse<IAssetAppraisalNewWorkList>
export type TGetNewWorkFollowUpListResponse = IBasePaginationResponse<IFollowUpNewWorkList>
