import type { TBaseOption } from '@/models/Global.model'

export enum CustomerStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export type TCustomerStatus = keyof typeof CustomerStatusEnum

const titleMap: Record <TCustomerStatus, string> = {
  [CustomerStatusEnum.ACTIVE]: 'ใช้งาน',
  [CustomerStatusEnum.INACTIVE]: 'ปิดใช้งาน'
}

export const CustomerStatusItems: TBaseOption[] = Object.values(CustomerStatusEnum).map(
  (e: TCustomerStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TCustomerStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TCustomerStatus): string {
  switch (value) {
    case CustomerStatusEnum.ACTIVE:
      return 'bg-green-brand-light text-green-brand border-none'
    case CustomerStatusEnum.INACTIVE:
      return 'bg-gray-100 text-gray-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TCustomerStatus): string {
  switch (value) {
    case CustomerStatusEnum.ACTIVE:
      return 'icon-park-outline:check-one'
    case CustomerStatusEnum.INACTIVE:
      return 'material-symbols:close-rounded'
    default:
      return 'mdi:help-circle-outline'
  }
}
