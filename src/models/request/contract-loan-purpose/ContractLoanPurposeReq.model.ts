import type { IBasePaginationRequest } from '../Request.model'

export interface IActionContractLoanPurposePayload extends ICreateContractLoanPurposePayload, IUpdateContractLoanPurposePayload {}
export interface ICreateContractLoanPurposePayload {
  name: string
}
export interface IUpdateContractLoanPurposePayload extends ICreateContractLoanPurposePayload {}

export interface IGetContractLoanPurposeList extends IBasePaginationRequest {}
