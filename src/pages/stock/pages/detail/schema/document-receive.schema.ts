import { schema } from '@/utils/Schema'
import { z } from 'zod'

export const DocumentLocationSchema = z.object({
  id: schema.id('รหัสสถานที่'),
  name: z.string().optional()
})

export const DocumentReceiveItemSchema = z.object({
  id: schema.id('รหัสสินทรัพย์'),
  location: DocumentLocationSchema
})

export const DocumentReceiveSchema = z.object({
  items: z.array(DocumentReceiveItemSchema).min(1, 'กรุณาเพิ่มสินทรัพย์อย่างน้อย 1 รายการ')
})

export type DocumentReceiveFormValues = z.infer<typeof DocumentReceiveSchema>
export type DocumentLocationFormValues = z.infer<typeof DocumentLocationSchema>
export type DocumentReceiveItemFormValues = z.infer<typeof DocumentReceiveItemSchema>

export function useFormInitialValues (): DocumentReceiveFormValues {
  return {
    items: []
  }
}

export function useDev (): DocumentReceiveFormValues {
  return {
    items: [
      {
        id: 1,
        location: {
          id: 1,
          name: 'คลัง A'
        }
      }
    ]
  }
}
