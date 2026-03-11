import type { TBaseOption } from '@/models/Global.model'

export enum LocationStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export type TLocationStatus = keyof typeof LocationStatusEnum

const titleMap: Record <TLocationStatus, string> = {
  [LocationStatusEnum.ACTIVE]: 'ใช้งาน',
  [LocationStatusEnum.INACTIVE]: 'ปิดใช้งาน'
}

export const LocationStatusItems: TBaseOption[] = Object.values(LocationStatusEnum).map(
  (e: TLocationStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TLocationStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TLocationStatus): string {
  switch (value) {
    case LocationStatusEnum.ACTIVE:
      return 'bg-green-brand-light text-green-brand border-none'
    case LocationStatusEnum.INACTIVE:
      return 'bg-gray-100 text-gray-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TLocationStatus): string {
  switch (value) {
    case LocationStatusEnum.ACTIVE:
      return 'icon-park-outline:check-one'
    case LocationStatusEnum.INACTIVE:
      return 'material-symbols:close-rounded'
    default:
      return 'mdi:help-circle-outline'
  }
}
