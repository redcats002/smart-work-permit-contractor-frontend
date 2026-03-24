import { schema } from '@/utils/Schema'
import { AssetTypeEnum, isLandAsset, isVehicleAsset } from '@/enums/modules/asset/AssetType.enum'
import { PreContractStatusEnum } from '@/enums/modules/contract/PreContractStatus.enum'
import { ProvinceEnum } from '@/enums/modules/province/Province.enum'
import { z } from 'zod'

export type TAssetCategory = 'VEHICLE' | 'LAND' | null

function addRequired (ctx: z.RefinementCtx, path: (string | number)[], message: string): void {
  ctx.addIssue({ code: 'custom', path, message })
}

export const LandSchema = z.object({
  landNo: z.string().optional().default(''),
  surveyNo: z.string().optional().default(''),
  aerialPhotoMapNo: z.string().optional().default(''),
  aerialPhotoSheet: z.string().optional().default(''),
  landAreaNgan: z.number().optional().default(0),
  landAreaRai: z.number().optional().default(0),
  landAreaSquareWah: z.number().optional().default(0),
  address: z.string().default(''),
  subDistrict: z.string().default(''),
  district: z.string().default(''),
  province: z.string().default(''),
  postCode: z.string().default(''),
  urlGoogleMap: z.string().default('')
})
export const VehicleSchema = z.object({
  brand: z.string().default(''),
  color: z.string().default(''),
  engineNumber: z.string().default(''),
  manufactureYear: z.string().nullable().default(null),
  mileage: z.number().nullable().default(0),
  model: z.string().default(''),
  plateNo: z.string().default(''),
  province: schema.enum(ProvinceEnum, 'จังหวัด'),
  registrationYear: z.string().nullable().default(null),
  vehicleIdentificationNo: z.string().default('')
})

const PreAssetBaseSchema = z.object({
  key: z.string().optional(),
  type: schema.enum(AssetTypeEnum, 'หมวดหมู่หลักทรัพย์'),
  detail: z.string().default(''),
  realEstateForm: LandSchema.optional(),
  vehicleForm: VehicleSchema.optional(),
  images: z.array(z.object({
    id: schema.id('รหัสรูปภาพ'),
    path: z.string().min(1, 'PATH รูปภาพไม่ถูกต้อง'),
    url: z.string().min(1, 'URL รูปภาพไม่ถูกต้อง')
  })).optional().default([])
})

type IPreAssetBase = z.infer<typeof PreAssetBaseSchema>

export const PreAssetSchema = PreAssetBaseSchema.superRefine((data: IPreAssetBase, ctx: z.RefinementCtx): void => {
  if (!data.type) return
  if (isVehicleAsset(data.type)) {
    if (!data.vehicleForm?.brand) addRequired(ctx, ['vehicleForm', 'brand'], 'กรุณากรอกยี่ห้อ')
    if (!data.vehicleForm?.model) addRequired(ctx, ['vehicleForm', 'model'], 'กรุณากรอกรุ่น')
    if (!data.vehicleForm?.color) addRequired(ctx, ['vehicleForm', 'color'], 'กรุณากรอกสี')
    if (!data.vehicleForm?.plateNo) addRequired(ctx, ['vehicleForm', 'plateNo'], 'กรุณากรอกเลขทะเบียนรถ')
    if (!data.vehicleForm?.province) addRequired(ctx, ['vehicleForm', 'province'], 'กรุณาเลือกจังหวัด')
    if (!data.vehicleForm?.manufactureYear) addRequired(ctx, ['vehicleForm', 'manufactureYear'], 'กรุณาเลือกปีที่ผลิต')
    if (!data.vehicleForm?.registrationYear) addRequired(ctx, ['vehicleForm', 'registrationYear'], 'กรุณาเลือกปีที่จดทะเบียน')
    if (!data.vehicleForm?.vehicleIdentificationNo) addRequired(ctx, ['vehicleForm', 'vehicleIdentificationNo'], 'กรุณากรอกหมายเลขตัวถัง')
    if (!data.vehicleForm?.engineNumber) addRequired(ctx, ['vehicleForm', 'engineNumber'], 'กรุณากรอกหมายเลขเครื่อง')
    if (data.vehicleForm?.mileage == null) addRequired(ctx, ['vehicleForm', 'mileage'], 'กรุณากรอกเลขไมล์')
  } else if (isLandAsset(data.type)) {
    if (!data?.detail) addRequired(ctx, ['detail'], 'กรุณากรอกรายละเอียด')
    if (!data.realEstateForm?.subDistrict) addRequired(ctx, ['realEstateForm', 'subDistrict'], 'กรุณาเลือกตำบล')
    if (!data.realEstateForm?.district) addRequired(ctx, ['realEstateForm', 'district'], 'กรุณาเลือกอำเภอ')
    if (!data.realEstateForm?.province) addRequired(ctx, ['realEstateForm', 'province'], 'กรุณาเลือกจังหวัด')
    if (!data.realEstateForm?.postCode) addRequired(ctx, ['realEstateForm', 'postCode'], 'กรุณากรอกรหัสไปรษณีย์')
    if (!data.realEstateForm?.landNo) addRequired(ctx, ['realEstateForm', 'landNo'], 'กรุณากรอกเลขที่ดิน')
    if (!data.realEstateForm?.surveyNo) addRequired(ctx, ['realEstateForm', 'surveyNo'], 'กรุณากรอกเลขที่สำรวจ')
    if (!data.realEstateForm?.aerialPhotoMapNo) addRequired(ctx, ['realEstateForm', 'aerialPhotoMapNo'], 'กรุณากรอกเลขที่แผนที่ถ่ายทางอากาศ')
    if (!data.realEstateForm?.aerialPhotoSheet) addRequired(ctx, ['realEstateForm', 'aerialPhotoSheet'], 'กรุณากรอกแผ่นถ่ายทางอากาศ')
    if (!data.realEstateForm?.landAreaNgan) addRequired(ctx, ['realEstateForm', 'landAreaNgan'], 'กรุณากรอกเนื้อที่ (งาน)')
    if (!data.realEstateForm?.landAreaRai) addRequired(ctx, ['realEstateForm', 'landAreaRai'], 'กรุณากรอกเนื้อที่ (ไร่)')
    if (!data.realEstateForm?.landAreaSquareWah) addRequired(ctx, ['realEstateForm', 'landAreaSquareWah'], 'กรุณากรอกเนื้อที่ (ตารางวา)')
  }
})

export type PreAssetFormValues = z.infer<typeof PreAssetSchema>

const PreContractBaseSchema = z.object({
  customerId: schema.id('ลูกค้า'),
  sellManId: schema.id('หน้างานประเมิน'),
  preAssets: z.array(PreAssetSchema).min(1, 'กรุณาเพิ่มหลักทรัพย์อย่างน้อย 1 รายการ'),
  status: schema.enum(PreContractStatusEnum, 'สถานะหลักทรัพย์')
})

type IPreContractBase = z.infer<typeof PreContractBaseSchema>

export const PreContractSchema = PreContractBaseSchema.superRefine((data: IPreContractBase, ctx: z.RefinementCtx): void => {
  const hasVehicle = data.preAssets.some((e: PreAssetFormValues): boolean => isVehicleAsset(e.type))
  const hasLand = data.preAssets.some((e: PreAssetFormValues): boolean => isLandAsset(e.type))

  if (hasVehicle && hasLand) {
    ctx.addIssue({
      code: 'custom',
      path: ['preAssets', 0, 'type'],
      message: 'ไม่สามารถผสมประเภทยานพาหนะและที่ดินในสัญญาเดียวกันได้'
    })
  }

  if (hasVehicle && data.preAssets.length > 1) {
    ctx.addIssue({
      code: 'custom',
      path: ['preAssets', 1, 'type'],
      message: 'ประเภทยานพาหนะมีได้เพียง 1 รายการ'
    })
  }
})

export type PreContractFormValues = z.infer<typeof PreContractSchema>
export type LandFormValues = z.infer<typeof LandSchema>
export type VehicleFormValues = z.infer<typeof VehicleSchema>

export function createPreAssetBase (): PreAssetFormValues {
  return {
    key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    type: '',
    detail: '',
    images: [],
    // Land fields
    realEstateForm: {
      address: '',
      subDistrict: '',
      district: '',
      province: '',
      postCode: '',
      urlGoogleMap: '',
      aerialPhotoMapNo: '',
      aerialPhotoSheet: '',
      landAreaNgan: 0,
      landAreaRai: 0,
      landAreaSquareWah: 0,
      landNo: '',
      surveyNo: ''
    },
    // Vehicle fields
    vehicleForm: {
      brand: '',
      model: '',
      color: '',
      plateNo: '',
      province: '',
      manufactureYear: null,
      registrationYear: null,
      vehicleIdentificationNo: '',
      engineNumber: '',
      mileage: null
    }
  }
}

export function useFormInitialValues (): PreContractFormValues {
  return {
    customerId: undefined,
    sellManId: undefined,
    preAssets: [createPreAssetBase()],
    status: 'DRAFT'
  }
}

export function useDev (): PreContractFormValues {
  return {
    preAssets: [
      {
        detail: '',
        key: '',
        images: [],
        realEstateForm: undefined,
        type: AssetTypeEnum.VEHICLE_CAR,
        vehicleForm: {
          brand: 'Toyota',
          color: 'White',
          engineNumber: '1NZ-FE123456',
          manufactureYear: '2015',
          mileage: 50000,
          model: 'Vios',
          plateNo: 'กทม 1234',
          province: 'กรุงเทพมหานคร',
          registrationYear: '2015',
          vehicleIdentificationNo: 'JTDBT92E200123456'
        }
      }
    ],
    customerId: 3,
    sellManId: 'uvKG4h8tCGO9yEjlxNRiCgfeI4gth3ve',
    status: 'DRAFT'
  }
}
