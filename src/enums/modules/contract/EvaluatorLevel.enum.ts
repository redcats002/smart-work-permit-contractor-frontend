import type { TBaseOption } from '@/models/Global.model'

export enum EvaluatorLevelEnum {
  GENERIC_LEVEL = 'GENERIC_LEVEL',
  DISTRICT_LEVEL = 'DISTRICT_LEVEL',
  CEO_LEVEL = 'CEO_LEVEL'
}

export type TEvaluatorLevel = keyof typeof EvaluatorLevelEnum

const titleMap: Record<TEvaluatorLevel, string> = {
  [EvaluatorLevelEnum.GENERIC_LEVEL]: 'ทั่วไป',
  [EvaluatorLevelEnum.DISTRICT_LEVEL]: 'ระดับเขต',
  [EvaluatorLevelEnum.CEO_LEVEL]: 'CEO'
}

export const EvaluatorLevelItems: TBaseOption[] = Object.values(EvaluatorLevelEnum).map(
  (e: TEvaluatorLevel): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TEvaluatorLevel): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
