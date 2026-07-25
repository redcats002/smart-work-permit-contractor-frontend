import { schema } from '@/utils/Schema'
import { DocumentTypeEnum } from '@/enums/modules/contract/DocumentType.enum'
import { z } from 'zod'

export const DocumentSchema = z.object({
  documentType: z.preprocess(
    (val: unknown): unknown => {
      if (typeof val === 'string') return val
      if (val && typeof val === 'object') {
        if ('value' in val) return (val as { value?: unknown }).value ?? ''
        if ('id' in val) return (val as { id?: unknown }).id ?? ''
      }
      return val
    }, z.nativeEnum(DocumentTypeEnum, { message: 'กรุณาเลือกประเภทเอกสาร' })
  )
    .optional()
    .refine((val: DocumentTypeEnum | undefined): val is DocumentTypeEnum => val !== undefined, { message: 'กรุณาเลือกประเภทเอกสาร' }),
  locationId: schema.id('จุดจัดเก็บ'),
  warehouseId: schema.id('คลัง'),
  files: z.array(schema.media).optional(),
  note: z.string().min(1, 'กรุณากรอกคำอธิบาย')
})

export type DocumentFormValues = z.infer<typeof DocumentSchema>

export function useFormInitialValues (): DocumentFormValues {
  return {
    documentType: DocumentTypeEnum.LOAN_CONTRACT,
    warehouseId: undefined,
    locationId: undefined,
    files: [],
    note: ''
  }
}
