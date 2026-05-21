import type { TBaseOption } from '@/models/Global.model'

export enum FinancialSummaryTypeEnum {
  SUMMARY = 'SUMMARY',
  INCOME = 'INCOME',
  PRINCIPAL = 'PRINCIPAL',
  EXPENSES = 'EXPENSES'
}

export type TFinancialSummaryType = keyof typeof FinancialSummaryTypeEnum

const titleMap: Record<TFinancialSummaryType, string> = {
  [FinancialSummaryTypeEnum.SUMMARY]: 'สรุปรวม',
  [FinancialSummaryTypeEnum.INCOME]: 'รายรับ',
  [FinancialSummaryTypeEnum.PRINCIPAL]: 'ปล่อยสินเชื่อ',
  [FinancialSummaryTypeEnum.EXPENSES]: 'รายจ่าย'
}

export const FinancialSummaryTypeItems: TBaseOption[] = Object.values(FinancialSummaryTypeEnum).map(
  (e: TFinancialSummaryType): TBaseOption => ({
    label: titleMap[e],
    value: e
  })
)

export function formatFinancialSummaryType (type?: TFinancialSummaryType): string {
  if (!type) return ''
  return titleMap[type] || ''
}
