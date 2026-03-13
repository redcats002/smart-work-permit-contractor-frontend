import type { TBaseOption } from '@/models/Global.model'

export enum ExpensesTypeEnum {
  '' = '',
  'PAY' = 'PAY',
  'RECEIVE' = 'RECEIVE'
}

export type TExpensesType = keyof typeof ExpensesTypeEnum

const titleMap: Record<TExpensesType, string> = {
  '': '',
  [ExpensesTypeEnum.PAY]: 'จ่าย',
  [ExpensesTypeEnum.RECEIVE]: 'รับ'
}

export const ExpensePayItems: TBaseOption[] = Object.values(ExpensesTypeEnum).filter(Boolean).map(
  (e: TExpensesType): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TExpensesType): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
