import { formatter } from '@/utils/Formatter'
import { schema } from '@/utils/Schema'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import { isTitleDeedAsset } from '@/enums/modules/asset/AssetType.enum'
import { z } from 'zod'
import { LandSchema as FormValues } from '../../../create/schema/pre-contract.schema'

function numericField (message: string, required: boolean = false) {
  return z.preprocess(
    (value: unknown): unknown => {
      if (value == null || value === '') return required ? undefined : 0
      if (typeof value === 'string') {
        const parsed = formatter.numberParseFloat(value)
        return Number.isNaN(parsed) ? value : parsed
      }
      return value
    }, required ? z.number({ message }).min(0, message) : z.number().min(0, message).default(0)
  )
}

export const LandFormSchema = z.object({
  ...FormValues.shape,
  id: schema.id('รหัสที่ดิน'),
  landNo: z.string().min(1, 'กรุณากรอกเลขที่ดิน'),
  surveyNo: z.string().min(1, 'กรุณากรอกเลขที่สำรวจ'),
  aerialPhotoMapNo: z.string().min(1, 'กรุณากรอกหมายเลข'),
  aerialPhotoSheet: z.string().min(1, 'กรุณากรอกเลขที่แผ่น'),
  titleDeedNo: z.string().min(1, 'กรุณากรอกโฉนดเลขที่'),
  landAreaRai: numericField('กรุณากรอกจำนวนไร่'),
  landAreaNgan: numericField('กรุณากรอกจำนวนงาน'),
  landAreaSquareWah: numericField('กรุณากรอกจำนวนตารางวา')
})

export type LandFormValues = z.infer<typeof LandFormSchema>

export const ModalLandSchema = z
  .object({
    type: z.string().min(1, 'กรุณาเลือกประเภทหลักทรัพย์'),
    detail: z.string().min(1, 'กรุณากรอกรายละเอียดหลักทรัพย์').default(''),
    landNo: z.string().min(1, 'กรุณากรอกเลขที่ดิน'),
    surveyNo: z.string().min(1, 'กรุณากรอกเลขที่สำรวจ'),
    titleDeedNo: z.string().optional(),
    address: z.string().optional(),
    subDistrict: z.string().min(1, 'กรุณากรอกตำบล'),
    district: z.string().min(1, 'กรุณากรอกอำเภอ'),
    province: z.string().min(1, 'กรุณากรอกจังหวัด'),
    postCode: z.string().min(1, 'กรุณากรอกรหัสไปรษณีย์'),
    urlGoogleMap: z.string().optional(),
    aerialPhotoMapNo: z.string().optional(),
    aerialPhotoSheet: z.string().optional(),
    landAreaRai: numericField('กรุณากรอกจำนวนไร่', true),
    landAreaNgan: numericField('กรุณากรอกจำนวนงาน', true),
    landAreaSquareWah: numericField('กรุณากรอกจำนวนตารางวา', true)
  })
  .superRefine((data: ModalLandFormValues, ctx: z.RefinementCtx) => {
    const isTitleDeed = data.type === 'TITLE_DEED_WITH_BUILDING' || data.type === 'TITLE_DEED_VACANT_LAND'
    if (!isTitleDeed) {
      if (!data.aerialPhotoMapNo) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'กรุณากรอกหมายเลข', path: ['aerialPhotoMapNo'] })
      }
      if (!data.aerialPhotoSheet) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'กรุณากรอกเลขที่แผ่น', path: ['aerialPhotoSheet'] })
      }
    }
    if (isTitleDeed && !data.titleDeedNo) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'กรุณากรอกโฉนดเลขที่', path: ['titleDeedNo'] })
    }
  })

export type ModalLandFormValues = z.infer<typeof ModalLandSchema>

export function readyForAppraisal (preAsset?: IPreAssetList | null): boolean {
  if (isTitleDeedAsset(preAsset?.type)) {
    const checks = {
      detail: !!preAsset?.detail,
      landNo: !!preAsset?.realEstateForm?.landNo,
      titleDeedNo: !!preAsset?.realEstateForm?.titleDeedNo,
      surveyNo: !!preAsset?.realEstateForm?.surveyNo,
      subDistrict: !!preAsset?.realEstateForm?.subDistrict,
      district: !!preAsset?.realEstateForm?.district,
      province: !!preAsset?.realEstateForm?.province,
      postCode: !!preAsset?.realEstateForm?.postCode
    }
    const result = Object.values(checks).every(Boolean)
    if (result) return true
  }

  const ns3Checks = {
    detail: !!preAsset?.detail,
    landNo: !!preAsset?.realEstateForm?.landNo,
    surveyNo: !!preAsset?.realEstateForm?.surveyNo,
    aerialPhotoMapNo: !!preAsset?.realEstateForm?.aerialPhotoMapNo,
    aerialPhotoSheet: !!preAsset?.realEstateForm?.aerialPhotoSheet,
    subDistrict: !!preAsset?.realEstateForm?.subDistrict,
    district: !!preAsset?.realEstateForm?.district,
    province: !!preAsset?.realEstateForm?.province,
    postCode: !!preAsset?.realEstateForm?.postCode
  }
  const ns3Result = Object.values(ns3Checks).every(Boolean)
  return ns3Result
}
