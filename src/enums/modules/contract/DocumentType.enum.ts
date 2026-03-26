import type { TBaseOption } from '@/models/Global.model'

export enum DocumentTypeEnum {
  LOAN_CONTRACT = 'LOAN_CONTRACT',
  POWER_OF_ATTORNEY = 'POWER_OF_ATTORNEY',
  AGENDA_DOCUMENT = 'AGENDA_DOCUMENT',
  COLLATERAL_DOCUMENT = 'COLLATERAL_DOCUMENT',
  OTHER_DOCUMENT = 'OTHER_DOCUMENT'
}
export type TDocumentType = keyof typeof DocumentTypeEnum

const titleMap: Record<TDocumentType, string> = {
  [DocumentTypeEnum.LOAN_CONTRACT]: 'สัญญาเงินกู้',
  [DocumentTypeEnum.POWER_OF_ATTORNEY]: 'หนังสือมอบอำนาจ',
  [DocumentTypeEnum.AGENDA_DOCUMENT]: 'หนังสือวาระ',
  [DocumentTypeEnum.COLLATERAL_DOCUMENT]: 'เอกสารทรัพย์สิน',
  [DocumentTypeEnum.OTHER_DOCUMENT]: 'เอกสารอื่น ๆ'
}

export const DocumentTypeItems: TBaseOption[] = Object.values(DocumentTypeEnum).map(
  (e: TDocumentType): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TDocumentType): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
