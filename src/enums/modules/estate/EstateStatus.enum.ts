import type { TBaseOption } from '@/models/Global.model'

export enum EstateStatusEnum {
  ACTIVE = 'ACTIVE',
  PENDING_SALE = 'PENDING_SALE',
  DONE = 'DONE',

  RETURNED = 'RETURNED',
  NORMAL = 'NORMAL',
  SOLD = 'SOLD',
  PENDING_TO_SELL = 'PENDING_TO_SELL',
  PENDING_TO_AUCTION = 'PENDING_TO_AUCTION'
}

export type TEstateStatus = keyof typeof EstateStatusEnum

const titleMap: Record<TEstateStatus, string> = {
  [EstateStatusEnum.PENDING_TO_SELL]: 'รอขาย',
  [EstateStatusEnum.PENDING_SALE]: 'รอขาย',
  [EstateStatusEnum.PENDING_TO_AUCTION]: 'รอประมูล',
  [EstateStatusEnum.RETURNED]: 'คืนลูกค้า',
  [EstateStatusEnum.DONE]: 'คืนลูกค้า',
  [EstateStatusEnum.NORMAL]: 'ปกติ',
  [EstateStatusEnum.ACTIVE]: 'ปกติ',
  [EstateStatusEnum.SOLD]: 'ขายแล้ว'
}

export const EstateStatusItems: TBaseOption[] = Object.values(EstateStatusEnum).map(
  (e: TEstateStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TEstateStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TEstateStatus): string {
  switch (value) {
    case EstateStatusEnum.NORMAL:
      return 'bg-blue-100 text-blue-600 border-none'
    case EstateStatusEnum.ACTIVE:
      return 'bg-blue-100 text-blue-600 border-none'
    case EstateStatusEnum.SOLD:
      return 'bg-gray-100 text-gray-600 border-none'
    case EstateStatusEnum.PENDING_TO_SELL:
      return 'bg-yellow-100 text-yellow-600 border-none'
    case EstateStatusEnum.PENDING_SALE:
      return 'bg-yellow-100 text-yellow-600 border-none'
    case EstateStatusEnum.PENDING_TO_AUCTION:
      return 'bg-yellow-100 text-yellow-600 border-none'
    case EstateStatusEnum.RETURNED:
      return 'bg-green-brand-light text-green-brand border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TEstateStatus): string {
  switch (value) {
    case EstateStatusEnum.NORMAL:
      return 'streamline:graph-arrow-increase'
    case EstateStatusEnum.ACTIVE:
      return 'streamline:graph-arrow-increase'
    case EstateStatusEnum.SOLD:
      return 'mingcute:time-duration-line'
    case EstateStatusEnum.PENDING_TO_SELL:
      return 'mingcute:time-duration-line'
    case EstateStatusEnum.PENDING_SALE:
      return 'mingcute:time-duration-line'
    case EstateStatusEnum.PENDING_TO_AUCTION:
      return 'mingcute:time-duration-line'
    case EstateStatusEnum.RETURNED:
      return 'mdi:check-circle-outline'
    default:
      return 'mdi:help-circle-outline'
  }
}
