import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
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

export interface ICreateContractPayload {}
export interface IUpdateContractPayload extends Partial<ICreateContractPayload> {}
export interface IActionContractPayload extends ICreateContractPayload {}

export * from '../contract-assets/ContractAssetsReq.model'
export * from '../contract-expense/ContractExpenseReq.model'
export * from '../contract-income/ContractIncomeReq.model'
export * from '../contract-history/ContractHistoryReq.model'
export * from '../contract-document/ContractDocumentReq.model'
