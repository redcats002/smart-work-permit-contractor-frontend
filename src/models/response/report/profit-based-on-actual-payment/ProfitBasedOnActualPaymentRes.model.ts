import type { IEntity, IEntityId } from '@/models/Global.model'
import type { IBasePaginationResponse } from '../../Response.model'

export interface IProfitBasedOnActualPaymentList extends Omit<IEntity, 'idNo'> {
  branchName: string
  receipt: IEntityId
  date: string
  contract: IEntityId
  contractYear: number
  customerName: string
  paidAtPattern: string
  allPrincipal: number
  allInterest: number
  receiveInstallmentAmount: number
  principal: number
  interest: number
}

export interface IProfitBasedOnActualPaymentSummary {
  allPrincipal: number
  allInterest: number
  receiveInstallmentAmount: number
  principal: number
  interest: number
}

export interface TGetProfitBasedOnActualPaymentListResponse
  extends IBasePaginationResponse<IProfitBasedOnActualPaymentList> {
  summary: IProfitBasedOnActualPaymentSummary
}
