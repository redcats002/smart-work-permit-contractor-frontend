import type { ICreateDocumentMovementPayload } from '@/models/request/document-storage/DocumentStorageReq.model'
import type { DocumentAssetFormValues } from '../schema/document-asset.schema'
import type { DocumentMovementFormValues } from '../schema/document-movement'

export function usePayload (form: DocumentMovementFormValues): ICreateDocumentMovementPayload {
  return {
    destinationWarehouseId: form.destinationWarehouseId,
    originalWarehouseId: form.originalWarehouseId,
    reason: form?.reason,
    assetsIds: form.assets?.map((item: DocumentAssetFormValues): number => item.id)
  }
}
