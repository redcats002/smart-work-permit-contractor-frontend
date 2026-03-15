import { schema } from '@/utils/Schema'
import { AssetTypeEnum, isLandAsset, isVehicleAsset } from '@/enums/modules/contract/AssetType.enum'
import { z } from 'zod'

function addRequired (ctx: z.RefinementCtx, field: string, message: string): void {
  ctx.addIssue({ code: 'custom', path: [field], message })
}

const LandSchema = z.object({
  address: z.string().default(''),
  subDistrict: z.string().default(''),
  district: z.string().default(''),
  province: z.string().default(''),
  postCode: z.string().default(''),
  urlGoogleMap: z.string().default('')
})
const VehicleSchema = z.object({
  brand: z.string().default(''),
  vehicleModel: z.string().default(''),
  color: z.string().default(''),
  licensePlate: z.string().default(''),
  vehicleProvince: z.string().default(''),
  yearManufactured: z.number().nullable().default(null),
  yearRegistered: z.number().nullable().default(null),
  chassisNumber: z.string().default(''),
  engineNumber: z.string().default(''),
  mileage: z.number().nullable().default(null)
})

const EstateItemBaseSchema = z.object({
  key: z.string().optional(),
  assetType: schema.enum(AssetTypeEnum, 'ประเภทหลักทรัพย์'),
  detail: z.string().default(''),
  ...LandSchema.shape,
  ...VehicleSchema.shape
})

type IEstateItemBase = z.infer<typeof EstateItemBaseSchema>

export const EstateItemSchema = EstateItemBaseSchema.superRefine(
  (data: IEstateItemBase, ctx: z.RefinementCtx): void => {
    if (!data.assetType) return

    if (isVehicleAsset(data.assetType)) {
      if (!data.brand) addRequired(ctx, 'brand', 'กรุณากรอกยี่ห้อ')
      if (!data.vehicleModel) addRequired(ctx, 'vehicleModel', 'กรุณากรอกรุ่น')
      if (!data.color) addRequired(ctx, 'color', 'กรุณากรอกสี')
      if (!data.licensePlate) addRequired(ctx, 'licensePlate', 'กรุณากรอกเลขทะเบียนรถ')
      if (!data.vehicleProvince) addRequired(ctx, 'vehicleProvince', 'กรุณาเลือกจังหวัด')
      if (!data.yearManufactured) addRequired(ctx, 'yearManufactured', 'กรุณาเลือกปีที่ผลิต')
      if (!data.yearRegistered) addRequired(ctx, 'yearRegistered', 'กรุณาเลือกปีที่จดทะเบียน')
      if (!data.chassisNumber) addRequired(ctx, 'chassisNumber', 'กรุณากรอกหมายเลขตัวถัง')
      if (!data.engineNumber) addRequired(ctx, 'engineNumber', 'กรุณากรอกหมายเลขเครื่อง')
      if (data.mileage == null) addRequired(ctx, 'mileage', 'กรุณากรอกเลขไมล์')
    } else if (isLandAsset(data.assetType)) {
      if (!data.detail) addRequired(ctx, 'detail', 'กรุณากรอกรายละเอียด')
      if (!data.subDistrict) addRequired(ctx, 'subDistrict', 'กรุณาเลือกตำบล')
      if (!data.district) addRequired(ctx, 'district', 'กรุณาเลือกอำเภอ')
      if (!data.province) addRequired(ctx, 'province', 'กรุณาเลือกจังหวัด')
      if (!data.postCode) addRequired(ctx, 'postCode', 'กรุณากรอกรหัสไปรษณีย์')
    }
  }
)

export type IEstateFormItem = z.infer<typeof EstateItemSchema>

const PreContractBaseSchema = z.object({
  customerId: schema.id('ลูกค้า'),
  employeeId: schema.id('หน้างานประเมิน'),
  assets: z
    .array(EstateItemSchema)
    .min(1, 'กรุณาเพิ่มหลักทรัพย์อย่างน้อย 1 รายการ')
})

type IPreContractBase = z.infer<typeof PreContractBaseSchema>

export const PreContractSchema = PreContractBaseSchema.superRefine(
  (data: IPreContractBase, ctx: z.RefinementCtx): void => {
    const hasVehicle = data.assets.some((e: IEstateFormItem): boolean => isVehicleAsset(e.assetType))
    const hasLand = data.assets.some((e: IEstateFormItem): boolean => isLandAsset(e.assetType))

    if (hasVehicle && hasLand) {
      ctx.addIssue({
        code: 'custom',
        path: ['assets', 0, 'assetType'],
        message: 'ไม่สามารถผสมประเภทยานพาหนะและที่ดินในสัญญาเดียวกันได้'
      })
    }

    if (hasVehicle && data.assets.length > 1) {
      ctx.addIssue({
        code: 'custom',
        path: ['assets', 1, 'assetType'],
        message: 'ประเภทยานพาหนะมีได้เพียง 1 รายการ'
      })
    }
  }
)

export type PreContractFormValues = z.infer<typeof PreContractSchema>
export type LandFormValues = z.infer<typeof LandSchema>
export type VehicleFormValues = z.infer<typeof VehicleSchema>

export function createEstateItem (): IEstateFormItem {
  return {
    key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    assetType: '',
    detail: '',
    // Land fields
    address: '',
    subDistrict: '',
    district: '',
    province: '',
    postCode: '',
    urlGoogleMap: '',
    // Vehicle fields
    brand: '',
    vehicleModel: '',
    color: '',
    licensePlate: '',
    vehicleProvince: '',
    yearManufactured: null,
    yearRegistered: null,
    chassisNumber: '',
    engineNumber: '',
    mileage: null
  }
}

export function useFormInitialValues (): PreContractFormValues {
  return {
    customerId: undefined,
    employeeId: undefined,
    assets: [createEstateItem()]
  }
}
