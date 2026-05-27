import type { TBaseOption } from '@/models/Global.model'

export enum ExpensesTypeEnum {
  '' = '',
  'GENERAL_INCOME' = 'GENERAL_INCOME',
  'CAPITAL_INCREASE' = 'CAPITAL_INCREASE',
  'EXTERNAL_EXPENSES' = 'EXTERNAL_EXPENSES',
  'INTERNAL_EXPENSES' = 'INTERNAL_EXPENSES',
  'RETURN_ON_INVESTMENT' = 'RETURN_ON_INVESTMENT',
  'RECEIVE_A_GRANT' = 'RECEIVE_A_GRANT',
  'FUNDING' = 'FUNDING'
}

export type TExpensesType = keyof typeof ExpensesTypeEnum

const titleMap: Record<TExpensesType, string> = {
  '': '',
  [ExpensesTypeEnum.GENERAL_INCOME]: 'รายรับทั่วไป',
  [ExpensesTypeEnum.CAPITAL_INCREASE]: 'เพิ่มทุน',
  [ExpensesTypeEnum.EXTERNAL_EXPENSES]: 'รายจ่ายภายนอก',
  [ExpensesTypeEnum.INTERNAL_EXPENSES]: 'รายจ่ายภายใน',
  [ExpensesTypeEnum.RETURN_ON_INVESTMENT]: 'คืนทุน',
  [ExpensesTypeEnum.RECEIVE_A_GRANT]: 'รับทุน (ศูนย์การเงิน)',
  [ExpensesTypeEnum.FUNDING]: 'จ่ายทุน (ศูนย์การเงิน)'
}

export const ExpenseTypeItems: TBaseOption[] = Object.values(ExpensesTypeEnum)
  .filter(Boolean)
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
    || type === ExpensesTypeEnum.RETURN_ON_INVESTMENT
    || type === ExpensesTypeEnum.RECEIVE_A_GRANT
    || type === ExpensesTypeEnum.FUNDING
  )
}

export function isPaymentExpense (type?: TExpensesType): boolean {
  return (
    type === ExpensesTypeEnum.EXTERNAL_EXPENSES
    || type === ExpensesTypeEnum.INTERNAL_EXPENSES
    || type === ExpensesTypeEnum.GENERAL_INCOME
  )
}

export function formatTitle (status?: TExpensesType): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
