import type { TBaseOption } from '@/models/Global.model'

export enum DocumentStorageMovementStatusEnum {
  WAITING_RECEIVE = 'WAITING_RECEIVE',
  SUCCESS = 'SUCCESS',
  CANCELLED = 'CANCELLED'
}

export type TDocumentStorageMovementStatus = keyof typeof DocumentStorageMovementStatusEnum

const titleMap: Record <TDocumentStorageMovementStatus, string> = {
  [DocumentStorageMovementStatusEnum.WAITING_RECEIVE]: 'รอรับ',
  [DocumentStorageMovementStatusEnum.SUCCESS]: 'สำเร็จ',
  [DocumentStorageMovementStatusEnum.CANCELLED]: 'ยกเลิก'
}

export const DocumentStorageMovementStatusItems: TBaseOption[] = Object.values(DocumentStorageMovementStatusEnum).map(
  (e: TDocumentStorageMovementStatus): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TDocumentStorageMovementStatus): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}

export function getStatusClass (value?: TDocumentStorageMovementStatus): string {
  switch (value) {
    case DocumentStorageMovementStatusEnum.SUCCESS:
      return 'bg-green-brand-light text-green-brand border-none'
    case DocumentStorageMovementStatusEnum.WAITING_RECEIVE:
      return 'bg-yellow-100 text-yellow-600 border-none'
    case DocumentStorageMovementStatusEnum.CANCELLED:
      return 'bg-red-100 text-red-600 border-none'
    default:
      return 'bg-gray-100 text-gray-600 border-none'
  }
}

export function getIcon (value?: TDocumentStorageMovementStatus): string {
  switch (value) {
    case DocumentStorageMovementStatusEnum.SUCCESS:
      return 'icon-park-outline:check-one'
    case DocumentStorageMovementStatusEnum.WAITING_RECEIVE:
      return 'mingcute:time-duration-line'
    case DocumentStorageMovementStatusEnum.CANCELLED:
      return 'mingcute:close-line'
    default:
      return 'mdi:help-circle-outline'
  }
}
