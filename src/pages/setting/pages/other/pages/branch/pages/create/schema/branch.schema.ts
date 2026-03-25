import { useDayjs } from '@/utils/Dayjs'
import { schema } from '@/utils/Schema'
import { EDays } from '@/enums/Date.enum'
import { BranchStatusEnum } from '@/enums/modules/branch/BranchStatus.enum'
import { z } from 'zod'

const dayjs = useDayjs()

const AddressSchema = z.object({
  address: z.string().optional(),
  subDistrict: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
  postCode: z.string().optional()
})

const BranchTimeSchema = z.object({
  day: z.array(z.enum(EDays)).min(1, 'กรุณาเลือกวันเปิดทำการ'),
  openTime: z.string().min(1, 'กรุณากรอกเวลาเปิดทำการ'),
  closeTime: z.string().min(1, 'กรุณากรอกเวลาปิดทำการ')
}).superRefine((val: BranchTimeFormValues, ctx: z.RefinementCtx) => {
  // Only validate if both times are present and in HH:mm format
  if (val.openTime && val.closeTime && (/^\d{2}:\d{2}$/).test(val.openTime) && (/^\d{2}:\d{2}$/).test(val.closeTime)) {
    if (val.openTime >= val.closeTime) {
      ctx.addIssue({
        code: 'custom',
        message: 'เวลาเปิดต้องน้อยกว่าเวลาปิด',
        path: ['closeTime']
      })
    }
  }
})

export const BranchSchema = z.object({
  name: z.string().min(1, 'กรุณากรอกชื่อคลังสินค้า'),
  status: schema.enum(BranchStatusEnum, 'สถานะ'),
  openAt: schema.date('วันเปิดสาขา'),
  idNo: z.string().min(1, 'กรุณากรอก Branch Code'),
  taxId: z.string().min(1, 'กรุณากรอก Tax ID'),
  branchTimes: z.array(BranchTimeSchema).min(1, 'กรุณาเพิ่มวันและเวลาทำการ'),
  ...AddressSchema.shape
})

export type BranchFormValues = z.infer<typeof BranchSchema>
export type BranchTimeFormValues = z.infer<typeof BranchTimeSchema>

export function useFormInitialValues (): BranchFormValues {
  return {
    name: '',
    idNo: '',
    taxId: '',
    openAt: '',
    address: '',
    subDistrict: '',
    district: '',
    province: '',
    postCode: '',
    branchTimes: [],
    status: BranchStatusEnum.ACTIVE
  }
}

export function useDev (): BranchFormValues {
  return {
    name: 'คลังสินค้าทดสอบ',
    idNo: '00001',
    taxId: '1234567890123',
    address: '',
    district: '',
    province: '',
    postCode: '',
    subDistrict: '',
    branchTimes: [],
    openAt: dayjs().toDate(),
    status: BranchStatusEnum.ACTIVE
  }
}
