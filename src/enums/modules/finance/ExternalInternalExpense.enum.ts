import type { TBaseOption } from '@/models/Global.model'

export enum ExternalInternalExpenseEnum {
  '' = '',
  'EXTERNAL' = 'EXTERNAL',
  'INTERNAL' = 'INTERNAL'
}

export type TExternalInternalExpense = keyof typeof ExternalInternalExpenseEnum

const titleMap: Record<TExternalInternalExpense, string> = {
  '': '',
  [ExternalInternalExpenseEnum.EXTERNAL]: 'ภายนอก',
  [ExternalInternalExpenseEnum.INTERNAL]: 'ภายใน'
}

export const ExternalInternalExpenseItems: TBaseOption[] = Object.values(ExternalInternalExpenseEnum).filter(Boolean).map(
  (e: TExternalInternalExpense): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TExternalInternalExpense): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
