import type { TBaseOption } from '@/models/Global.model'

export enum InterestTypeEnum {
  FLAT_RATE = 'FLAT_RATE',
  EFFECTIVE_RATE = 'EFFECTIVE_RATE'
}
export type TInterestType = keyof typeof InterestTypeEnum

const titleMap: Record<TInterestType, string> = {
  [InterestTypeEnum.FLAT_RATE]: 'คงที่',
  [InterestTypeEnum.EFFECTIVE_RATE]: 'ลดต้นลดดอก'
}

export const InterestTypeItems: TBaseOption[] = Object.values(InterestTypeEnum).map(
  (e: TInterestType): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TInterestType): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
