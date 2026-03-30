import { formatter } from '@/utils/Formatter'
import { schema } from '@/utils/Schema'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import { z } from 'zod'
import { LandSchema as FormValues } from '../../create/schema/pre-contract.schema'

function numericField (message: string) {
  return z.preprocess((value: unknown): unknown => {
    if (value == null || value === '') return 0
    if (typeof value === 'string') {
      const parsed = formatter.numberParseFloat(value)
      return Number.isNaN(parsed) ? value : parsed
    }
    return value
  }, z.number().min(0, message).default(0))
}

export const LandFormSchema = z.object({
  ...FormValues.shape,
  id: schema.id('รหัสที่ดิน'),
  landNo: z.string().min(1, 'กรุณากรอกเลขที่ดิน'),
  surveyNo: z.string().min(1, 'กรุณากรอกเลขที่สำรวจ'),
  aerialPhotoMapNo: z.string().min(1, 'กรุณากรอกหมายเลข'),
  aerialPhotoSheet: z.string().min(1, 'กรุณากรอกเลขที่แผ่น'),
  landAreaRai: numericField('กรุณากรอกจำนวนไร่'),
  landAreaNgan: numericField('กรุณากรอกจำนวนงาน'),
  landAreaSquareWah: numericField('กรุณากรอกจำนวนตารางวา')
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
  landAreaRai: numericField('กรุณากรอกจำนวนไร่'),
  landAreaNgan: numericField('กรุณากรอกจำนวนงาน'),
  landAreaSquareWah: numericField('กรุณากรอกจำนวนตารางวา')
})

export type ModalLandFormValues = z.infer<typeof ModalLandSchema>

export function readyForAppraisal (preAsset?: IPreAssetList | null): boolean {
  if (
    preAsset?.detail
    && preAsset?.realEstateForm?.landNo
    && preAsset?.realEstateForm?.surveyNo
    && preAsset?.realEstateForm?.aerialPhotoMapNo
    && preAsset?.realEstateForm?.aerialPhotoSheet
    && preAsset?.realEstateForm?.subDistrict
    && preAsset?.realEstateForm?.district
    && preAsset?.realEstateForm?.province
    && preAsset?.realEstateForm?.postCode
  )
    return true
  return false
}
