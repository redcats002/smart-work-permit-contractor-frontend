import type { TBaseOption } from '@/models/Global.model'

export enum ExpensesTypeEnum {
  '' = '',
  'GENERAL_INCOME' = 'GENERAL_INCOME',
  'EXTERNAL_EXPENSE' = 'EXTERNAL_EXPENSE',
  'INTERNAL_EXPENSE' = 'INTERNAL_EXPENSE',
  'CAPITAL_INCREASE' = 'CAPITAL_INCREASE',
  'CAPITAL_REFUND' = 'CAPITAL_REFUND',
  'FUND_IN' = 'FUND_IN',
  'FUND_OUT' = 'FUND_OUT',
  // Not show in ui
  'CAPITAL_PAYMENT' = 'CAPITAL_PAYMENT', // ชำระทุน
  'CAPITAL_RECEIVE' = 'CAPITAL_RECEIVE' // รับทุน
}

// {
//   GENERAL_INCOME // รายรับทั่วไป
//   EXTERNAL_EXPENSE // รายจ่ายภายนอก
//   INTERNAL_EXPENSE // รายจ่ายภายใน
//   CAPITAL_INCREASE // เพิ่มทุน
//   CAPITAL_REFUND // คืนทุน
//   CAPITAL_PAYMENT // ชำระทุน
//   CAPITAL_RECEIVE // รับทุน
//   FUND_IN // รับทุน (ศูนย์การเงิน)
//   FUND_OUT // จ่ายทุน (ศูนย์การเงิน)
// }
export type TExpensesType = keyof typeof ExpensesTypeEnum

const titleMap: Record<TExpensesType, string> = {
  '': '',
  [ExpensesTypeEnum.GENERAL_INCOME]: 'รายรับทั่วไป',
  [ExpensesTypeEnum.CAPITAL_INCREASE]: 'เพิ่มทุน',
  [ExpensesTypeEnum.EXTERNAL_EXPENSE]: 'รายจ่ายภายนอก',
  [ExpensesTypeEnum.INTERNAL_EXPENSE]: 'รายจ่ายภายใน',
  [ExpensesTypeEnum.CAPITAL_REFUND]: 'คืนทุน',
  [ExpensesTypeEnum.FUND_IN]: 'รับทุน (ศูนย์การเงิน)',
  [ExpensesTypeEnum.FUND_OUT]: 'จ่ายทุน (ศูนย์การเงิน)',
  // Not show in ui
  [ExpensesTypeEnum.CAPITAL_PAYMENT]: 'ชำระทุน',
  [ExpensesTypeEnum.CAPITAL_RECEIVE]: 'รับทุน'
}

export const ExpenseTypeItems: TBaseOption[] = Object.values(ExpensesTypeEnum)
  .filter(Boolean)
  .filter((e: ExpensesTypeEnum): boolean => e !== ExpensesTypeEnum.CAPITAL_PAYMENT && e !== ExpensesTypeEnum.CAPITAL_RECEIVE)
  .map(
    (e: TExpensesType): TBaseOption => ({
      label: formatTitle(e),
      value: e
    })
  )

export const ExpensesTypePaymentItems: TBaseOption[] = ExpenseTypeItems.filter(
  (item: TBaseOption) =>
    isPaymentExpense(item.value as TExpensesType)
)

export const ExpensesTypeCapitalItems: TBaseOption[] = ExpenseTypeItems.filter(
  (item: TBaseOption) =>
    isCapitalExpense(item.value as TExpensesType)
)

export function isCapitalExpense (type?: TExpensesType): boolean {
  return (
    type === ExpensesTypeEnum.CAPITAL_INCREASE
    || type === ExpensesTypeEnum.CAPITAL_REFUND
    || type === ExpensesTypeEnum.FUND_IN
    || type === ExpensesTypeEnum.FUND_OUT
  )
}

export function isPaymentExpense (type?: TExpensesType): boolean {
  return (
    type === ExpensesTypeEnum.EXTERNAL_EXPENSE
    || type === ExpensesTypeEnum.INTERNAL_EXPENSE
    || type === ExpensesTypeEnum.GENERAL_INCOME
  )
}

export function formatTitle (status?: TExpensesType): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
