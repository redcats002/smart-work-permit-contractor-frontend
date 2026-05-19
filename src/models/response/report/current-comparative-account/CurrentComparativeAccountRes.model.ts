import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse } from '../../Response.model'

export interface ICurrentComparativeAccountList extends IEntity {
  branchName: string
  contractAmount: number
  principal: number
  principalAndInterest: number
  amountPaid: number
  settlementDiscount: number
  remainingAmount: number
}

export interface ICurrentComparativeAccountSummary {
  numberOfBranches: number
  contractAmount: number
  principal: number
  principalAndInterest: number
  amountPaid: number
  settlementDiscount: number
  remainingAmount: number
}

export interface TGetCurrentComparativeAccountListResponse
  extends IBasePaginationResponse<ICurrentComparativeAccountList> {
  summary: Omit<ICurrentComparativeAccountSummary, 'numberOfBranches'>
}
