import type { TBaseOption } from '@/models/Global.model'

export enum PersonalTypeEnum {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATE = 'CORPORATE'
}

export type TPersonalType = keyof typeof PersonalTypeEnum

const titleMap: Record<TPersonalType, string> = {
  [PersonalTypeEnum.INDIVIDUAL]: 'บุคคลธรรมดา',
  [PersonalTypeEnum.CORPORATE]: 'นิติบุคคล'
}

export const PersonalTypeItems: TBaseOption[] = Object.values(PersonalTypeEnum).map(
  (e: TPersonalType): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (value?: TPersonalType): string {
  if (!value) return 'ไม่ระบุ'
  return titleMap[value] || 'ไม่พบประเภทบุคคล'
}
