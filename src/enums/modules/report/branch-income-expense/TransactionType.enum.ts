import type { TBaseOption } from '@/models/Global.model'

export enum TransactionTypeEnum {
  INCOME_EXPENSE = 'INCOME_EXPENSE',
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  INCREASE_REPAYMENT = 'INCREASE_REPAYMENT',
  INCREASE = 'INCREASE',
  REPAYMENT = 'REPAYMENT'
}

export type TTransactionType = keyof typeof TransactionTypeEnum

const titleMap: Record<TTransactionType, string> = {
  [TransactionTypeEnum.INCOME_EXPENSE]: 'รับ-จ่าย',
  [TransactionTypeEnum.INCOME]: 'จ่าย',
  [TransactionTypeEnum.EXPENSE]: 'รับ',
  [TransactionTypeEnum.INCREASE_REPAYMENT]: 'เพิ่มทุน-ชำระทุน',
  [TransactionTypeEnum.INCREASE]: 'เพิ่มทุน',
  [TransactionTypeEnum.REPAYMENT]: 'ชำระทุน'
}

export const TransactionTypeItems: TBaseOption[] = Object.values(TransactionTypeEnum).filter(Boolean).map(
  (e: TTransactionType): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TTransactionType): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
