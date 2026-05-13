import { schema } from '@/utils/Schema'
import { CustomerDocumentTypeEnum } from '@/enums/modules/customer/CustomerDocumentType.enum'
import { z } from 'zod'

export const PrivateDocumentSchema = z.object({
  name: schema.enum(CustomerDocumentTypeEnum, 'ชื่อเอกสาร'),
  locationId: schema.id('จุดจัดเก็บเอกสาร')
})

export type PrivateDocumentFormValues = z.infer<typeof PrivateDocumentSchema>

export function useFormInitialValues (): PrivateDocumentFormValues {
  return {
    name: '',
    locationId: undefined
  }
}
