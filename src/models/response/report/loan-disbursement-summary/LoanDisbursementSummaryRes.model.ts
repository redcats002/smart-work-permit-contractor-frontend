import type { IEntity } from '@/models/Global.model'
import type { IBranchList } from '../../branch/BranchRes.model'
import type { IBasePaginationResponse } from '../../Response.model'

export interface ILoanDisbursementSummaryList extends IEntity {
  branch: IBranchList
  amount: number
  principal: number
  interest: number
  principalWithInterest: number
  installment: number
}
export interface ILoanDisbursementSummarySummary {
  numberOfBranches: number
  amount: number
  principal: number
  interest: number
  principalWithInterest: number
  installment: number
}

export interface TGetLoanDisbursementSummaryListResponse
  extends IBasePaginationResponse<ILoanDisbursementSummaryList>, ILoanDisbursementSummarySummary {}
