import type { TBaseOption } from '@/models/Global.model'

export enum StockDocsStatusEnum {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS'
}

export type TStockDocsStatus = keyof typeof StockDocsStatusEnum

const titleMap: Record <TStockDocsStatus, string> = {
  [StockDocsStatusEnum.PENDING]: 'รอรับ',
  [StockDocsStatusEnum.SUCCESS]: 'สำเร็จ'
}

export const StockStatusItems: TBaseOption[] = Object.values(StockDocsStatusEnum).map(
  (e: TStockDocsStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TStockDocsStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TStockDocsStatus): string {
  switch (value) {
    case StockDocsStatusEnum.SUCCESS:
      return 'bg-green-brand-light text-green-brand border-none'
    case StockDocsStatusEnum.PENDING:
      return 'bg-yellow-100 text-yellow-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TStockDocsStatus): string {
  switch (value) {
    case StockDocsStatusEnum.SUCCESS:
      return 'icon-park-outline:check-one'
    case StockDocsStatusEnum.PENDING:
      return 'mingcute:time-duration-line'
    default:
      return 'mdi:help-circle-outline'
  }
}
