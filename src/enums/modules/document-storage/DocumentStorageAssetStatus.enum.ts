import type { TBaseOption } from '@/models/Global.model'

export enum DocumentStorageAssetStatusEnum {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  PENDING_SALE = 'PENDING_SALE',
  DONE = 'DONE'
}

export type TDocumentStorageAssetStatus = keyof typeof DocumentStorageAssetStatusEnum

const titleMap: Record <TDocumentStorageAssetStatus, string> = {
  [DocumentStorageAssetStatusEnum.ACTIVE]: 'ใช้งานอยู่',
  [DocumentStorageAssetStatusEnum.SOLD]: 'ขายแล้ว',
  [DocumentStorageAssetStatusEnum.PENDING_SALE]: 'บังคับคดี',
  [DocumentStorageAssetStatusEnum.DONE]: 'ปิดแล้ว'
}

export const DocumentStorageAssetsStatusItems: TBaseOption[] = Object.values(DocumentStorageAssetStatusEnum).map(
  (e: TDocumentStorageAssetStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TDocumentStorageAssetStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TDocumentStorageAssetStatus): string {
  switch (value) {
    case DocumentStorageAssetStatusEnum.ACTIVE:
      return 'bg-green-brand-light text-green-brand border-none'
    case DocumentStorageAssetStatusEnum.SOLD:
      return 'bg-gray-100 text-gray-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TDocumentStorageAssetStatus): string {
  switch (value) {
    case DocumentStorageAssetStatusEnum.ACTIVE:
      return 'icon-park-outline:check-one'
    case DocumentStorageAssetStatusEnum.SOLD:
      return 'material-symbols:close-rounded'
    default:
      return 'mdi:help-circle-outline'
  }
}
