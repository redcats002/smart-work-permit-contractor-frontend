import { schema } from '@/utils/Schema'
import { DocumentTypeEnum } from '@/enums/modules/contract/DocumentType.enum'
import { z } from 'zod'

export const DocumentSchema = z.object({
  documentType: z.nativeEnum(DocumentTypeEnum, { message: 'กรุณาเลือกประเภทเอกสาร' })
    .optional()
    .refine((val: DocumentTypeEnum | undefined): val is DocumentTypeEnum => val !== undefined, { message: 'กรุณาเลือกประเภทเอกสาร' }),
  warehouseId: schema.id('จุดจัดเก็บ'),
  url: z.string().min(1, 'กรุณาอัพโหลดเอกสาร'),
  detail: z.string().min(1, 'กรุณากรอกคำอธิบาย')
})

export type DocumentFormValues = z.infer<typeof DocumentSchema>

export function useFormInitialValues (): DocumentFormValues {
  return {
    documentType: undefined,
    warehouseId: undefined,
    url: '',
    detail: ''
  }
}
