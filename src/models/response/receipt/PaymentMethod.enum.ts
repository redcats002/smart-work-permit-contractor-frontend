import type { TBaseOption } from '@/models/Global.model'

export enum EReceiptPaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export type TReceiptPaymentMethod = keyof typeof EReceiptPaymentMethod

const titleMap: Record<TReceiptPaymentMethod, string> = {
  [EReceiptPaymentMethod.CASH]: 'เงินสด',
  [EReceiptPaymentMethod.BANK_TRANSFER]: 'QR พร้อมเพย์'
}

export const ReceiptPaymentMethodItems: TBaseOption[] = Object.values(EReceiptPaymentMethod).map(
  (e: TReceiptPaymentMethod): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TReceiptPaymentMethod): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
