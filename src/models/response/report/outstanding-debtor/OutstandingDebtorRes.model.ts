import type { TInterestType } from '@/enums/modules/contract/InterestType.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

export interface IOutstandingDebtorList {
  id: number
  idNo: string
  customerName: string
  interestType: TInterestType
  startContractDate: string
  endContractDate: string
  principal: number
  installmentCount: number
  principalAndInterest: number
  monthlyInstallment: number
  amountPaid: number
  outstanding: number
  lastUpdated: string
  latestPaymentAmount: number
}

export interface IOutStandingDebtorSummary {
  principal: number
  installmentCount: number
  principalAndInterest: number
  monthlyInstallment: number
  amountPaid: number
  outstanding: number
  latestPaymentAmount: number
}

export interface TGetOutstandingDebtorListResponse
  extends IBasePaginationResponse<IOutstandingDebtorList> {
  summary: IOutStandingDebtorSummary
}

export type TActionOutstandingDebtor = IBaseSuccessResponse<boolean>
