import type { TBaseOption } from '@/models/Global.model'

export enum EstateAssessmentStatusEnum {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  IN_ASSESSMENT = 'IN_ASSESSMENT',
  DONE = 'DONE',
  WAIT_CONTRACT = 'WAIT_CONTRACT'
}

export type TEstateAssessmentStatus = keyof typeof EstateAssessmentStatusEnum

const titleMap: Record<TEstateAssessmentStatus, string> = {
  [EstateAssessmentStatusEnum.DRAFT]: 'ร่าง',
  [EstateAssessmentStatusEnum.PENDING]: 'รอประเมิน',
  [EstateAssessmentStatusEnum.IN_ASSESSMENT]: 'กำลังประเมิน',
  [EstateAssessmentStatusEnum.DONE]: 'ผลการประเมิน',
  [EstateAssessmentStatusEnum.WAIT_CONTRACT]: 'รอทำสัญญา'
}

export const EstateAssessmentStatusItems: TBaseOption[] = Object.values(EstateAssessmentStatusEnum).map(
  (e: TEstateAssessmentStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TEstateAssessmentStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TEstateAssessmentStatus): string {
  switch (value) {
    case EstateAssessmentStatusEnum.DRAFT:
      return 'bg-green-brand-light text-green-brand border-none'
    case EstateAssessmentStatusEnum.PENDING:
      return 'bg-amber-100 text-amber-600 border-none'
    case EstateAssessmentStatusEnum.IN_ASSESSMENT:
      return 'bg-orange-100 text-orange-600 border-none'
    case EstateAssessmentStatusEnum.DONE:
      return 'bg-green-100 text-green-700 border-none'
    case EstateAssessmentStatusEnum.WAIT_CONTRACT:
      return 'bg-blue-100 text-blue-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TEstateAssessmentStatus): string {
  switch (value) {
    case EstateAssessmentStatusEnum.DRAFT:
      return 'mdi:check-circle-outline'
    case EstateAssessmentStatusEnum.PENDING:
      return 'mingcute:time-duration-line'
    case EstateAssessmentStatusEnum.IN_ASSESSMENT:
      return 'mingcute:time-duration-line'
    case EstateAssessmentStatusEnum.DONE:
      return 'mdi:check-circle-outline'
    case EstateAssessmentStatusEnum.WAIT_CONTRACT:
      return 'mingcute:time-duration-line'
    default:
      return 'mdi:help-circle-outline'
  }
}
