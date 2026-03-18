import type { TBaseOption } from '@/models/Global.model'

export enum StockStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  LEGAL_PROCEEDING = 'LEGAL_PROCEEDING',
  RETURNED = 'RETURNED'
}

export type TStockStatus = keyof typeof StockStatusEnum

const titleMap: Record <TStockStatus, string> = {
  [StockStatusEnum.ACTIVE]: 'ใช้งานอยู่',
  [StockStatusEnum.INACTIVE]: 'ปิดใช้งาน',
  [StockStatusEnum.LEGAL_PROCEEDING]: 'บังคับคดี',
  [StockStatusEnum.RETURNED]: 'คืนลูกค้า'
}

export const StockStatusItems: TBaseOption[] = Object.values(StockStatusEnum).map(
  (e: TStockStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TStockStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TStockStatus): string {
  switch (value) {
    case StockStatusEnum.ACTIVE:
      return 'bg-blue-brand-light text-blue-brand border-none'
    case StockStatusEnum.LEGAL_PROCEEDING:
      return 'bg-yellow-100 text-yellow-600 border-none'
    case StockStatusEnum.RETURNED:
      return 'bg-green-100 text-green-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TStockStatus): string {
  switch (value) {
    case StockStatusEnum.ACTIVE:
      return 'streamline:graph-arrow-increase'
    case StockStatusEnum.INACTIVE:
      return 'material-symbols:close-rounded'
    case StockStatusEnum.RETURNED:
      return 'icon-park-outline:check-one'
    case StockStatusEnum.LEGAL_PROCEEDING:
      return 'si:warning-line'
    default:
      return 'mdi:help-circle-outline'
  }
}
