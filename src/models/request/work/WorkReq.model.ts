import type { TAssetCategoryStatus } from '@/enums/modules/work/AssetCategoryStatus.enum'
import type { IBasePaginationRequest } from '../Request.model'
import type { TWorkStatus } from '@/enums/modules/work/WorkStatus.enum'

export interface IGetNewWorkList extends IBasePaginationRequest {
  status?: TWorkStatus
  assetCategoryStatus?: TAssetCategoryStatus
}
