import type { TBaseOption } from '@/models/Global.model'

export enum EstateTypeEnum {
  LAND_NS3K_WITH_STRUCTURE = 'LAND_NS3K_WITH_STRUCTURE',
  LAND_NS3K_WITHOUT_STRUCTURE = 'LAND_NS3K_WITHOUT_STRUCTURE',
  LAND_NS3_WITH_STRUCTURE = 'LAND_NS3_WITH_STRUCTURE',
  LAND_NS3_WITHOUT_STRUCTURE = 'LAND_NS3_WITHOUT_STRUCTURE',
  VEHICLE_CAR = 'VEHICLE_CAR',
  VEHICLE_MOTORCYCLE = 'VEHICLE_MOTORCYCLE',
  VEHICLE_AGRICULTURE_MACHINE = 'VEHICLE_AGRICULTURE_MACHINE',
  VEHICLE_TRUCK = 'VEHICLE_TRUCK'
}

export type TEstateType = keyof typeof EstateTypeEnum

const titleMap: Record<TEstateType, string> = {
  [EstateTypeEnum.LAND_NS3K_WITH_STRUCTURE]: 'ที่ดิน น.ส.3 ก. - มีสิ่งปลูกสร้าง',
  [EstateTypeEnum.LAND_NS3K_WITHOUT_STRUCTURE]: 'ที่ดิน น.ส.3 ก. - ไม่มีสิ่งปลูกสร้าง',
  [EstateTypeEnum.LAND_NS3_WITH_STRUCTURE]: 'ที่ดิน น.ส.3 - มีสิ่งปลูกสร้าง',
  [EstateTypeEnum.LAND_NS3_WITHOUT_STRUCTURE]: 'ที่ดิน น.ส.3 - ไม่มีสิ่งปลูกสร้าง',
  [EstateTypeEnum.VEHICLE_CAR]: 'ยานพาหนะ - รถยนต์',
  [EstateTypeEnum.VEHICLE_MOTORCYCLE]: 'ยานพาหนะ - รถจักรยานยนต์',
  [EstateTypeEnum.VEHICLE_AGRICULTURE_MACHINE]: 'ยานพาหนะ - เครื่องจักรการเกษตร',
  [EstateTypeEnum.VEHICLE_TRUCK]: 'ยานพาหนะ - รถบรรทุก'
}

export function formatTitle (type?: TEstateType): string {
  if (!type) return 'ไม่ระบุ'
  return titleMap[type] || type
}

export const EstateTypeItems: TBaseOption[] = Object.values(EstateTypeEnum).map(
  (e: TEstateType): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export const VehicleEstateTypeItems: TBaseOption[] = EstateTypeItems.filter(
  (e: TBaseOption): boolean => String(e.value).startsWith('VEHICLE_')
)

export const LandEstateTypeItems: TBaseOption[] = EstateTypeItems.filter(
  (e: TBaseOption): boolean => String(e.value).startsWith('LAND_')
)

export function isVehicleEstate (type?: string | null): boolean {
  if (!type) return false
  return type.startsWith('VEHICLE_')
}

export function isLandEstate (type?: string | null): boolean {
  if (!type) return false
  return type.startsWith('LAND_')
}
