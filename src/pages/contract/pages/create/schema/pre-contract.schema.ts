import { schema } from '@/utils/Schema'
import { AssetTypeEnum, isApartmentAsset, isLandAsset, isVehicleAsset } from '@/enums/modules/asset/AssetType.enum'
import { PreContractStatusEnum } from '@/enums/modules/contract/PreContractStatus.enum'
import { z } from 'zod'

export type TAssetCategory = 'VEHICLE' | 'LAND' | 'APARTMENT' | null

export function getAssetCategory (assets: Array<{ type?: string | null }>): TAssetCategory {
  for (const e of assets) {
    if (isVehicleAsset(e.type)) return 'VEHICLE'
    if (isLandAsset(e.type)) return 'LAND'
    if (isApartmentAsset(e.type)) return 'APARTMENT'
  }
  return null
}

function addRequired (ctx: z.RefinementCtx, path: (string | number)[], message: string): void {
  ctx.addIssue({ code: 'custom', path, message })
}

export const LandSchema = z.object({
  address: z.string().default(''),
  subDistrict: z.string().default(''),
  district: z.string().default(''),
  province: z.string().default(''),
  postCode: z.string().default(''),
  urlGoogleMap: z.string().default(''),
  landNo: z.string().default(''),
  surveyNo: z.string().default(''),
  aerialPhotoMapNo: z.string().default(''),
  aerialPhotoSheet: z.string().default(''),
  landAreaRai: z.number().default(0),
  landAreaNgan: z.number().default(0),
  landAreaSquareWah: z.number().default(0)
})

export const ApartmentCondoSchema = z.object({
  landNo: z.string().default(''),
  address: z.string().default(''),
  subDistrict: z.string().default(''),
  district: z.string().default(''),
  province: z.string().default(''),
  postCode: z.string().default(''),
  urlGoogleMap: z.string().default(''),
  landAreaRai: z.number().default(0),
  landAreaNgan: z.number().default(0),
  landAreaSquareWah: z.number().default(0),
  unitNumber: z.string().default(''),
  floorNumber: z.string().default(''),
  buildingNumber: z.string().default(''),
  buildingName: z.string().default(''),
  buildingRegistrationNumber: z.string().default(''),
  roomAreaSquareMeter: z.number().default(0),
  roomHeightMeter: z.number().default(0),
  commonPropertyOwnershipRatio: z.string().default('')
})
export const VehicleSchema = z.object({
  brand: z.string().default(''),
  color: z.string().default(''),
  engineNumber: z.string().default(''),
  manufactureYear: z.string().nullable().default(null),
  mileage: z.number().nullable().default(null),
  model: z.string().default(''),
  plateNo: z.string().default(''),
  province: z.string().default(''),
  registrationYear: z.string().nullable().default(null),
  vehicleIdentificationNo: z.string().default('')
})

const PreAssetBaseSchema = z.object({
  key: z.string().optional(),
  type: schema.enum(AssetTypeEnum, 'หมวดหมู่หลักทรัพย์'),
  detail: z.string().default(''),
  realEstateForm: LandSchema.optional(),
  vehicleForm: VehicleSchema.optional(),
  apartmentCondoForm: ApartmentCondoSchema.optional(),
  images: z.array(schema.media).optional().default([])
})

type IPreAssetBase = z.infer<typeof PreAssetBaseSchema>

export const PreAssetSchema = PreAssetBaseSchema.superRefine((data: IPreAssetBase, ctx: z.RefinementCtx): void => {
  if (!data.type) return
  if (isVehicleAsset(data.type)) {
    if (!data.vehicleForm) {
      addRequired(ctx, ['vehicleForm'], 'กรุณากรอกข้อมูลยานพาหนะ')
      return
    }
    if (!data.detail) addRequired(ctx, ['detail'], 'กรุณากรอกรายละเอียด')
    if (!data.vehicleForm.brand) addRequired(ctx, ['vehicleForm', 'brand'], 'กรุณากรอกยี่ห้อ')
    if (!data.vehicleForm.model) addRequired(ctx, ['vehicleForm', 'model'], 'กรุณากรอกรุ่น')
    if (!data.vehicleForm.color) addRequired(ctx, ['vehicleForm', 'color'], 'กรุณากรอกสี')
    if (!data.vehicleForm.plateNo) addRequired(ctx, ['vehicleForm', 'plateNo'], 'กรุณากรอกเลขทะเบียนรถ')
    if (!data.vehicleForm.province) addRequired(ctx, ['vehicleForm', 'province'], 'กรุณาเลือกจังหวัด')
    if (!data.vehicleForm.manufactureYear) addRequired(ctx, ['vehicleForm', 'manufactureYear'], 'กรุณาเลือกปีที่ผลิต')
    if (!data.vehicleForm.registrationYear) addRequired(ctx, ['vehicleForm', 'registrationYear'], 'กรุณาเลือกปีที่จดทะเบียน')
    if (!data.vehicleForm.vehicleIdentificationNo) addRequired(ctx, ['vehicleForm', 'vehicleIdentificationNo'], 'กรุณากรอกหมายเลขตัวถัง')
    if (!data.vehicleForm.engineNumber) addRequired(ctx, ['vehicleForm', 'engineNumber'], 'กรุณากรอกหมายเลขเครื่อง')
    if (data.vehicleForm.mileage === null) addRequired(ctx, ['vehicleForm', 'mileage'], 'กรุณากรอกเลขไมล์')
  }
  if (isLandAsset(data.type)) {
    if (!data.detail) addRequired(ctx, ['detail'], 'กรุณากรอกรายละเอียด')
    if (!data.realEstateForm?.subDistrict) addRequired(ctx, ['realEstateForm', 'subDistrict'], 'กรุณาเลือกตำบล')
    if (!data.realEstateForm?.district) addRequired(ctx, ['realEstateForm', 'district'], 'กรุณาเลือกอำเภอ')
    if (!data.realEstateForm?.province) addRequired(ctx, ['realEstateForm', 'province'], 'กรุณาเลือกจังหวัด')
    if (!data.realEstateForm?.postCode) addRequired(ctx, ['realEstateForm', 'postCode'], 'กรุณากรอกรหัสไปรษณีย์')
  }
  if (isApartmentAsset(data.type)) {
    if (!data.detail) addRequired(ctx, ['detail'], 'กรุณากรอกรายละเอียด')
    if (!data.apartmentCondoForm?.landNo) addRequired(ctx, ['apartmentCondoForm', 'landNo'], 'กรุณากรอกโฉนดที่ดินเลขที่')
    if (!data.apartmentCondoForm?.subDistrict) addRequired(ctx, ['apartmentCondoForm', 'subDistrict'], 'กรุณาเลือกตำบล')
    if (!data.apartmentCondoForm?.district) addRequired(ctx, ['apartmentCondoForm', 'district'], 'กรุณาเลือกอำเภอ')
    if (!data.apartmentCondoForm?.province) addRequired(ctx, ['apartmentCondoForm', 'province'], 'กรุณาเลือกจังหวัด')
    if (!data.apartmentCondoForm?.postCode) addRequired(ctx, ['apartmentCondoForm', 'postCode'], 'กรุณากรอกรหัสไปรษณีย์')
    if (!data.apartmentCondoForm?.unitNumber) addRequired(ctx, ['apartmentCondoForm', 'unitNumber'], 'กรุณากรอกห้องชุดเลขที่')
    if (!data.apartmentCondoForm?.floorNumber) addRequired(ctx, ['apartmentCondoForm', 'floorNumber'], 'กรุณากรอกชั้นที่')
    if (!data.apartmentCondoForm?.buildingNumber) addRequired(ctx, ['apartmentCondoForm', 'buildingNumber'], 'กรุณากรอกอาคารเลขที่')
    if (!data.apartmentCondoForm?.buildingName) addRequired(ctx, ['apartmentCondoForm', 'buildingName'], 'กรุณากรอกชื่ออาคารชุด')
    if (!data.apartmentCondoForm?.buildingRegistrationNumber) addRequired(ctx, ['apartmentCondoForm', 'buildingRegistrationNumber'], 'กรุณากรอกทะเบียนอาคารชุดเลขที่')
    if (!data.apartmentCondoForm?.roomAreaSquareMeter) addRequired(ctx, ['apartmentCondoForm', 'roomAreaSquareMeter'], 'กรุณากรอกเนื้อที่')
    if (!data.apartmentCondoForm?.roomHeightMeter) addRequired(ctx, ['apartmentCondoForm', 'roomHeightMeter'], 'กรุณากรอกความสูง')
    if (!data.apartmentCondoForm?.commonPropertyOwnershipRatio) addRequired(ctx, ['apartmentCondoForm', 'commonPropertyOwnershipRatio'], 'กรุณากรอกอัตราส่วนกรรมสิทธิ์')
  }
})

export type PreAssetFormValues = z.infer<typeof PreAssetSchema>

const PreContractBaseSchema = z.object({
  customerId: schema.id('ลูกค้า'),
  sellManId: schema.id('พนักงานประเมิน'),
  preAssets: z.array(PreAssetSchema).min(1, 'กรุณาเพิ่มหลักทรัพย์อย่างน้อย 1 รายการ'),
  status: schema.enum(PreContractStatusEnum, 'สถานะหลักทรัพย์')
})

type IPreContractBase = z.infer<typeof PreContractBaseSchema>

export const PreContractSchema = PreContractBaseSchema.superRefine((data: IPreContractBase, ctx: z.RefinementCtx): void => {
  const hasVehicle = data.preAssets.some((e: PreAssetFormValues): boolean => isVehicleAsset(e.type))
  const hasLand = data.preAssets.some((e: PreAssetFormValues): boolean => isLandAsset(e.type))
  const hasApartment = data.preAssets.some((e: PreAssetFormValues): boolean => isApartmentAsset(e.type))

  if ([hasVehicle, hasLand, hasApartment].filter(Boolean).length > 1) {
    ctx.addIssue({
      code: 'custom',
      path: ['preAssets', 0, 'type'],
      message: 'ไม่สามารถผสมประเภทยานพาหนะ ที่ดิน และห้องชุดในสัญญาเดียวกันได้'
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
export type ApartmentCondoFormValues = z.infer<typeof ApartmentCondoSchema>

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
      landNo: '',
      surveyNo: '',
      landAreaSquareWah: 0
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
    },
    // Apartment/Condo fields
    apartmentCondoForm: {
      landNo: '',
      address: '',
      subDistrict: '',
      district: '',
      province: '',
      postCode: '',
      urlGoogleMap: '',
      landAreaRai: 0,
      landAreaNgan: 0,
      landAreaSquareWah: 0,
      unitNumber: '',
      floorNumber: '',
      buildingNumber: '',
      buildingName: '',
      buildingRegistrationNumber: '',
      roomAreaSquareMeter: 0,
      roomHeightMeter: 0,
      commonPropertyOwnershipRatio: ''
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
