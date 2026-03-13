import type { TBaseOption } from '@/models/Global.model'

// export enum AssetCategoryStatusEnum {
//   LAND_NS3G = 'LAND_NS3G',
//   LAND_TITLE = 'LAND_TITLE'
// }

// export type TAssetCategoryStatus = keyof typeof AssetCategoryStatusEnum
export const AssetCategoryStatusEnum = {
  LAND_NS3G: 'LAND_NS3G',
  LAND_TITLE: 'LAND_TITLE'
} as const

export type TAssetCategoryStatus = keyof typeof AssetCategoryStatusEnum

const titleMap: Record<TAssetCategoryStatus, string> = {
  [AssetCategoryStatusEnum.LAND_NS3G]: 'ที่ดิน นส3.ก - ไม่มีสิ่งปลูกสร้าง',
  [AssetCategoryStatusEnum.LAND_TITLE]: 'ที่ดิน โฉนด - ไม่มีสิ่งปลูกสร้าง'
}

export const AssetCategoryStatusItems: TBaseOption[] = Object.values(AssetCategoryStatusEnum).map(
  (e: TAssetCategoryStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TAssetCategoryStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
