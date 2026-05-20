import type { IBasePaginationResponse } from '../../Response.model'

export interface IOverdueCustomerList {
  id: number
  createdAt: string
  finalInstallmentDate: string
  idNo: string
  customerName: string
  principal: number
  principalAndInterest: number
  amountPaid: number
  outstandingPrincipal: number
  lastPaidAt: string
  overdueOutstandingAmount: number
  overdueOutstandingCount: number
}

export interface IOverdueCustomerSummary {
  principal: number
  principalAndInterest: number
  amountPaid: number
  outstandingPrincipal: number
  overdueOutstandingAmount: number
  overdueOutstandingCount: number
}

export interface TGetOverdueCustomerListResponse extends IBasePaginationResponse<IOverdueCustomerList> {
  summary: IOverdueCustomerSummary
}
