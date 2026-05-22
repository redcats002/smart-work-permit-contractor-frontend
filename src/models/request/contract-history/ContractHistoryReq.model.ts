import type { ContractHistoryFormValues } from '@/pages/contract/pages/detail/components/tab/contact-history/schema/contract-history.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetContractHistoryList extends IBasePaginationRequest {}
export interface IGetContactHistoryList extends IBasePaginationRequest {}
export interface ICreateContractHistory extends ContractHistoryFormValues {}
export interface ICreateContractHistoryPayload {
  date: string
  topic: string
  note: string
}
