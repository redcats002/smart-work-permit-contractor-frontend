import type { TBaseOption } from '@/models/Global.model'

export enum ContractStatusEnum {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  SUCCESS = 'SUCCESS'
}

export type TContractStatus = keyof typeof ContractStatusEnum

const titleMap: Record<TContractStatus, string> = {
  [ContractStatusEnum.PENDING]: 'ใช้งานอยู่',
  [ContractStatusEnum.CANCELLED]: 'ยกเลิก',
  [ContractStatusEnum.SUCCESS]: 'ปิดสัญญา'
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
    case ContractStatusEnum.PENDING:
      return 'bg-blue-50 text-blue-600 border-none'
    case ContractStatusEnum.SUCCESS:
      return 'bg-green-brand-light text-green-brand border-none'
    case ContractStatusEnum.CANCELLED:
      return 'bg-red-100 text-red-500 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TContractStatus): string {
  switch (value) {
    case ContractStatusEnum.PENDING:
      return 'streamline:graph-arrow-increase'
    case ContractStatusEnum.SUCCESS:
      return 'mdi:check-circle-outline'
    case ContractStatusEnum.CANCELLED:
      return 'material-symbols:close-rounded'
    default:
      return 'mdi:help-circle-outline'
  }
}
