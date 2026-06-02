import type { IEntityId } from '@/models/Global.model'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { IBasePaginationResponse } from '../../Response.model'

export interface IDailyInstallmentPaymentCustomerRef {
  id: number
  idNo: string
  fullName: string
}

export interface IDailyInstallmentPaymentEmployeeRef {
  id: string
  idNo: string
  fullName: string
}

export interface IDailyInstallmentPaymentList {
  date: string | null
  receipt: IEntityId
  contract: IEntityId
  customer: IDailyInstallmentPaymentCustomerRef
  paymentType: string
  paymentReason: string
  debtorCutAmount: number
  discountAmount: number
  netReceiveAmount: number
  allPrincipalAmount: number
  principalAmount: number
  interestAmount: number
  penaltyAmount: number
  collectionAmount: number
  legalAmount: number
  employee: IDailyInstallmentPaymentEmployeeRef
  contractStatus: TContractStatus
}

export interface IDailyInstallmentPaymentSummary {
  debtorCutAmount: number
  discountAmount: number
  netReceiveAmount: number
  allPrincipalAmount: number
  principalAmount: number
  interestAmount: number
}

export interface TGetDailyInstallmentPaymentListResponse extends IBasePaginationResponse<IDailyInstallmentPaymentList> {
  summary: IDailyInstallmentPaymentSummary
}
