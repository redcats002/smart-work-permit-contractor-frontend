import type { TBaseOption } from '@/models/Global.model'

export enum BranchStatusEnum {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export type TBranchStatus = keyof typeof BranchStatusEnum

const titleMap: Record <TBranchStatus, string> = {
  [BranchStatusEnum.ACTIVE]: 'ใช้งาน',
  [BranchStatusEnum.INACTIVE]: 'ปิดใช้งาน'
}

export const BranchStatusItems: TBaseOption[] = Object.values(BranchStatusEnum).map(
  (e: TBranchStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TBranchStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TBranchStatus): string {
  switch (value) {
    case BranchStatusEnum.ACTIVE:
      return 'bg-green-brand-light text-green-brand border-none'
    case BranchStatusEnum.INACTIVE:
      return 'bg-gray-100 text-gray-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TBranchStatus): string {
  switch (value) {
    case BranchStatusEnum.ACTIVE:
      return 'icon-park-outline:check-one'
    case BranchStatusEnum.INACTIVE:
      return 'material-symbols:close-rounded'
    default:
      return 'mdi:help-circle-outline'
  }
}
