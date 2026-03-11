import type { TBaseOption } from '@/models/Global.model'

export enum CollateralAssessmentStatusEnum {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  IN_ASSESSMENT = 'IN_ASSESSMENT',
  DONE = 'DONE',
  WAIT_CONTRACT = 'WAIT_CONTRACT'
}

export type TCollateralAssessmentStatus = keyof typeof CollateralAssessmentStatusEnum

const titleMap: Record<TCollateralAssessmentStatus, string> = {
  [CollateralAssessmentStatusEnum.DRAFT]: 'ร่าง',
  [CollateralAssessmentStatusEnum.PENDING]: 'รอประเมิน',
  [CollateralAssessmentStatusEnum.IN_ASSESSMENT]: 'กำลังประเมิน',
  [CollateralAssessmentStatusEnum.DONE]: 'ผลการประเมิน',
  [CollateralAssessmentStatusEnum.WAIT_CONTRACT]: 'รอทำสัญญา'
}

export const CollateralAssessmentStatusItems: TBaseOption[] = Object.values(CollateralAssessmentStatusEnum).map(
  (e: TCollateralAssessmentStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TCollateralAssessmentStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TCollateralAssessmentStatus): string {
  switch (value) {
    case CollateralAssessmentStatusEnum.DRAFT:
      return 'bg-green-brand-light text-green-brand border-none'
    case CollateralAssessmentStatusEnum.PENDING:
      return 'bg-amber-100 text-amber-600 border-none'
    case CollateralAssessmentStatusEnum.IN_ASSESSMENT:
      return 'bg-orange-100 text-orange-600 border-none'
    case CollateralAssessmentStatusEnum.DONE:
      return 'bg-green-100 text-green-700 border-none'
    case CollateralAssessmentStatusEnum.WAIT_CONTRACT:
      return 'bg-blue-100 text-blue-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TCollateralAssessmentStatus): string {
  switch (value) {
    case CollateralAssessmentStatusEnum.DRAFT:
      return 'mdi:check-circle-outline'
    case CollateralAssessmentStatusEnum.PENDING:
      return 'mingcute:time-duration-line'
    case CollateralAssessmentStatusEnum.IN_ASSESSMENT:
      return 'mingcute:time-duration-line'
    case CollateralAssessmentStatusEnum.DONE:
      return 'mdi:check-circle-outline'
    case CollateralAssessmentStatusEnum.WAIT_CONTRACT:
      return 'mingcute:time-duration-line'
    default:
      return 'mdi:help-circle-outline'
  }
}
