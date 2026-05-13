import type { TBaseOption } from '@/models/Global.model'

export enum CustomerDocumentTypeEnum {
  ID_CARD = 'ID_CARD',
  PAYROLL = 'PAYROLL',
  OTHER = 'OTHER'
}

export type TCustomerDocumentType = keyof typeof CustomerDocumentTypeEnum

const titleMap: Record <TCustomerDocumentType, string> = {
  [CustomerDocumentTypeEnum.ID_CARD]: 'บัตรประชาชน',
  [CustomerDocumentTypeEnum.PAYROLL]: 'สลิปเงินเดือน / หนังสือรับรองรายได้',
  [CustomerDocumentTypeEnum.OTHER]: 'เอกสารอื่น ๆ'
}

export const CustomerDocumentTypeItems: TBaseOption[] = Object.values(CustomerDocumentTypeEnum).map(
  (e: TCustomerDocumentType): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TCustomerDocumentType): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
