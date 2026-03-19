import type { TBaseOption } from '@/models/Global.model'

export enum DocumentStorageAssetsStatusEnum {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  PENDING_SALE = 'PENDING_SALE',
  DONE = 'DONE'
}

export type TDocumentStorageAssetsStatus = keyof typeof DocumentStorageAssetsStatusEnum

const titleMap: Record <TDocumentStorageAssetsStatus, string> = {
  [DocumentStorageAssetsStatusEnum.ACTIVE]: 'ใช้งาน',
  [DocumentStorageAssetsStatusEnum.SOLD]: 'ปิดใช้งาน',
  [DocumentStorageAssetsStatusEnum.PENDING_SALE]: 'ปิดใช้งาน',
  [DocumentStorageAssetsStatusEnum.DONE]: 'ปิดใช้งาน'
}

export const DocumentStorageAssetsStatusItems: TBaseOption[] = Object.values(DocumentStorageAssetsStatusEnum).map(
  (e: TDocumentStorageAssetsStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TDocumentStorageAssetsStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TDocumentStorageAssetsStatus): string {
  switch (value) {
    case DocumentStorageAssetsStatusEnum.ACTIVE:
      return 'bg-green-brand-light text-green-brand border-none'
    case DocumentStorageAssetsStatusEnum.SOLD:
      return 'bg-gray-100 text-gray-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TDocumentStorageAssetsStatus): string {
  switch (value) {
    case DocumentStorageAssetsStatusEnum.ACTIVE:
      return 'icon-park-outline:check-one'
    case DocumentStorageAssetsStatusEnum.SOLD:
      return 'material-symbols:close-rounded'
    default:
      return 'mdi:help-circle-outline'
  }
}
