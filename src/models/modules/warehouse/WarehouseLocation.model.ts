import type { TLocationStatus } from '@/enums/modules/warehouse/LocationStatus.enum'

export interface IWarehouseLocation {
  id?: number
  name: string
  status: TLocationStatus
  optionIds?: string
}
