import type { TBaseOption } from '@/models/Global.model'

export enum AssetTypeEnum {
  LAND_NS3K_WITH_STRUCTURE = 'LAND_NS3K_WITH_STRUCTURE',
  LAND_NS3K_WITHOUT_STRUCTURE = 'LAND_NS3K_WITHOUT_STRUCTURE',
  LAND_NS3_WITH_STRUCTURE = 'LAND_NS3_WITH_STRUCTURE',
  LAND_NS3_WITHOUT_STRUCTURE = 'LAND_NS3_WITHOUT_STRUCTURE',
  VEHICLE_CAR = 'VEHICLE_CAR',
  VEHICLE_MOTORCYCLE = 'VEHICLE_MOTORCYCLE',
  VEHICLE_AGRICULTURE_MACHINE = 'VEHICLE_AGRICULTURE_MACHINE',
  VEHICLE_TRUCK = 'VEHICLE_TRUCK'
}

export type TAssetType = keyof typeof AssetTypeEnum

const titleMap: Record<TAssetType, string> = {
  [AssetTypeEnum.LAND_NS3K_WITH_STRUCTURE]: 'ที่ดิน น.ส.3 ก. - มีสิ่งปลูกสร้าง',
  [AssetTypeEnum.LAND_NS3K_WITHOUT_STRUCTURE]: 'ที่ดิน น.ส.3 ก. - ไม่มีสิ่งปลูกสร้าง',
  [AssetTypeEnum.LAND_NS3_WITH_STRUCTURE]: 'ที่ดิน น.ส.3 - มีสิ่งปลูกสร้าง',
  [AssetTypeEnum.LAND_NS3_WITHOUT_STRUCTURE]: 'ที่ดิน น.ส.3 - ไม่มีสิ่งปลูกสร้าง',
  [AssetTypeEnum.VEHICLE_CAR]: 'ยานพาหนะ - รถยนต์',
  [AssetTypeEnum.VEHICLE_MOTORCYCLE]: 'ยานพาหนะ - รถจักรยานยนต์',
  [AssetTypeEnum.VEHICLE_AGRICULTURE_MACHINE]: 'ยานพาหนะ - เครื่องจักรการเกษตร',
  [AssetTypeEnum.VEHICLE_TRUCK]: 'ยานพาหนะ - รถบรรทุก'
}

export function formatTitle (type?: TAssetType): string {
  if (!type) return 'ไม่ระบุ'
  return titleMap[type] || type
}

export const AssetTypeItems: TBaseOption[] = Object.values(AssetTypeEnum).map(
  (e: TAssetType): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export const VehicleAssetTypeItems: TBaseOption[] = AssetTypeItems.filter(
  (e: TBaseOption): boolean => String(e.value).startsWith('VEHICLE_')
)

export const LandAssetTypeItems: TBaseOption[] = AssetTypeItems.filter(
  (e: TBaseOption): boolean => String(e.value).startsWith('LAND_')
)

export function isVehicleAsset (type?: string | null): boolean {
  if (!type) return false
  return type.startsWith('VEHICLE_')
}

export function isLandAsset (type?: string | null): boolean {
  if (!type) return false
  return type.startsWith('LAND_')
}
