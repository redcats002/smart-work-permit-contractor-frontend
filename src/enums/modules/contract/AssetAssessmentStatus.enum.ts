import type { TBaseOption } from '@/models/Global.model'

export enum AssetAssessmentStatusEnum {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  IN_ASSESSMENT = 'IN_ASSESSMENT',
  DONE = 'DONE',
  WAIT_CONTRACT = 'WAIT_CONTRACT'
}

export type TAssetAssessmentStatus = keyof typeof AssetAssessmentStatusEnum

const titleMap: Record<TAssetAssessmentStatus, string> = {
  [AssetAssessmentStatusEnum.DRAFT]: 'ร่าง',
  [AssetAssessmentStatusEnum.PENDING]: 'รอประเมิน',
  [AssetAssessmentStatusEnum.IN_ASSESSMENT]: 'กำลังประเมิน',
  [AssetAssessmentStatusEnum.DONE]: 'ผลการประเมิน',
  [AssetAssessmentStatusEnum.WAIT_CONTRACT]: 'รอทำสัญญา'
}

export const AssetAssessmentStatusItems: TBaseOption[] = Object.values(AssetAssessmentStatusEnum).map(
  (e: TAssetAssessmentStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TAssetAssessmentStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TAssetAssessmentStatus): string {
  switch (value) {
    case AssetAssessmentStatusEnum.DRAFT:
      return 'bg-green-brand-light text-green-brand border-none'
    case AssetAssessmentStatusEnum.PENDING:
      return 'bg-amber-100 text-amber-600 border-none'
    case AssetAssessmentStatusEnum.IN_ASSESSMENT:
      return 'bg-orange-100 text-orange-600 border-none'
    case AssetAssessmentStatusEnum.DONE:
      return 'bg-green-100 text-green-700 border-none'
    case AssetAssessmentStatusEnum.WAIT_CONTRACT:
      return 'bg-blue-100 text-blue-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TAssetAssessmentStatus): string {
  switch (value) {
    case AssetAssessmentStatusEnum.DRAFT:
      return 'mdi:check-circle-outline'
    case AssetAssessmentStatusEnum.PENDING:
      return 'mingcute:time-duration-line'
    case AssetAssessmentStatusEnum.IN_ASSESSMENT:
      return 'mingcute:time-duration-line'
    case AssetAssessmentStatusEnum.DONE:
      return 'mdi:check-circle-outline'
    case AssetAssessmentStatusEnum.WAIT_CONTRACT:
      return 'mingcute:time-duration-line'
    default:
      return 'mdi:help-circle-outline'
  }
}
