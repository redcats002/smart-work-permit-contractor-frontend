import type { TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'
import type { TAssetType } from '@/enums/modules/asset/AssetType.enum'

export interface IAssetFilter {
  type?: TAssetType
  status?: TAssetStatus
}
