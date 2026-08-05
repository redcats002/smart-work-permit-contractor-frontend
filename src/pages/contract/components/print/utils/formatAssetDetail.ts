import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import { formatTitle, isApartmentAsset, isLandAllAsset, isVehicleAsset } from '@/enums/modules/asset/AssetType.enum'

export function formatAssetDetail (asset: IPreAssetList): string {
  const type = asset.type

  if (isLandAllAsset(type)) {
    const f = asset.realEstateForm
    return [
      `ประเภท ${formatTitle(type) || '-'}`,
      asset.detail,
      `เลขที่ ${f?.aerialPhotoMapNo || '-'}`,
      `เลขที่ดิน ${f?.landNo || '-'}`,
      `หน้าสำรวจ ${f?.surveyNo || '-'}`,
      `ตำบล ${f?.subDistrict || '-'}`,
      `อำเภอ ${f?.district || '-'}`,
      `จังหวัด ${f?.province || '-'}`
    ].join(' ')
  }

  if (isVehicleAsset(type)) {
    const f = asset.vehicleForm
    return [
      `ประเภท ${formatTitle(type) || '-'}`,
      asset.detail,
      `ยี่ห้อ ${f?.brand || '-'}`,
      `รุ่น ${f?.model || '-'}`,
      `สี ${f?.color || '-'}`,
      `หมายเลขทะเบียน ${f?.plateNo || '-'}`,
      `จังหวัด ${f?.province || '-'}`
    ].join(' ')
  }

  if (isApartmentAsset(type)) {
    const f = asset.apartmentCondoForm
    return [
      `ประเภท ${formatTitle(type) || '-'}`,
      asset.detail,
      `โฉนดที่ดินเลขที่ ${f?.landNo || '-'}`,
      `ห้องชุดเลขที่ ${f?.unitNumber || '-'}`,
      `ชั้น ${f?.floorNumber || '-'}`,
      `อาคาร ${f?.buildingName || '-'}`,
      `ตำบล ${f?.subDistrict || '-'}`,
      `อำเภอ ${f?.district || '-'}`,
      `จังหวัด ${f?.province || '-'}`
    ].join(' ')
  }

  return asset.detail || ''
}
