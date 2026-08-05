import type { TBaseOption } from '@/models/Global.model'

export enum InstallmentStatusEnum {
  OVERDUE = 'OVERDUE',
  NOT_DUE_YET = 'NOT_DUE_YET',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  DUE_DATE = 'DUE_DATE'
}

export type TInstallmentStatus = keyof typeof InstallmentStatusEnum

const titleMap: Record<TInstallmentStatus, string> = {
  [InstallmentStatusEnum.OVERDUE]: 'เกินกำหนด',
  [InstallmentStatusEnum.NOT_DUE_YET]: 'ยังไม่ถึงกำหนด',
  [InstallmentStatusEnum.PARTIAL]: 'ชำระบางส่วน',
  [InstallmentStatusEnum.PAID]: 'ชำระแล้ว',
  [InstallmentStatusEnum.DUE_DATE]: 'ถึงกำหนดชำระ'
}

export const InstallmentStatusItems: TBaseOption[] = Object.values(InstallmentStatusEnum).map(
  (e: TInstallmentStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TInstallmentStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TInstallmentStatus): string {
  switch (value) {
    case InstallmentStatusEnum.OVERDUE:
      return 'bg-red-100 text-red-600 border-none'
    case InstallmentStatusEnum.PARTIAL:
      return 'bg-blue-100 text-blue-600 border-none'
    case InstallmentStatusEnum.NOT_DUE_YET:
      return 'bg-amber-100 text-amber-600 border-none'
    case InstallmentStatusEnum.PAID:
      return 'bg-green-100 text-green-700 border-none'
    case InstallmentStatusEnum.DUE_DATE:
      return 'bg-orange-100 text-orange-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TInstallmentStatus): string {
  switch (value) {
    case InstallmentStatusEnum.OVERDUE:
      return 'quill:warning'
    case InstallmentStatusEnum.PARTIAL:
      return 'streamline:graph-arrow-increase'
    case InstallmentStatusEnum.NOT_DUE_YET:
      return 'mingcute:time-duration-line'
    case InstallmentStatusEnum.PAID:
      return 'mdi:check-circle-outline'
    case InstallmentStatusEnum.DUE_DATE:
      return 'proicons:calendar'
    default:
      return 'mdi:help-circle-outline'
  }
}
