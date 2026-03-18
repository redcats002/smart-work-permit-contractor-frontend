import type { TBaseOption } from '@/models/Global.model'

export enum DocumentTypeEnum {
  LOAN_AGREEMENT = 'LOAN_AGREEMENT',
  POWER_OF_ATTORNEY = 'POWER_OF_ATTORNEY',
  AGENDA = 'AGENDA',
  ASSET_DOCUMENT = 'ASSET_DOCUMENT',
  OTHER_DOCUMENT = 'OTHER_DOCUMENT'
}
export type TDocumentType = keyof typeof DocumentTypeEnum

const titleMap: Record<TDocumentType, string> = {
  [DocumentTypeEnum.LOAN_AGREEMENT]: 'สัญญาเงินกู้',
  [DocumentTypeEnum.POWER_OF_ATTORNEY]: 'หนังสือมอบอำนาจ',
  [DocumentTypeEnum.AGENDA]: 'หนังสือวาระ',
  [DocumentTypeEnum.ASSET_DOCUMENT]: 'เอกสารทรัพย์สิน',
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
