import type { IEntity } from '@/models/Global.model'
import type { IBranchList } from '../../branch/BranchRes.model'
import type { IContractList } from '../../contract/ContractRes.model'
import type { ICustomerList } from '../../customer/CustomerRes.model'
import type { IReceiptList } from '../../receipt/ReceiptRes.model'
import type { IBasePaginationResponse } from '../../Response.model'

export interface IProfitBasedOnActualPaymentList extends IEntity {
  branch: IBranchList
  receipt: IReceiptList
  contract: IContractList
  numberOfContractYear: number
  customer: ICustomerList
  installmentPaymentNumber: string
  totalPrincipal: number
  totalInterest: number
  installmentPaymentAmount: number
  currentPrincipal: number
  currentInterest: number
}
export interface IProfitBasedOnActualPaymentSummary {
  numberOfCustomer: number
  totalPrincipal: number
  totalInterest: number
  installmentPaymentAmount: number
  currentPrincipal: number
  currentInterest: number
}

export interface TGetProfitBasedOnActualPaymentListResponse
  extends IBasePaginationResponse<IProfitBasedOnActualPaymentList>, IProfitBasedOnActualPaymentSummary {}
