import type { TBaseOption } from '@/models/Global.model'

export enum AssetStatusEnum {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  PENDING_SALE = 'PENDING_SALE',
  DONE = 'DONE'
}

export type TAssetStatus = keyof typeof AssetStatusEnum

const titleMap: Record <TAssetStatus, string> = {
  [AssetStatusEnum.ACTIVE]: 'ใช้งาน',
  [AssetStatusEnum.SOLD]: 'ขายแล้ว',
  [AssetStatusEnum.PENDING_SALE]: 'รอขาย',
  [AssetStatusEnum.DONE]: 'ปิดแล้ว'
}

export const AssetsStatusItems: TBaseOption[] = Object.values(AssetStatusEnum).map(
  (e: TAssetStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TAssetStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TAssetStatus): string {
  switch (value) {
    case AssetStatusEnum.ACTIVE:
      return 'bg-green-brand-light text-green-brand border-none'
    case AssetStatusEnum.PENDING_SALE:
      return 'bg-yellow-50 text-yellow-600 border-none'
    case AssetStatusEnum.SOLD:
      return 'bg-gray-100 text-gray-600 border-none'
    case AssetStatusEnum.DONE:
      return 'bg-gray-200 text-gray-500 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TAssetStatus): string {
  switch (value) {
    case AssetStatusEnum.ACTIVE:
      return 'icon-park-outline:check-one'
    case AssetStatusEnum.PENDING_SALE:
      return 'solar:clock-circle-linear'
    case AssetStatusEnum.SOLD:
      return 'mdi:tag-outline'
    case AssetStatusEnum.DONE:
      return 'material-symbols:close-rounded'
    default:
      return 'mdi:help-circle-outline'
  }
}
