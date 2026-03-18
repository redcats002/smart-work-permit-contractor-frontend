import { LocationStatusEnum } from '@/enums/modules/warehouse/LocationStatus.enum'
import { WarehouseStatusEnum } from '@/enums/modules/warehouse/WarehouseStatus.enum'
import { z } from 'zod'

export const WarehouseOptionSchema = z.object({
  id: z.number().optional(),
  isRequirePrefix: z.boolean(),
  prefix: z.string().min(1, 'กรุณากรอกคำนำหน้าตำแหน่ง'),
  maxLimit: z.number().min(1, 'กรุณากรอกจำนวนสูงสุดของตำแหน่ง')
})

export const WarehouseLocationSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'กรุณากรอกชื่อสถานที่'),
  status: z.enum(Object.values(LocationStatusEnum)),
  optionIds: z.string().optional()
})

export const WarehouseSchema = z.object({
  status: z.enum(Object.values(WarehouseStatusEnum)),
  name: z.string().min(1, 'กรุณากรอกชื่อคลังสินค้า'),
  prefix: z.string().min(1, 'กรุณากรอกคำนำหน้าตำแหน่ง'),
  options: z.array(WarehouseOptionSchema),
  locations: z.array(WarehouseLocationSchema)
})

export type WarehouseFormValues = z.infer<typeof WarehouseSchema>
export type WarehouseOptionFormValues = z.infer<typeof WarehouseOptionSchema>
export type WarehouseLocationFormValues = z.infer<typeof WarehouseLocationSchema>

export function useFormInitialValues (): WarehouseFormValues {
  return {
    name: '',
    status: WarehouseStatusEnum.ACTIVE,
    prefix: '',
    options: [],
    locations: []
  }
}

export function useDev (): WarehouseFormValues {
  return {
    name: 'คลังสินค้าทดสอบ',
    status: WarehouseStatusEnum.ACTIVE,
    prefix: 'LOC',
    options: [
      {
        isRequirePrefix: true,
        prefix: 'LOC',
        maxLimit: 10
      }
    ],
    locations: [
      {
        name: 'สถานที่ทดสอบ 1',
        status: LocationStatusEnum.ACTIVE
      }
    ]
  }
}
