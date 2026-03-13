import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse } from '../Response.model'

export type TAssetStatus = 'WAITING' | 'IN_USE' | 'SOLD' | string

export interface IAssetList extends IEntity {
  assetNo: string
  customerName: string
  category: string
  value: number
  status: TAssetStatus
}

export type TGetAssetListResponse = IBasePaginationResponse<IAssetList>
