import { schema } from '@/utils/Schema'
import { z } from 'zod'
import { DocumentAssetSchema } from './document-asset.schema'

export const DocumentMovementSchema = z.object({
  assets: z.array(DocumentAssetSchema).min(1, 'กรุณาเลือกอย่างน้อย 1 รายการ'),
  originalWarehouseId: schema.id('คลังต้นทาง'),
  destinationWarehouseId: schema.id('คลังปลายทาง'),
  reason: z.string().min(1, 'กรุณากรอกเหตุผลการย้าย')
})

export type DocumentMovementFormValues = z.infer<typeof DocumentMovementSchema>

export function useFormInitialValues (): DocumentMovementFormValues {
  return {
    assets: [],
    originalWarehouseId: undefined,
    destinationWarehouseId: undefined,
    reason: ''
  }
}

export function useDev (): DocumentMovementFormValues {
  return {
    assets: [],
    originalWarehouseId: 3,
    destinationWarehouseId: 2,
    reason: 'ย้ายสินทรัพย์ไปยังคลังใหม่'
  }
}
