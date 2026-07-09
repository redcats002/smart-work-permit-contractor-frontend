import type { TBaseOption } from '@/models/Global.model'

export enum ContractStatusEnum {
  PENDING = 'PENDING',
  CANCELLED = 'CANCELLED',
  CLOSE_CONTRACT = 'CLOSE_CONTRACT',
  PENDING_REFINANCE = 'PENDING_REFINANCE'
}

export type TContractStatus = keyof typeof ContractStatusEnum

const titleMap: Record<TContractStatus, string> = {
  [ContractStatusEnum.PENDING]: 'ใช้งานอยู่',
  [ContractStatusEnum.CANCELLED]: 'ยกเลิก',
  [ContractStatusEnum.CLOSE_CONTRACT]: 'ปิดสัญญา',
  [ContractStatusEnum.PENDING_REFINANCE]: 'รีไฟแนนซ์ รอดำเนินการ'
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
    case ContractStatusEnum.CLOSE_CONTRACT:
      return 'bg-green-brand-light text-green-brand border-none'
    case ContractStatusEnum.CANCELLED:
      return 'bg-red-100 text-red-500 border-none'
    case ContractStatusEnum.PENDING_REFINANCE:
      return 'bg-yellow-100 text-yellow-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TContractStatus): string {
  switch (value) {
    case ContractStatusEnum.PENDING:
      return 'streamline:graph-arrow-increase'
    case ContractStatusEnum.CLOSE_CONTRACT:
      return 'mdi:check-circle-outline'
    case ContractStatusEnum.CANCELLED:
      return 'material-symbols:close-rounded'
    case ContractStatusEnum.PENDING_REFINANCE:
      return 'mingcute:time-duration-line'
    default:
      return 'mdi:help-circle-outline'
  }
}
