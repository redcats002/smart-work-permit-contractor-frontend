import type { IBasePaginationRequest } from '../Request.model'

export interface IActionContractLoanTypePayload extends ICreateContractLoanTypePayload, IUpdateContractLoanTypePayload {}
export interface ICreateContractLoanTypePayload {
  name: string
}
export interface IUpdateContractLoanTypePayload extends ICreateContractLoanTypePayload {}

export interface IGetContractLoanTypeList extends IBasePaginationRequest {}
