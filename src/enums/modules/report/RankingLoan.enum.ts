import type { TBaseOption } from '@/models/Global.model'

export enum RankingLoanTypeEnum {
  '' = '',
  'RECEIPT_AMOUNT' = 'RECEIPT_AMOUNT',
  'PERCENTAGE' = 'PERCENTAGE'
}

export type TRankingLoanType = keyof typeof RankingLoanTypeEnum

const titleMap: Record<TRankingLoanType, string> = {
  '': '',
  [RankingLoanTypeEnum.RECEIPT_AMOUNT]: 'เรียงตามยอดรับ',
  [RankingLoanTypeEnum.PERCENTAGE]: 'เรียงตามเปอร์เซ็นต์'
}

export const RankingLoanTypeItems: TBaseOption[] = Object.values(RankingLoanTypeEnum).filter(Boolean).map(
  (e: TRankingLoanType): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TRankingLoanType): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
