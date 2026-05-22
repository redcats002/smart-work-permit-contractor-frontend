import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TInterestType } from '@/enums/modules/contract/InterestType.enum'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetContractList extends IBasePaginationRequest {
  status?: TContractStatus
  contractLoanTypeId?: number
}

export interface IGetInstallmentList extends IBasePaginationRequest {}
export interface IGetInstallmentSummary {}
export interface IUpdateInstallmentFeePayload {
  amount: number
}

export interface IGetGuarantorContractList extends IBasePaginationRequest {}

export interface IUpdateContractPayload {
  installmentCount: number
  interestType: TInterestType
  annualInterestRate: number
}
export interface IActionContractPayload extends IUpdateContractPayload {}

export interface IGetAssetContract {}

export * from '../contract-expense/ContractExpenseReq.model'
export * from '../contract-income/ContractIncomeReq.model'
export * from '../contract-history/ContractHistoryReq.model'
export * from '../contract-document/ContractDocumentReq.model'
