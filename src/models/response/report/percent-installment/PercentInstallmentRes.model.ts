import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse } from '../../Response.model'

export interface IPercentInstallmentList extends IEntity {
  branchName: string
  monthlyInstallment: number
  amountPaid: number
  salePrice: number
  totalPenaltyFee: number
  totalCollectionFee: number
  summary: number
  percent: number
}

export interface IPercentInstallmentSummary {
  monthlyInstallment: number
  amountPaid: number
  salePrice: number
  totalPenaltyFee: number
  totalCollectionFee: number
  summary: number
  percent: number
}

export interface TGetPercentInstallmentListResponse
  extends IBasePaginationResponse<IPercentInstallmentList> {
  summary: IPercentInstallmentSummary
}
