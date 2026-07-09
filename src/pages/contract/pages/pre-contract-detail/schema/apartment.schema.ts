import { schema } from '@/utils/Schema'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import { z } from 'zod'
import { ApartmentCondoSchema as FormValues } from '../../create/schema/pre-contract.schema'

export const ApartmentFormSchema = z.object({
  ...FormValues.shape,
  id: schema.id('รหัสห้องชุด'),
  landNo: z.string().min(1, 'กรุณากรอกโฉนดที่ดินเลขที่'),
  unitNumber: z.string().min(1, 'กรุณากรอกห้องชุดเลขที่'),
  floorNumber: z.string().min(1, 'กรุณากรอกชั้นที่'),
  buildingNumber: z.string().min(1, 'กรุณากรอกอาคารเลขที่'),
  buildingName: z.string().min(1, 'กรุณากรอกชื่ออาคารชุด'),
  buildingRegistrationNumber: z.string().min(1, 'กรุณากรอกทะเบียนอาคารชุดเลขที่'),
  roomAreaSquareMeter: schema.numericField('กรุณากรอกเนื้อที่'),
  roomHeightMeter: schema.numericField('กรุณากรอกความสูง'),
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
  landAreaRai: schema.numericField('กรุณากรอกจำนวนไร่'),
  landAreaNgan: schema.numericField('กรุณากรอกจำนวนงาน'),
  landAreaSquareWah: schema.numericField('กรุณากรอกจำนวนตารางวา'),
  unitNumber: z.string().min(1, 'กรุณากรอกห้องชุดเลขที่'),
  floorNumber: z.string().min(1, 'กรุณากรอกชั้นที่'),
  buildingNumber: z.string().min(1, 'กรุณากรอกอาคารเลขที่'),
  buildingName: z.string().min(1, 'กรุณากรอกชื่ออาคารชุด'),
  buildingRegistrationNumber: z.string().min(1, 'กรุณากรอกทะเบียนอาคารชุดเลขที่'),
  roomAreaSquareMeter: schema.numericField('กรุณากรอกเนื้อที่'),
  roomHeightMeter: schema.numericField('กรุณากรอกความสูง'),
  commonPropertyOwnershipRatio: z.string().min(1, 'กรุณากรอกอัตราส่วนกรรมสิทธิ์')
})

export type ModalApartmentFormValues = z.infer<typeof ModalApartmentSchema>

export function readyForApartmentAppraisal (preAsset?: IPreAssetList | null): boolean {
  const valid
    = preAsset?.detail
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
      && (preAsset?.apartmentCondoForm?.roomAreaSquareMeter
        || preAsset?.apartmentCondoForm?.roomHeightMeter)
      && preAsset?.apartmentCondoForm?.commonPropertyOwnershipRatio
      && (preAsset?.apartmentCondoForm?.landAreaRai
        || preAsset?.apartmentCondoForm?.landAreaNgan
        || preAsset?.apartmentCondoForm?.landAreaSquareWah)

  if (valid) return true
  return false
}
