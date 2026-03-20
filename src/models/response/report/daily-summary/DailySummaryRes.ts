import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse } from '../../Response.model'

export interface IDailySummaryList extends IEntity {
  id: number
  date: string | Date
  branchName: string
  contractCount: number
  principalAmount: number
  principalWithInterest: number
  debtCutOff: number
  discount: number
  currentBalance: number
}

export type TGetDailySummaryListResponse = IBasePaginationResponse<IDailySummaryList>
