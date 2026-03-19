import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

export interface IDailyBranchSummaryList extends IEntity {
  branchName: string
  financeReceive: number
  financeRelease: number
  processingFee: number
  sell: number
  insuranceCost: number
  cancellationCost: number
  lawyerFee: number
  contractReplacementFee: number
  remainingBalance: number
}

export interface TGetDailyBranchSummaryListResponse extends IBasePaginationResponse<IDailyBranchSummaryList> {}
export interface TActionDailyBranchSummary extends IBaseSuccessResponse<boolean> {}
