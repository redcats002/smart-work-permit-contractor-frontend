import type { TDays } from '@/enums/Date.enum'

export interface IBranchTime {
  id?: number
  day: TDays[]
  openTime: string
  closeTime: string
}
