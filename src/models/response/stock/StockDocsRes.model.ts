import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse } from '../Response.model'
import type { TStockDocsStatus } from '@/enums/modules/stock/StockDocsStatus.enum'

export interface IStockDocsList extends IEntity {
  docNo: string
  transferDate: string
  senderName: string
  originWarehouse: string
  receiverName: string
  destinationWarehouse: string
  status: TStockDocsStatus
}

export interface IStockDocsById extends IEntity {
  status: TStockDocsStatus
  docNo: string
  reason: string
  transferDate: string
  senderName: string
  receiveDate?: string
  receiverName?: string
  originWarehouse: string
  destinationWarehouse: string
}

export type TGetStockDocsListResponse = IBasePaginationResponse<IStockDocsList>
