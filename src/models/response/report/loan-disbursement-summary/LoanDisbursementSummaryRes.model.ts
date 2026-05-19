import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse } from '../../Response.model'

export interface ILoanDisbursementSummaryList extends IEntity {
  branchName: string
  contractAmount: number
  principal: number
  interest: number
  principalAndInterest: number
  monthlyInstallment: number
}

export interface ILoanDisbursementSummarySummary {
  numberOfBranches: number
  contractAmount: number
  principal: number
  interest: number
  principalAndInterest: number
  monthlyInstallment: number
}

export interface TGetLoanDisbursementSummaryListResponse
  extends IBasePaginationResponse<ILoanDisbursementSummaryList> {
  summary: Omit<ILoanDisbursementSummarySummary, 'numberOfBranches'>
}
