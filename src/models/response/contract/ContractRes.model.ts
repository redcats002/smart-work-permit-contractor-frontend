import type { IEntity } from '@/models/Global.model'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TDocumentType } from '@/enums/modules/contract/DocumentType.enum'
import type { TInterestType } from '@/enums/modules/contract/InterestType.enum'
import type { TPaymentStatus } from '@/enums/modules/contract/PaymentStatus.enum'
import type { TVatType } from '@/enums/modules/Vat.enum'
import type { IInstallmentRow } from '@/pages/contract/pages/pre-contract-detail/schema/installment.schema'
import type { IContractLoanPurposeList } from '../contract-loan-purpose/ContractLoanPurposeRes.model'
import type { IContractLoanTypeList } from '../contract-loan-type/ContractLoanTypeRes.model'
import type { ICustomerList } from '../customer/CustomerRes.model'
import type { IEmployeeList } from '../employee/EmployeeRes.model'
import type { IFinanceExpenseCategoryList } from '../finance-expense-category/FinanceExpenseCategoryRes.model'
import type { IFinanceExpenseTypeList } from '../finance-expense-type/FinanceExpenseTypeRes.model'
import type { IFinanceIncomeCategoryList } from '../finance-income-category/FinanceIncomeCategoryRes.model'
import type { IFinanceIncomeTypeList } from '../finance-income-type/FinanceIncomeTypeRes.model'
import type { IHowDidFindUsList } from '../how-did-find-us/HowDidFindUsRes.model'
import type { IAssetDetailInfo, IPreContractList } from '../pre-contract/PreContractRes.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'
import type { IWarehouseList } from '../warehouse/WarehouseRes.model'

export interface IContractCustomer extends ICustomerList {
  idCard?: string
  birthDate?: string
  mainAddress?: IAddressRequest
}

export interface IContractList extends IPreContractList {}

export interface IContractById extends IEntity {
  customers: IContractCustomer[]
  status: TContractStatus
  employee: IEmployeeList
  contractLoanPurpose: IContractLoanPurposeList
  howDidFindUs: IHowDidFindUsList
  contractLoanType: IContractLoanTypeList
  startDate: string
  endDate: string
  periodCount: number
  loanAmount: number
  interestType?: TInterestType
  annualInterestRate: number
  lateFee: number
  perMonthPayment: number
  lastPeriodPayment: number
  interestAmount: number
  guarantors: IContractGuarantorList[]
}

export interface IContractAssetList extends IAssetDetailInfo {}
export interface IContractInstallmentSummary {
  remainingDebt: number
  remainingPrincipal: number
  remainingInterest: number
}
export interface IContractInstallmentList extends IInstallmentRow, IEntity {
  installment: number
  remainingPrincipal: number
  lateFee: number
  trackingFee: number
  paymentAmount: number
  paymentStatus: TPaymentStatus
}

export interface IContractExpenseList extends IEntity {
  date: string
  expenseCategory: IFinanceExpenseCategoryList
  expenseType: IFinanceExpenseTypeList
  detail: string
  amount: number
  vatType?: TVatType
  url?: string
}
export interface IContractIncomeList extends IEntity {
  date: string
  incomeCategory: IFinanceIncomeCategoryList
  incomeType: IFinanceIncomeTypeList
  detail: string
  amount: number
  vatType?: TVatType
  url?: string
}
export interface IContractGuarantorList extends ICustomerList {
  idCard: string
  birthDate?: string
}
export interface IContractContactHistoryList extends IEntity {
  date: string
  subject: string
  detail: string
  employee: IEmployeeList
}
export interface IContractDocumentList extends IEntity {
  date: string
  documentType: TDocumentType
  detail: string
  warehouse: IWarehouseList
}

export type TGetContractListResponse = IBasePaginationResponse<IContractList>
export type TGetContractByIdResponse = IBaseSuccessResponse<IContractById>
export type TActionContract = IBaseSuccessResponse<boolean>
export type TGetAssetContractListResponse = IBasePaginationResponse<IContractAssetList>
export type TGetInstallmentSummaryResponse = IBaseSuccessResponse<IContractInstallmentSummary>
export type TGetInstallmentListResponse = IBasePaginationResponse<IContractInstallmentList>
export type TGetContractExpenseListResponse = IBasePaginationResponse<IContractExpenseList>
export type TActionContractExpenseResponse = IBaseSuccessResponse<boolean>
export type TGetContractIncomeListResponse = IBasePaginationResponse<IContractIncomeList>
export type TActionContractIncomeResponse = IBaseSuccessResponse<boolean>
export type TGetGuarantorContractListResponse = IBasePaginationResponse<IContractGuarantorList>
export type TGetContractHistoryListResponse = IBasePaginationResponse<IContractContactHistoryList>
export type TGetDocumentListResponse = IBasePaginationResponse<IContractDocumentList>
