import type { TBaseOption } from '@/models/Global.model'

export enum ContractStatusEnum {
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  SUCCESS = 'SUCCESS'
}

export type TContractStatus = keyof typeof ContractStatusEnum

const titleMap: Record<TContractStatus, string> = {
  [ContractStatusEnum.CANCELLED]: 'ยกเลิก',
  [ContractStatusEnum.SUCCESS]: 'ปิดสัญญา',
  [ContractStatusEnum.IN_PROGRESS]: 'ใช้งานอยู่',
  [ContractStatusEnum.PENDING]: 'รออนุมัติ'
}

export const ContractStatusItems: TBaseOption[] = Object.values(ContractStatusEnum).map(
  (e: TContractStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TContractStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TContractStatus): string {
  switch (value) {
    case ContractStatusEnum.IN_PROGRESS:
      return 'bg-blue-100 text-blue-600 border-none'
    case ContractStatusEnum.CANCELLED:
      return 'bg-gray-100 text-gray-600 border-none'
    case ContractStatusEnum.PENDING:
      return 'bg-yellow-100 text-yellow-600 border-none'
    case ContractStatusEnum.SUCCESS:
      return 'bg-green-brand-light text-green-brand border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TContractStatus): string {
  switch (value) {
    case ContractStatusEnum.IN_PROGRESS:
      return 'streamline:graph-arrow-increase'
    case ContractStatusEnum.CANCELLED:
      return 'material-symbols:close-rounded'
    case ContractStatusEnum.PENDING:
      return 'mingcute:time-duration-line'
    case ContractStatusEnum.SUCCESS:
      return 'mdi:check-circle-outline'
    default:
      return 'mdi:help-circle-outline'
  }
}
