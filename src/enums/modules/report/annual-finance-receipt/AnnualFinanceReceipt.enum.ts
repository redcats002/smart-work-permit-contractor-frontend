import type { TBaseOption } from '@/models/Global.model'

export enum AnnualFinanceReceiptTypeEnum {
  ALL = 'ALL',
  PERCENTAGE = 'PERCENTAGE',
  AMOUNT = 'AMOUNT'
}

export type TAnnualFinanceReceiptType = keyof typeof AnnualFinanceReceiptTypeEnum

const titleMap: Record<TAnnualFinanceReceiptType, string> = {
  [AnnualFinanceReceiptTypeEnum.ALL]: 'แสดงยอด + เปอร์เซ็นต์',
  [AnnualFinanceReceiptTypeEnum.PERCENTAGE]: 'แสดงเปอร์เซ็นต์เท่านั้น',
  [AnnualFinanceReceiptTypeEnum.AMOUNT]: 'แสดงยอดเท่านั้น'
}

export const AnnualFinanceReceiptTypeItems: TBaseOption[] = Object.values(AnnualFinanceReceiptTypeEnum).filter(Boolean).map(
  (e: TAnnualFinanceReceiptType): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TAnnualFinanceReceiptType): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
