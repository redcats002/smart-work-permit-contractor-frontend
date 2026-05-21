import type { TBaseOption } from '@/models/Global.model'

export enum AssetStatusEnum {
  ACTIVE = 'ACTIVE',
  WAITING_TO_RETURN_CUSTOMER = 'WAITING_TO_RETURN_CUSTOMER',
  RETURNED_TO_CUSTOMER = 'RETURNED_TO_CUSTOMER',
  ENFORCEMENT_OF_JUDGMENT = 'ENFORCEMENT_OF_JUDGMENT',
  SOLD = 'SOLD',
  PENDING_SALE = 'PENDING_SALE',
  DONE = 'DONE'
}

export type TAssetStatus = keyof typeof AssetStatusEnum

const titleMap: Record<TAssetStatus, string> = {
  [AssetStatusEnum.ACTIVE]: 'ใช้งาน',
  [AssetStatusEnum.WAITING_TO_RETURN_CUSTOMER]: 'รอคืนลูกค้า',
  [AssetStatusEnum.RETURNED_TO_CUSTOMER]: 'คืนลูกค้าแล้ว',
  [AssetStatusEnum.ENFORCEMENT_OF_JUDGMENT]: 'บังคับคดี',
  [AssetStatusEnum.PENDING_SALE]: 'รอขาย',
  [AssetStatusEnum.SOLD]: 'ขายแล้ว',
  [AssetStatusEnum.DONE]: 'ปิดแล้ว'
}

export const AssetsStatusItems: TBaseOption[] = Object.values(AssetStatusEnum).map(
  (e: TAssetStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export const AssetStatusForCancelledContractItems: TBaseOption[] = [
  AssetStatusEnum.ENFORCEMENT_OF_JUDGMENT,
  AssetStatusEnum.PENDING_SALE,
  AssetStatusEnum.SOLD
].map(
  (e: TAssetStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)
export const AssetStatusForCloseContractContractItems: TBaseOption[] = [
  AssetStatusEnum.WAITING_TO_RETURN_CUSTOMER,
  AssetStatusEnum.RETURNED_TO_CUSTOMER
].map(
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
    case AssetStatusEnum.WAITING_TO_RETURN_CUSTOMER:
    case AssetStatusEnum.RETURNED_TO_CUSTOMER:
    case AssetStatusEnum.ENFORCEMENT_OF_JUDGMENT:
      return 'bg-blue-50 text-blue-600 border-none'
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
    case AssetStatusEnum.WAITING_TO_RETURN_CUSTOMER:
    case AssetStatusEnum.RETURNED_TO_CUSTOMER:
    case AssetStatusEnum.ENFORCEMENT_OF_JUDGMENT:
      return 'mdi:truck-delivery-outline'
    default:
      return 'mdi:help-circle-outline'
  }
}
