import { schema } from '@/utils/Schema'
import { AssetTypeEnum } from '@/enums/modules/contract/AssetType.enum'
import { z } from 'zod'

export const LandFormSchema = z.object({
  assetType: schema.enumSchema(AssetTypeEnum, 'ประเภทหลักทรัพย์'),
  detail: z.string().optional(),
  landNumber: z.string().min(1, 'กรุณากรอกเลขที่ที่ดิน'),
  surveyPageNumber: z.string().optional(),
  landLocation: z.string().optional(),
  subDistrict: z.string().optional(),
  district: z.string().optional(),
  province: z.string().optional(),
  postCode: z.string().optional(),
  aerialPhotoNumber: z.string().optional(),
  aerialPhotoSheet: z.string().optional(),
  areaRai: z.number().nullable().optional(),
  areaRgan: z.number().nullable().optional(),
  areaTarangWa: z.number().nullable().optional()
})

export type LandFormValues = z.infer<typeof LandFormSchema>
