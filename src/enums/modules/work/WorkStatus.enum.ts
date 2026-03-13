import type { TBaseOption } from '@/models/Global.model'

export const WorkStatusEnum = {
  IN_PROGRESS: 'IN_PROGRESS',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
  SUCCESS: 'SUCCESS'
} as const

export type TWorkStatus = keyof typeof WorkStatusEnum

const titleMap: Record<TWorkStatus, string> = {
  [WorkStatusEnum.SUCCESS]: 'สำเร็จ',
  [WorkStatusEnum.PENDING]: 'รอประเมิน',
  [WorkStatusEnum.IN_PROGRESS]: 'กำลังประเมิน',
  [WorkStatusEnum.CANCELLED]: 'ยกเลิก'
}

export const WorkStatusItems: TBaseOption[] = Object.values(WorkStatusEnum).map(
  (e: TWorkStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TWorkStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TWorkStatus): string {
  switch (value) {
    case WorkStatusEnum.PENDING:
      return 'bg-purple-100 text-purple-600 border-none'
    case WorkStatusEnum.IN_PROGRESS:
      return 'bg-orange-100 text-orange-600 border-none'
    case WorkStatusEnum.SUCCESS:
      return 'bg-green-100 text-green-700 border-none'
    case WorkStatusEnum.CANCELLED:
      return 'bg-red-100 text-red-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TWorkStatus): string {
  switch (value) {
    case WorkStatusEnum.PENDING:
      return 'mdi:file-find-outline'
    case WorkStatusEnum.IN_PROGRESS:
      return 'mdi:account-clock-outline'
    case WorkStatusEnum.SUCCESS:
      return 'mdi:check-circle-outline'
    case WorkStatusEnum.CANCELLED:
      return 'material-symbols:close-rounded'
    default:
      return 'mdi:help-circle-outline'
  }
}
