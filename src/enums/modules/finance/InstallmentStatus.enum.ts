import type { TBaseOption } from '@/models/Global.model'

export enum InstallmentStatusEnum {
  PAID = 'PAID', // ชำระแล้ว
  PARTIALLY_PAID = 'PARTIALLY_PAID', // ชำระบางส่วน
  OVERDUE = 'OVERDUE', // เกินกำหนด
  NOT_DUE = 'NOT_DUE' // ยังไม่ถึงกำหนด
}

export type TInstallmentStatus = keyof typeof InstallmentStatusEnum

const titleMap: Record<TInstallmentStatus, string> = {
  [InstallmentStatusEnum.PAID]: 'ชำระแล้ว',
  [InstallmentStatusEnum.PARTIALLY_PAID]: 'ชำระบางส่วน',
  [InstallmentStatusEnum.OVERDUE]: 'เกินกำหนด',
  [InstallmentStatusEnum.NOT_DUE]: 'ยังไม่ถึงกำหนด'
}

export const ContractStatusItems: TBaseOption[] = Object.values(InstallmentStatusEnum).map(
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
    case InstallmentStatusEnum.PAID:
      return 'bg-green-100 text-green-600 border-none'
    case InstallmentStatusEnum.PARTIALLY_PAID:
      return 'bg-blue-100 text-blue-600 border-none'
    case InstallmentStatusEnum.OVERDUE:
      return 'bg-primary-100 text-primary-600 border-none'
    case InstallmentStatusEnum.NOT_DUE:
      return 'bg-yellow-100 text-yellow-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TInstallmentStatus): string {
  switch (value) {
    case InstallmentStatusEnum.PAID:
      return 'icon-park-outline:check-one'
    case InstallmentStatusEnum.PARTIALLY_PAID:
      return 'streamline:graph-arrow-increase'
    case InstallmentStatusEnum.OVERDUE:
      return 'quill:warning'
    case InstallmentStatusEnum.NOT_DUE:
      return 'mingcute:time-duration-line'
    default:
      return 'mdi:help-circle-outline'
  }
}
