import type { TBaseOption } from '@/models/Global.model'

export enum PaymentMethodEnum {
  EMPLOYEE = 'EMPLOYEE',
  CASHIER = 'CASHIER'
}

export type TPaymentMethod = keyof typeof PaymentMethodEnum

const titleMap: Record<TPaymentMethod, string> = {
  [PaymentMethodEnum.CASHIER]: 'หน้าสาขา',
  [PaymentMethodEnum.EMPLOYEE]: 'พนักงาน'
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
