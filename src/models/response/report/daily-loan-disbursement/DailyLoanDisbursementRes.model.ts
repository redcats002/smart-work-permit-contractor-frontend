import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse } from '../../Response.model'

export interface IDailyLoanDisbursementList extends IEntity {
  idNo: string
  customerName: string
  principalAndInterest: number
  principal: number
  administrativeCost: number
  interest: number
  monthlyInstallment: number
  installmentCount: number
}

export interface IDailyLoanDisbursementSummary {
  principalAndInterest: number
  principal: number
  administrativeCost: number
  interest: number
  monthlyInstallment: number
  installmentCount: number
}

export interface TGetDailyLoanDisbursementListResponse extends IBasePaginationResponse<IDailyLoanDisbursementList> {
  summary: IDailyLoanDisbursementSummary
}
