import type { TBaseOption } from '@/models/Global.model'

export enum PaymentStatusEnum {
  OVERDUE = 'OVERDUE',
  NOT_DUE_YET = 'NOT_DUE_YET',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  DUE_DATE = 'DUE_DATE'
}

export type TPaymentStatus = keyof typeof PaymentStatusEnum

const titleMap: Record<TPaymentStatus, string> = {
  [PaymentStatusEnum.OVERDUE]: 'เกินกำหนด',
  [PaymentStatusEnum.NOT_DUE_YET]: 'ยังไม่ถึงกำหนด',
  [PaymentStatusEnum.PARTIAL]: 'ชำระบางส่วน',
  [PaymentStatusEnum.PAID]: 'ชำระแล้ว',
  [PaymentStatusEnum.DUE_DATE]: 'ถึงกำหนดชำระ'
}

export const PaymentStatusItems: TBaseOption[] = Object.values(PaymentStatusEnum).map(
  (e: TPaymentStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TPaymentStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TPaymentStatus): string {
  switch (value) {
    case PaymentStatusEnum.OVERDUE:
      return 'bg-red-100 text-red-600 border-none'
    case PaymentStatusEnum.PARTIAL:
      return 'bg-blue-100 text-blue-600 border-none'
    case PaymentStatusEnum.NOT_DUE_YET:
      return 'bg-amber-100 text-amber-600 border-none'
    case PaymentStatusEnum.PAID:
      return 'bg-green-100 text-green-700 border-none'
    case PaymentStatusEnum.DUE_DATE:
      return 'bg-orange-100 text-orange-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TPaymentStatus): string {
  switch (value) {
    case PaymentStatusEnum.OVERDUE:
      return 'quill:warning'
    case PaymentStatusEnum.PARTIAL:
      return 'streamline:graph-arrow-increase'
    case PaymentStatusEnum.NOT_DUE_YET:
      return 'mingcute:time-duration-line'
    case PaymentStatusEnum.PAID:
      return 'mdi:check-circle-outline'
    case PaymentStatusEnum.DUE_DATE:
      return 'proicons:calendar'
    default:
      return 'mdi:help-circle-outline'
  }
}
