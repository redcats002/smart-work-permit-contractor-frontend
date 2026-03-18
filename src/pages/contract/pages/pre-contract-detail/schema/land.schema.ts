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
  detail: z.string().optional().default(''),
  landNo: z.string().min(1, 'กรุณากรอกเลขที่ดิน'),
  surveyNo: z.string().optional().default(''),
  address: z.string().optional().default(''),
  subDistrict: z.string().optional().default(''),
  district: z.string().optional().default(''),
  province: z.string().optional().default(''),
  postCode: z.string().optional().default(''),
  aerialPhotoMapNo: z.string().optional().default(''),
  aerialPhotoSheet: z.string().optional().default(''),
  landAreaRai: z.number().nullable().optional(),
  landAreaNgan: z.number().nullable().optional(),
  landAreaSquareWah: z.number().nullable().optional()
})
