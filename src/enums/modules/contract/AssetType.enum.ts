import type { TBaseOption } from '@/models/Global.model'

export enum AssetTypeEnum {
  NS3K_WITH_BUILDING = 'NS3K_WITH_BUILDING',
  NS3K_VACANT_LAND = 'NS3K_VACANT_LAND',
  NS3_WITH_BUILDING = 'NS3_WITH_BUILDING',
  NS3_VACANT_LAND = 'NS3_VACANT_LAND',
  VEHICLE_CAR = 'VEHICLE_CAR',
  VEHICLE_MOTORCYCLE = 'VEHICLE_MOTORCYCLE',
  VEHICLE_FARM_MACHINERY = 'VEHICLE_FARM_MACHINERY',
  VEHICLE_TRUCK = 'VEHICLE_TRUCK'
}

export type TAssetType = keyof typeof AssetTypeEnum

const titleMap: Record<TAssetType, string> = {
  [AssetTypeEnum.NS3K_WITH_BUILDING]: 'ที่ดิน น.ส.3 ก. - มีสิ่งปลูกสร้าง',
  [AssetTypeEnum.NS3K_VACANT_LAND]: 'ที่ดิน น.ส.3 ก. - ไม่มีสิ่งปลูกสร้าง',
  [AssetTypeEnum.NS3_WITH_BUILDING]: 'ที่ดิน น.ส.3 - มีสิ่งปลูกสร้าง',
  [AssetTypeEnum.NS3_VACANT_LAND]: 'ที่ดิน น.ส.3 - ไม่มีสิ่งปลูกสร้าง',
  [AssetTypeEnum.VEHICLE_CAR]: 'ยานพาหนะ - รถยนต์',
  [AssetTypeEnum.VEHICLE_MOTORCYCLE]: 'ยานพาหนะ - รถจักรยานยนต์',
  [AssetTypeEnum.VEHICLE_FARM_MACHINERY]: 'ยานพาหนะ - เครื่องจักรการเกษตร',
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
  (e: TBaseOption): boolean => String(e.value).startsWith('NS3')
)

export function isVehicleAsset (type?: string | null): boolean {
  if (!type) return false
  return type.startsWith('VEHICLE_')
}

export function isLandAsset (type?: string | null): boolean {
  if (!type) return false
  return type.startsWith('NS3')
}
