import { schema } from '@/utils/Schema'
import { z } from 'zod'

export const DocumentMovementSchema = z.object({
  assetsIds: z.array(schema.id('รหัสสินทรัพย์')).min(1, 'กรุณาเลือกอย่างน้อย 1 รายการ'),
  originalWarehouseId: schema.id('คลังต้นทาง'),
  destinationWarehouseId: schema.id('คลังปลายทาง'),
  reason: z.string().optional()
})

export type DocumentMovementFormValues = z.infer<typeof DocumentMovementSchema>

export function useFormInitialValues (): DocumentMovementFormValues {
  return {
    assetsIds: [],
    originalWarehouseId: undefined,
    destinationWarehouseId: undefined,
    reason: ''
  }
}

export function useDev (): DocumentMovementFormValues {
  return {
    assetsIds: [1, 2, 3],
    originalWarehouseId: 1,
    destinationWarehouseId: 2,
    reason: 'ย้ายสินทรัพย์ไปยังคลังใหม่'
  }
}
