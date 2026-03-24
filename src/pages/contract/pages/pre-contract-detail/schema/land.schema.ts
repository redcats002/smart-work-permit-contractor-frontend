import { schema } from '@/utils/Schema'
import { z } from 'zod'
import { LandSchema as FormValues } from '../../create/schema/pre-contract.schema'

export const LandFormSchema = z.object({
  ...FormValues.shape,
  id: schema.id('รหัสที่ดิน')
})

export type LandFormValues = z.infer<typeof LandFormSchema>

export const ModalLandSchema = z.object({
  type: z.string().min(1, 'กรุณาเลือกประเภทหลักทรัพย์'),
  detail: z.string().min(1, 'กรุณากรอกรายละเอียดหลักทรัพย์').default(''),
  landNo: z.string().min(1, 'กรุณากรอกเลขที่ดิน'),
  surveyNo: z.string().min(1, 'กรุณากรอกเลขที่สำรวจ'),
  address: z.string().optional(),
  subDistrict: z.string().min(1, 'กรุณากรอกตำบล'),
  district: z.string().min(1, 'กรุณากรอกอำเภอ'),
  province: z.string().min(1, 'กรุณากรอกจังหวัด'),
  postCode: z.string().min(1, 'กรุณากรอกรหัสไปรษณีย์'),
  urlGoogleMap: z.string().optional(),
  aerialPhotoMapNo: z.string().min(1, 'กรุณากรอกหมายเลข'),
  aerialPhotoSheet: z.string().min(1, 'กรุณากรอกเลขที่แผ่น'),
  landAreaRai: z.number().min(0, 'กรุณากรอกจำนวนไร่'),
  landAreaNgan: z.number().min(0, 'กรุณากรอกจำนวนงาน'),
  landAreaSquareWah: z.number().min(0, 'กรุณากรอกจำนวนตารางวา')
})
