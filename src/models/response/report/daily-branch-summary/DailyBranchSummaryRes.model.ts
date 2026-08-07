import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

export interface IDailyBranchSummaryList {
  branchId: string
  branchName: string
  financeReceive: number
  financeRelease: number
  processingFee: number
  salePrice: number
  depositFee: number
  cancelContractFee: number
  lawyerFee: number
  contractReplacementFee: number
  outstanding: number
}

export interface TGetDailyBranchSummaryListResponse extends IBasePaginationResponse<IDailyBranchSummaryList> {
  summary: Omit<IDailyBranchSummaryList, 'branchId' | 'branchName'>
}
export type TActionDailyBranchSummary = IBaseSuccessResponse<boolean>
