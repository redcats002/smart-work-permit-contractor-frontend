import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

export interface IBranchHeadSummaryList extends IEntity {
  branchName: string
  costPerInstallment: number
  percentageCollection: number | null
  collectionAmount: number
  releaseAmount: number
}

export interface TGetBranchHeadSummaryListResponse extends IBasePaginationResponse<IBranchHeadSummaryList> {}
export interface TActionBranchHeadSummary extends IBaseSuccessResponse<boolean> {}
