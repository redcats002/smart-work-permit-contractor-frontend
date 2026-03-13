import type { TAssetCategoryStatus } from '@/enums/modules/work/AssetCategoryStatus.enum'
import type { TWorkStatus } from '@/enums/modules/work/WorkStatus.enum'
import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse } from '../Response.model'


export interface INewWorkList extends IEntity {
  id: number | null
  contractNo: string | null
  customerName: string | null
  assetCategory: TAssetCategoryStatus
  status: TWorkStatus
}


export type TGetNewWorkListResponse = IBasePaginationResponse<INewWorkList>
