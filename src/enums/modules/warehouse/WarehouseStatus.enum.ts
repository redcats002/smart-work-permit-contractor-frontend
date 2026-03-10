import type { TBaseOption } from '@/models/Global.model'

export enum WarehouseStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export type TWarehouseStatus = keyof typeof WarehouseStatusEnum

const titleMap: Record <TWarehouseStatus, string> = {
  [WarehouseStatusEnum.ACTIVE]: 'ใช้งาน',
  [WarehouseStatusEnum.INACTIVE]: 'ปิดใช้งาน'
}

export const WarehouseStatusItems: TBaseOption[] = Object.values(WarehouseStatusEnum).map(
  (e: TWarehouseStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TWarehouseStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TWarehouseStatus): string {
  switch (value) {
    case WarehouseStatusEnum.ACTIVE:
      return 'bg-green-brand-light text-green-brand border-none'
    case WarehouseStatusEnum.INACTIVE:
      return 'bg-gray-100 text-gray-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TWarehouseStatus): string {
  switch (value) {
    case WarehouseStatusEnum.ACTIVE:
      return 'icon-park-outline:check-one'
    case WarehouseStatusEnum.INACTIVE:
      return 'material-symbols:close-rounded'
    default:
      return 'mdi:help-circle-outline'
  }
}
