import type { TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'
import type { TAssetType } from '@/enums/modules/asset/AssetType.enum'
import type { TDocumentStorageMovementStatus } from '@/enums/modules/document-storage/DocumentStorageMovementStatus.enum'
import type { DocumentMovementFormValues } from '@/pages/stock/pages/create/schema/document-movement'
import type { DocumentReceiveFormValues } from '@/pages/stock/pages/detail/schema/document-receive.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetDocumentAssetsList extends IBasePaginationRequest {
  type?: TAssetType
  warehouseId?: number
  locationId?: number
  status?: TAssetStatus
}
export interface IGetDocumentMovementList extends IBasePaginationRequest {
  startDate?: string // RFC 3339, section 5.6, for example, 2017-07-21
  endDate?: string// RFC 3339, section 5.6, for example, 2017-07-21
  originalWarehouseId?: number
  destinationWarehouseId?: number
  status?: TDocumentStorageMovementStatus
}
export interface IGetDocumentMovementAssetsList extends IBasePaginationRequest {}
export interface ICreateDocumentMovementPayload extends Omit<DocumentMovementFormValues, 'assets'> {
  assetsIds: number[]
}
export interface IReceiveDocumentMovementPayload extends DocumentReceiveFormValues {}
