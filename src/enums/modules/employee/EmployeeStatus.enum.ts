import type { TBaseOption } from '@/models/Global.model'

export enum EmployeeStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export type TEmployeeStatus = keyof typeof EmployeeStatusEnum

const titleMap: Record <TEmployeeStatus, string> = {
  [EmployeeStatusEnum.ACTIVE]: 'ใช้งาน',
  [EmployeeStatusEnum.INACTIVE]: 'ปิดใช้งาน'
}

export const EmployeeStatusItems: TBaseOption[] = Object.values(EmployeeStatusEnum).map(
  (e: TEmployeeStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TEmployeeStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TEmployeeStatus): string {
  switch (value) {
    case EmployeeStatusEnum.ACTIVE:
      return 'bg-green-brand-light text-green-brand border-none'
    case EmployeeStatusEnum.INACTIVE:
      return 'bg-gray-100 text-gray-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TEmployeeStatus): string {
  switch (value) {
    case EmployeeStatusEnum.ACTIVE:
      return 'icon-park-outline:check-one'
    case EmployeeStatusEnum.INACTIVE:
      return 'material-symbols:close-rounded'
    default:
      return 'mdi:help-circle-outline'
  }
}
