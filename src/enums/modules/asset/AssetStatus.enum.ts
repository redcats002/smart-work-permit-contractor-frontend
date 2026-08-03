import type { TBaseOption } from '@/models/Global.model'

export enum AssetStatusEnum {
  ACTIVE = 'ACTIVE',
  PENDING_REFUND = 'PENDING_REFUND',
  REFUNDED = 'REFUNDED',
  LEGAL_EXECUTION = 'LEGAL_EXECUTION',
  SOLD = 'SOLD',
  PENDING_SALE = 'PENDING_SALE'
  // DONE = 'DONE'
}

export type TAssetStatus = keyof typeof AssetStatusEnum

const titleMap: Record<TAssetStatus, string> = {
  [AssetStatusEnum.ACTIVE]: 'ใช้งาน',
  [AssetStatusEnum.PENDING_REFUND]: 'รอคืนลูกค้า',
  [AssetStatusEnum.REFUNDED]: 'คืนลูกค้าแล้ว',
  [AssetStatusEnum.LEGAL_EXECUTION]: 'บังคับคดี',
  [AssetStatusEnum.PENDING_SALE]: 'รอขาย',
  [AssetStatusEnum.SOLD]: 'ขายแล้ว'
  // [AssetStatusEnum.DONE]: 'ปิดแล้ว'
}

export const AssetsStatusItems: TBaseOption[] = Object.values(AssetStatusEnum).map(
  (e: TAssetStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export const AssetStatusForCancelledContractItems: TBaseOption[] = [
  AssetStatusEnum.LEGAL_EXECUTION,
  AssetStatusEnum.PENDING_SALE,
  AssetStatusEnum.SOLD
].map(
  (e: TAssetStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)
export const AssetStatusForCloseContractContractItems: TBaseOption[] = [
  AssetStatusEnum.PENDING_REFUND,
  AssetStatusEnum.REFUNDED
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
      return 'bg-blue-brand-light text-blue-brand border-none'
    case AssetStatusEnum.PENDING_SALE:
      return 'bg-yellow-50 text-yellow-600 border-none'
    case AssetStatusEnum.SOLD:
      return 'bg-gray-100 text-gray-600 border-none'
    // case AssetStatusEnum.DONE:
    //   return 'bg-gray-200 text-gray-500 border-none'
    case AssetStatusEnum.PENDING_REFUND:
      return 'bg-orange-50 text-orange-600 border-none'
    case AssetStatusEnum.REFUNDED:
      return 'bg-green-50 text-green-600 border-none'
    case AssetStatusEnum.LEGAL_EXECUTION:
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
      return 'mingcute:time-duration-line'
    case AssetStatusEnum.SOLD:
      return 'mdi:tag-outline'
    // case AssetStatusEnum.DONE:
    //   return 'material-symbols:close-rounded'
    case AssetStatusEnum.PENDING_REFUND:
      return 'tabler:file-time'
    case AssetStatusEnum.REFUNDED:
      return 'material-symbols:list-alt-check-outline'
    case AssetStatusEnum.LEGAL_EXECUTION:
      return 'mdi:truck-delivery-outline'
    default:
      return 'mdi:help-circle-outline'
  }
}
