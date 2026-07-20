import type { TBaseOption } from '@/models/Global.model'

export enum ReceiptTypeEnum {
  NORMAL = 'NORMAL', // ชำระค่างวด
  CLOSE_CONTRACT = 'CLOSE_CONTRACT', // ปิดบัญชี
  REFINANCE = 'REFINANCE', // รีไฟแนนซ์
  PENDING_REFINANCE = 'PENDING_REFINANCE' // รอรีไฟแนนซ์
}

export type TReceiptType = keyof typeof ReceiptTypeEnum

const titleMap: Record<TReceiptType, string> = {
  [ReceiptTypeEnum.NORMAL]: 'ชำระค่างวด',
  [ReceiptTypeEnum.CLOSE_CONTRACT]: 'ปิดบัญชี',
  [ReceiptTypeEnum.REFINANCE]: 'รีไฟแนนซ์',
  [ReceiptTypeEnum.PENDING_REFINANCE]: 'รอรีไฟแนนซ์'
}

export const ReceiptTypeItems: TBaseOption[] = Object.values(ReceiptTypeEnum).filter(Boolean).map(
  (e: TReceiptType): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TReceiptType): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
