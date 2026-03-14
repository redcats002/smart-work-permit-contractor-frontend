import type { TBaseOption } from '@/models/Global.model'

export enum InterestTypeEnum {
  GENERIC_LEVEL = 'GENERIC_LEVEL',
  DISTRICT_LEVEL = 'DISTRICT_LEVEL',
  CEO_LEVEL = 'CEO_LEVEL'
}
export type TInterestType = keyof typeof InterestTypeEnum

const titleMap: Record<TInterestType, string> = {
  [InterestTypeEnum.GENERIC_LEVEL]: 'ทั่วไป',
  [InterestTypeEnum.DISTRICT_LEVEL]: 'ระดับเขต',
  [InterestTypeEnum.CEO_LEVEL]: 'CEO'
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
