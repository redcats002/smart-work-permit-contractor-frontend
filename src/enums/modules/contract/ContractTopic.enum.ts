import type { TBaseOption } from '@/models/Global.model'

export enum ContractTopicEnum {
  FOLLOW = 'FOLLOW',
  INFO = 'INFO',
  OTHER = 'OTHER'
}

export type TContractTopic = keyof typeof ContractTopicEnum

const titleMap: Record<TContractTopic, string> = {
  [ContractTopicEnum.FOLLOW]: 'ติดตามทวงถาม',
  [ContractTopicEnum.INFO]: 'สอบถามข้อมูล',
  [ContractTopicEnum.OTHER]: 'อื่นๆ'
}

export const ContractStatusItems: TBaseOption[] = Object.values(ContractTopicEnum).map(
  (e: TContractTopic): TBaseOption => ({
    label: formatTitle(e),
    value: e
  })
)

export function formatTitle (status?: TContractTopic): string {
  if (!status) return 'ไม่ระบุ'
  return titleMap[status] || 'ไม่พบสถานะ'
}
