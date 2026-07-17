import type { TBaseOption } from '@/models/Global.model'

export enum ReceiptStatusEnum {
  ACTIVE = 'ACTIVE', // สำเร็จ
  CANCEL = 'CANCEL' // ยกเลิก
}

export type TReceiptStatus = keyof typeof ReceiptStatusEnum

const titleMap: Record<TReceiptStatus, string> = {
  [ReceiptStatusEnum.ACTIVE]: 'สำเร็จ',
  [ReceiptStatusEnum.CANCEL]: 'ยกเลิก'
}

export const ReceiptStatusItems: TBaseOption[] = Object.values(ReceiptStatusEnum).map(
  (e: TReceiptStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TReceiptStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TReceiptStatus): string {
  switch (value) {
    case ReceiptStatusEnum.ACTIVE:
      return 'bg-green-100 text-green-600 border-none'
    case ReceiptStatusEnum.CANCEL:
      return 'bg-red-100 text-red-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TReceiptStatus): string {
  switch (value) {
    case ReceiptStatusEnum.ACTIVE:
      return 'icon-park-outline:check-one'
    case ReceiptStatusEnum.CANCEL:
      return 'mdi:close'
    default:
      return 'mdi:help-circle-outline'
  }
}
