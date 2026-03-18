import type { TBaseOption } from '@/models/Global.model'

export enum PreContractStatusEnum {
  DRAFT = 'DRAFT',
  PENDING_EVALUATION = 'PENDING_EVALUATION',
  UNDER_EVALUATION = 'UNDER_EVALUATION',
  PENDING_MORTGAGE = 'PENDING_MORTGAGE',
  PENDING_CONTRACT = 'PENDING_CONTRACT',
  DONE = 'DONE'
}

export type TPreContractStatus = keyof typeof PreContractStatusEnum

const titleMap: Record<TPreContractStatus, string> = {
  [PreContractStatusEnum.DRAFT]: 'ร่าง',
  [PreContractStatusEnum.PENDING_EVALUATION]: 'รอประเมิน',
  [PreContractStatusEnum.UNDER_EVALUATION]: 'กำลังประเมิน',
  [PreContractStatusEnum.PENDING_MORTGAGE]: 'รอจำนอง',
  [PreContractStatusEnum.PENDING_CONTRACT]: 'รอทำสัญญา',
  [PreContractStatusEnum.DONE]: 'ผลการประเมิน'
}

export const PreContractStatusItems: TBaseOption[] = Object.values(PreContractStatusEnum).map(
  (e: TPreContractStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TPreContractStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TPreContractStatus): string {
  switch (value) {
    case PreContractStatusEnum.DRAFT:
      return 'bg-gray-100 text-font-gray border-none'
    case PreContractStatusEnum.PENDING_EVALUATION:
      return 'bg-purple-100 text-purple-600 border-none'
    case PreContractStatusEnum.UNDER_EVALUATION:
      return 'bg-orange-100 text-orange-600 border-none'
    case PreContractStatusEnum.PENDING_CONTRACT:
      return 'bg-[#AE6317] text-[#FFFBF7] border-none'
    case PreContractStatusEnum.PENDING_MORTGAGE:
      return 'bg-amber-100 text-amber-600 border-none'
    case PreContractStatusEnum.DONE:
      return 'bg-green-100 text-green-700 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TPreContractStatus): string {
  switch (value) {
    case PreContractStatusEnum.DRAFT:
      return 'fluent:drafts-24-regular'
    case PreContractStatusEnum.PENDING_EVALUATION:
      return 'mdi:file-find-outline'
    case PreContractStatusEnum.UNDER_EVALUATION:
      return 'mdi:account-clock-outline'
    case PreContractStatusEnum.PENDING_CONTRACT:
      return 'mdi:account-clock-outline'
    case PreContractStatusEnum.PENDING_MORTGAGE:
      return 'mingcute:time-duration-line'
    case PreContractStatusEnum.DONE:
      return 'mdi:check-circle-outline'
    default:
      return 'mdi:help-circle-outline'
  }
}
