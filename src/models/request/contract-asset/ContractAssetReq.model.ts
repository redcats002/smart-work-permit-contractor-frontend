import type { IBasePaginationRequest } from '../Request.model'
import type { TAssetType } from '@/enums/modules/asset/AssetType.enum'
import type { TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'

export interface IGetContractAssetList extends IBasePaginationRequest {
  type?: TAssetType
  status?: TAssetStatus
}

export interface ISellContractAssetPayload {
  salePrice: number
}

export interface IUpdateContractAssetStatusPayload {
  status: TAssetStatus
}
