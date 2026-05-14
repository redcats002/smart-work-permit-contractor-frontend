import type { TBaseOption } from '@/models/Global.model'

export enum ActionLogTypeEnum {
  READ = 'READ',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  OTHER = 'OTHER'
}

export type ActionLogType = keyof typeof ActionLogTypeEnum

const titleMap: Record <ActionLogType, string> = {
  [ActionLogTypeEnum.READ]: 'ดู',
  [ActionLogTypeEnum.CREATE]: 'เพิ่ม',
  [ActionLogTypeEnum.UPDATE]: 'แก้ไข',
  [ActionLogTypeEnum.DELETE]: 'ลบ',
  [ActionLogTypeEnum.OTHER]: 'อื่น ๆ'
}

export const AssetsStatusItems: TBaseOption[] = Object.values(ActionLogTypeEnum).map(
  (e: ActionLogType): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: ActionLogType): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
