import { formatter } from '@/utils/Formatter'
import { schema } from '@/utils/Schema'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import { z } from 'zod'
import { ApartmentCondoSchema as FormValues } from '../../create/schema/pre-contract.schema'

function numericField (message: string) {
  return z.preprocess((value: unknown): unknown => {
    if (value == null || value === '') return ''
    if (typeof value === 'string') {
      const parsed = formatter.numberParseFloat(value)
      return Number.isNaN(parsed) ? value : parsed
    }
    return value
  }, z.number().min(0, message).default(0))
}

export const ApartmentFormSchema = z.object({
  ...FormValues.shape,
  id: schema.id('รหัสห้องชุด'),
  landNo: z.string().min(1, 'กรุณากรอกโฉนดที่ดินเลขที่'),
  unitNumber: z.string().min(1, 'กรุณากรอกห้องชุดเลขที่'),
  floorNumber: z.string().min(1, 'กรุณากรอกชั้นที่'),
  buildingNumber: z.string().min(1, 'กรุณากรอกอาคารเลขที่'),
  buildingName: z.string().min(1, 'กรุณากรอกชื่ออาคารชุด'),
  buildingRegistrationNumber: z.string().min(1, 'กรุณากรอกทะเบียนอาคารชุดเลขที่'),
  roomAreaSquareMeter: numericField('กรุณากรอกเนื้อที่'),
  roomHeightMeter: numericField('กรุณากรอกความสูง'),
  commonPropertyOwnershipRatio: z.string().min(1, 'กรุณากรอกอัตราส่วนกรรมสิทธิ์')
})

export type ApartmentFormValues = z.infer<typeof ApartmentFormSchema>

export const ModalApartmentSchema = z.object({
  type: z.string().min(1, 'กรุณาเลือกประเภทหลักทรัพย์'),
  detail: z.string().min(1, 'กรุณากรอกรายละเอียดหลักทรัพย์').default(''),
  landNo: z.string().min(1, 'กรุณากรอกโฉนดที่ดินเลขที่'),
  address: z.string().optional(),
  subDistrict: z.string().min(1, 'กรุณากรอกตำบล'),
  district: z.string().min(1, 'กรุณากรอกอำเภอ'),
  province: z.string().min(1, 'กรุณากรอกจังหวัด'),
  postCode: z.string().min(1, 'กรุณากรอกรหัสไปรษณีย์'),
  urlGoogleMap: z.string().optional(),
  landAreaRai: numericField('กรุณากรอกจำนวนไร่'),
  landAreaNgan: numericField('กรุณากรอกจำนวนงาน'),
  landAreaSquareWah: numericField('กรุณากรอกจำนวนตารางวา'),
  unitNumber: z.string().min(1, 'กรุณากรอกห้องชุดเลขที่'),
  floorNumber: z.string().min(1, 'กรุณากรอกชั้นที่'),
  buildingNumber: z.string().min(1, 'กรุณากรอกอาคารเลขที่'),
  buildingName: z.string().min(1, 'กรุณากรอกชื่ออาคารชุด'),
  buildingRegistrationNumber: z.string().min(1, 'กรุณากรอกทะเบียนอาคารชุดเลขที่'),
  roomAreaSquareMeter: numericField('กรุณากรอกเนื้อที่'),
  roomHeightMeter: numericField('กรุณากรอกความสูง'),
  commonPropertyOwnershipRatio: z.string().min(1, 'กรุณากรอกอัตราส่วนกรรมสิทธิ์')
})

export type ModalApartmentFormValues = z.infer<typeof ModalApartmentSchema>

export function readyForAppraisal (preAsset?: IPreAssetList | null): boolean {
  if (
    preAsset?.detail
    && preAsset?.apartmentCondoForm?.landNo
    && preAsset?.apartmentCondoForm?.unitNumber
    && preAsset?.apartmentCondoForm?.floorNumber
    && preAsset?.apartmentCondoForm?.buildingNumber
    && preAsset?.apartmentCondoForm?.buildingName
    && preAsset?.apartmentCondoForm?.buildingRegistrationNumber
    && preAsset?.apartmentCondoForm?.subDistrict
    && preAsset?.apartmentCondoForm?.district
    && preAsset?.apartmentCondoForm?.province
    && preAsset?.apartmentCondoForm?.postCode
  )
    return true
  return false
}
