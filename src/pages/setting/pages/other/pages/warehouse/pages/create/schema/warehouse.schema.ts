import { schema } from '@/utils/Schema'
import { LocationStatusEnum } from '@/enums/modules/warehouse/LocationStatus.enum'
import { WarehouseStatusEnum } from '@/enums/modules/warehouse/WarehouseStatus.enum'
import { z } from 'zod'

interface IWarehouseOptionTempType { // generic type for warehouse option form values
  isRequirePrefix: boolean
  prefix?: string
  maxLimit: number
  id?: number | undefined
}

export const WarehouseOptionSchema = z.object({
  id: z.number().optional(),
  // ponytail: Switch isn't a $form-registered field (no name/:form), so the zodResolver
  // never sees a real value for it — default keeps that invisible-to-Form gap from
  // throwing "expected boolean, received undefined". Add proper Form registration if
  // this ever needs its own validation message.
  isRequirePrefix: z.boolean().default(true),
  prefix: z.string().optional(),
  maxLimit: z.number().min(1, 'กรุณากรอกจำนวนสูงสุด')
}).superRefine((data: IWarehouseOptionTempType, ctx: z.core.$RefinementCtx) => {
  // ถ้า status ACTIVE และไม่มีการกรอก prefix (หรือกรอกเป็นค่าว่าง)
  if (data.isRequirePrefix && (!data?.prefix || data?.prefix?.trim() === '')) {
    ctx.addIssue({
      code: 'custom',
      message: 'กรุณากรอกตัวย่อจุดจัดเก็บ', // ข้อความแจ้งเตือนที่ต้องการ
      path: ['prefix'] // ส่งความผิดพลาดนี้ไปผูกไว้ที่ฟิลด์ prefix
    })
  }
})

export const WarehouseLocationSchema = z
  .object({
    id: z.number().optional(),
    name: z.string().optional(),
    status: schema.enum(LocationStatusEnum, 'สถานะสถานที่'),
    optionIds: z.string().optional()
  })

export const WarehouseSchema = z.object({
  status: schema.enum(WarehouseStatusEnum, 'สถานะคลังสินค้า').default(WarehouseStatusEnum.ACTIVE),
  name: z.string().min(1, 'กรุณากรอกชื่อคลังสินค้า'),
  prefix: z.string().min(1, 'กรุณากรอกคำนำหน้าตำแหน่ง'),
  options: z.array(WarehouseOptionSchema),
  // ponytail: locations is a read-only generated table (LocationTable.vue), never bound
  // to a $form field either — same invisible-to-Form gap, default avoids the phantom
  // "expected array, received undefined" error.
  locations: z.array(WarehouseLocationSchema).default([])
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
