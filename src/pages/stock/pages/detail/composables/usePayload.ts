import type { IReceiveDocumentMovementPayload } from '@/models/request/document-storage/DocumentStorageReq.model'
import type { DocumentReceiveFormValues, DocumentReceiveItemFormValues } from '../schema/document-receive.schema'

export function usePayload (form: DocumentReceiveFormValues): IReceiveDocumentMovementPayload {
  return {
    items: form.items.map((item: DocumentReceiveItemFormValues): DocumentReceiveItemFormValues => ({
      id: item.id,
      location: item?.location
    }))
  }
}
