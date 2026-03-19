import type { IEntity } from '@/models/Global.model'
import type { IContractList } from '../../contract/ContractRes.model'
import type { ICustomerList } from '../../customer/CustomerRes.model'
import type { IReceiptList } from '../../receipt/ReceiptRes.model'
import type { IBasePaginationResponse } from '../../Response.model'

export interface IDailyLoanDisbursementList extends IEntity {
  contract: IContractList
  receipt: IReceiptList
  customer: ICustomerList
  interest: number
  total: number
  totalWithInterest: number
  operation: number
  installment: number
  numberOfInstallments: number
}
export interface IDailyLoanDisbursementSummary {}

export interface TGetDailyLoanDisbursementListResponse extends IBasePaginationResponse<IDailyLoanDisbursementList>, IDailyLoanDisbursementSummary {}
