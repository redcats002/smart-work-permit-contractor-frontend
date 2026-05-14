import type { TAssetType } from '@/enums/modules/asset/AssetType.enum'
import type { TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'

export interface IContractAssetFilter {
  type?: TAssetType
  status?: TAssetStatus
}
