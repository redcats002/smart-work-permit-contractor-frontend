import type { IEntity } from '@/models/Global.model'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TInterestType } from '@/enums/modules/contract/InterestType.enum'
import type { TPaymentStatus } from '@/enums/modules/contract/PaymentStatus.enum'
import type { IInstallmentRow } from '@/pages/contract/pages/pre-contract-detail/composables/useInstallment'
import type { IContractLoanPurposeList } from '../contract-loan-purpose/ContractLoanPurposeRes.model'
import type { IContractLoanTypeList } from '../contract-loan-type/ContractLoanTypeRes.model'
import type { ICustomerById, ICustomerList } from '../customer/CustomerRes.model'
import type { IEmployeeList } from '../employee/EmployeeRes.model'
import type { IHowDidFindUsList } from '../how-did-find-us/HowDidFindUsRes.model'
import type { IPreContractList, IPreContractLoanType } from '../pre-contract/PreContractRes.model'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IContractCustomer extends ICustomerList {
  idCard?: string
  birthDate?: string
  mainAddress?: IAddressRequest
}

export interface IBorrowersItems {
  customer: IContractCustomer
  isMain: boolean
}

export interface IContractList extends Omit<IPreContractList, 'status'> {
  status: TContractStatus
  contractedAt: string
  contractLoanType: IPreContractLoanType
  loanAmount: number
  firstInstallmentDate: string
  finalInstallmentDate: string
}

export interface IContractById extends IEntity {
  borrowers: IBorrowersItems[]
  status: TContractStatus
  sellMan: IEmployeeList
  contractLoanPurpose: IContractLoanPurposeList
  howDidFindUs: IHowDidFindUsList
  contractLoanType: IContractLoanTypeList
  firstInstallmentDate: string
  finalInstallmentDate: string
  finalInstallment: number
  periodCount: number
  loanAmount: number
  interestType?: TInterestType
  annualInterestRate: number
  lateFee: number
  perMonthPayment: number
  lastPeriodPayment: number
  interestAmount: number
  guarantors: IContractGuarantorList[]
  contractedAt: string
  installmentCount: number
  monthlyInstallment: number
  totalInterest: number
  outstanding: IContractSummaryCard
}

export interface IContractInstallmentSummary {
  remainingDebt: number
  remainingPrincipal: number
  remainingInterest: number
}

export interface IContractInstallmentItemDetail {
  name: string
  amount: number
  paid: number
  outstanding: number
}

export interface IContractInstallmentItemSummary {
  amount: number
  paid: number
  outstanding: number
}

export interface IContractInstallmentItem {
  id: number
  paidAt: string
  summary: IContractInstallmentItemSummary
  details: IContractInstallmentItemDetail[]
}

export interface IContractInstallmentList extends IInstallmentRow, IEntity {
  order: number
  status: TPaymentStatus
  dueDate: string
  interest: number
  principal: number
  installment: number
  remainingPrincipal: number
  penaltyFee: number
  outstandingPenaltyFee: number
  collectionFee: number
  outstandingCollectionFee: number
  legalFee: number
  outstandingLegalFee: number
  totalPaid: number
  items: IContractInstallmentItem[]
}

export interface IContractGuarantorList extends ICustomerList {
  customer: ICustomerById
  idCard: string
  mainAddress: IAddressRequest
  birthDate?: string
}

export interface IContractSummaryCard {
  interest: number
  principal: number
  total: number
}

export type TGetContractListResponse = IBasePaginationResponse<IContractList>
export type TGetContractByIdResponse = IBaseSuccessResponse<IContractById>
export type TActionContract = IBaseSuccessResponse<boolean>
export type TGetInstallmentSummaryResponse = IBaseSuccessResponse<IContractInstallmentSummary>
export type TGetInstallmentListResponse = IBasePaginationResponse<IContractInstallmentList>
export type TActionContractInstallmentFeeResponse = IBaseSuccessResponse<boolean>
export type TGetGuarantorContractListResponse = IBasePaginationResponse<IContractGuarantorList>

export interface IContractAssetList extends IPreAssetList {}
export type TGetAssetContractListResponse = IBasePaginationResponse<IContractAssetList>


export * from '../contract-expense/ContractExpenseRes.model'
export * from '../contract-income/ContractIncomeRes.model'
export * from '../contract-history/ContractHistoryRes.model'
export * from '../contract-document/ContractDocumentRes.model'
