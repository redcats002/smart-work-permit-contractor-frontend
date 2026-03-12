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

export type TGetStockDocsListResponse = IBasePaginationResponse<IStockDocsList>
