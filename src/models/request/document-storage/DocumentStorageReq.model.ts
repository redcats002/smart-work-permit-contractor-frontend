import type { TAssetType } from '@/enums/modules/contract/AssetType.enum'
import type { TDocumentStorageAssetsStatus } from '@/enums/modules/document-storage/DocumentStorageAssetsStatus.enum'
import type { StockDocsFormValues } from '@/pages/stock/pages/create/schema/stockDocs.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetDocumentStorageAssetsList extends IBasePaginationRequest {
  type?: TAssetType
  warehouseId?: number
  locationId?: number
  status?: TDocumentStorageAssetsStatus
}

export interface ICreateDocumentMovementPayload extends StockDocsFormValues {}

export interface IGetDocumentMovementAssetsList extends IBasePaginationRequest {}
