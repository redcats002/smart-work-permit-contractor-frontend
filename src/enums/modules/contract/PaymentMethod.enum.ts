import type { TBaseOption } from '@/models/Global.model'

export enum PaymentMethodEnum {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export type TPaymentMethod = keyof typeof PaymentMethodEnum

const titleMap: Record<TPaymentMethod, string> = {
  [PaymentMethodEnum.CASH]: 'เงินสด',
  [PaymentMethodEnum.BANK_TRANSFER]: 'QR พร้อมเพย์'
}

export const PaymentMethodItems: TBaseOption[] = Object.values(PaymentMethodEnum).map(
  (e: TPaymentMethod): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TPaymentMethod): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
