import type { TBaseOption } from '@/models/Global.model'

export enum CollateralTypeEnum {
  LAND_NS3K_WITH_STRUCTURE = 'LAND_NS3K_WITH_STRUCTURE',
  LAND_NS3K_WITHOUT_STRUCTURE = 'LAND_NS3K_WITHOUT_STRUCTURE',
  LAND_NS3_WITH_STRUCTURE = 'LAND_NS3_WITH_STRUCTURE',
  LAND_NS3_WITHOUT_STRUCTURE = 'LAND_NS3_WITHOUT_STRUCTURE',
  VEHICLE_CAR = 'VEHICLE_CAR',
  VEHICLE_MOTORCYCLE = 'VEHICLE_MOTORCYCLE',
  VEHICLE_AGRICULTURE_MACHINE = 'VEHICLE_AGRICULTURE_MACHINE',
  VEHICLE_TRUCK = 'VEHICLE_TRUCK'
}

export type TCollateralType = keyof typeof CollateralTypeEnum

const titleMap: Record<TCollateralType, string> = {
  [CollateralTypeEnum.LAND_NS3K_WITH_STRUCTURE]: 'ที่ดิน น.ส.3 ก. - มีสิ่งปลูกสร้าง',
  [CollateralTypeEnum.LAND_NS3K_WITHOUT_STRUCTURE]: 'ที่ดิน น.ส.3 ก. - ไม่มีสิ่งปลูกสร้าง',
  [CollateralTypeEnum.LAND_NS3_WITH_STRUCTURE]: 'ที่ดิน น.ส.3 - มีสิ่งปลูกสร้าง',
  [CollateralTypeEnum.LAND_NS3_WITHOUT_STRUCTURE]: 'ที่ดิน น.ส.3 - ไม่มีสิ่งปลูกสร้าง',
  [CollateralTypeEnum.VEHICLE_CAR]: 'ยานพาหนะ - รถยนต์',
  [CollateralTypeEnum.VEHICLE_MOTORCYCLE]: 'ยานพาหนะ - รถจักรยานยนต์',
  [CollateralTypeEnum.VEHICLE_AGRICULTURE_MACHINE]: 'ยานพาหนะ - เครื่องจักรการเกษตร',
  [CollateralTypeEnum.VEHICLE_TRUCK]: 'ยานพาหนะ - รถบรรทุก'
}

export function formatTitle (type?: TCollateralType): string {
  if (!type) return 'ไม่ระบุ'
  return titleMap[type] || type
}

export const CollateralTypeItems: TBaseOption[] = Object.values(CollateralTypeEnum).map(
  (e: TCollateralType): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export const VehicleCollateralTypeItems: TBaseOption[] = CollateralTypeItems.filter(
  (e: TBaseOption): boolean => String(e.value).startsWith('VEHICLE_')
)

export const LandCollateralTypeItems: TBaseOption[] = CollateralTypeItems.filter(
  (e: TBaseOption): boolean => String(e.value).startsWith('LAND_')
)

export function isVehicleCollateral (type?: string | null): boolean {
  if (!type) return false
  return type.startsWith('VEHICLE_')
}

export function isLandCollateral (type?: string | null): boolean {
  if (!type) return false
  return type.startsWith('LAND_')
}
