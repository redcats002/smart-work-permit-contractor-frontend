import type { TBaseOption } from '@/models/Global.model'

export enum EManagementPosition {
  DISTRICT_MANAGER = 'DISTRICT_MANAGER',
  LINE_MANAGER = 'LINE_MANAGER'
}

export type TManagementPosition = keyof typeof EManagementPosition

const titleMap: Record<TManagementPosition, string> = {
  [EManagementPosition.DISTRICT_MANAGER]: 'ผู้จัดการเขต',
  [EManagementPosition.LINE_MANAGER]: 'หัวหน้าสาย'
}

export const ManagementPositionItems: TBaseOption[] = Object.values(EManagementPosition).filter(Boolean).map(
  (e: TManagementPosition): TBaseOption => ({
    label: formatTitle(e),
    value: e as string
  })
)

export function formatTitle (title?: TManagementPosition): string {
  if (!title) return ''
  return titleMap[title] || ''
}
