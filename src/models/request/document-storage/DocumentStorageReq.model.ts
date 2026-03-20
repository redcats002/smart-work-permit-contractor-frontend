import type { TAssetType } from '@/enums/modules/contract/AssetType.enum'
import type { TDocumentStorageAssetStatus } from '@/enums/modules/document-storage/DocumentStorageAssetStatus.enum'
import type { TDocumentStorageMovementStatus } from '@/enums/modules/document-storage/DocumentStorageMovementStatus.enum'
import type { DocumentMovementFormValues } from '@/pages/stock/pages/create/schema/document-movement'
import type { DocumentReceiveFormValues } from '@/pages/stock/pages/create/schema/document-receive.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetDocumentAssetsList extends IBasePaginationRequest {
  type?: TAssetType
  warehouseId?: number
  locationId?: number
  status?: TDocumentStorageAssetStatus
}
export interface IGetDocumentMovementList extends IBasePaginationRequest {
  originalWarehouseId?: number
  destinationWarehouseId?: number
  status?: TDocumentStorageMovementStatus
}
export interface IGetDocumentMovementAssetsList extends IBasePaginationRequest {}
export interface ICreateDocumentMovementPayload extends DocumentMovementFormValues {}
export interface IReceiveDocumentMovementPayload extends DocumentReceiveFormValues {}
