import type { TBaseOption } from '@/models/Global.model'

export enum FinanceCategoryEnum {
  OVERALL = 'OVERALL',
  INTERNAL = 'INTERNAL',
  RECEIPT_RETURN = 'RECEIPT_RETURN',
  INCREASE_REPAYMENT = 'INCREASE_REPAYMENT',
  INCREASE_DISBURSEMENT = 'INCREASE_DISBURSEMENT'
}

export type TFinanceCategory = keyof typeof FinanceCategoryEnum

const titleMap: Record<TFinanceCategory, string> = {
  [FinanceCategoryEnum.OVERALL]: 'สรุปรวม',
  [FinanceCategoryEnum.INTERNAL]: 'ภายใน',
  [FinanceCategoryEnum.RECEIPT_RETURN]: 'รับทุน-คืนทุน',
  [FinanceCategoryEnum.INCREASE_REPAYMENT]: 'เพิ่มทุน-ชำระทุน',
  [FinanceCategoryEnum.INCREASE_DISBURSEMENT]: 'รับทุน-จ่ายทุน (ศูนย์การเงิน)'
}

export const FinanceCategoryItems: TBaseOption[] = Object.values(FinanceCategoryEnum).filter(Boolean).map(
  (e: TFinanceCategory): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TFinanceCategory): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
