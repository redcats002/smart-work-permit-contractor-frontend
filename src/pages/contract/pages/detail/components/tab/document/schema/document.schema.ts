import { schema } from '@/utils/Schema'
import { DocumentTypeEnum } from '@/enums/modules/contract/DocumentType.enum'
import { z } from 'zod'

export const DocumentSchema = z.object({
  documentType: schema.enum(DocumentTypeEnum, 'ประเภทเอกสาร'),
  locationId: schema.id('จุดจัดเก็บ'),
  files: z.array(schema.media),
  note: z.string().min(1, 'กรุณากรอกคำอธิบาย')
})

export type DocumentFormValues = z.infer<typeof DocumentSchema>

export function useFormInitialValues (): DocumentFormValues {
  return {
    documentType: undefined,
    locationId: undefined,
    files: [],
    note: ''
  }
}
