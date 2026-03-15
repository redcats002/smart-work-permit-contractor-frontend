import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TDocumentType } from '@/enums/modules/contract/DocumentType.enum'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import type { TVatType } from '@/enums/modules/Vat.enum'
import type { ContractHistoryFormValues } from '@/pages/contract/pages/detail/components/tab/contact-history/schema/contract-history.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetContractList extends IBasePaginationRequest {
  status?: TContractStatus
  assetStatus?: TPreContractStatus
  loanTypeId?: number
}
export interface IGetAssetContract {}

export interface IGetInstallmentList extends IBasePaginationRequest {}
export interface IGetInstallmentSummary {}

export interface IGetExpenseList extends IBasePaginationRequest {}
export interface ICreateExpense {
  expenseCategoryId: number
  expenseTypeId: number
  detail: string
  amount: number
  url: string
  vatType: TVatType
}

export interface IGetIncomeList extends IBasePaginationRequest {}
export interface ICreateIncome {
  incomeCategoryId: number
  incomeTypeId: number
  detail: string
  amount: number
  url: string
  vatType: TVatType
}

export interface IGetGuarantorContractList extends IBasePaginationRequest {}
export interface IGetContractHistoryList extends IBasePaginationRequest {}
export interface ICreateContractHistory extends ContractHistoryFormValues {}

export interface IGetDocumentList extends IBasePaginationRequest {}
export interface ICreateDocument {
  documentType: TDocumentType
  warehouseId: number
  url: string
  detail: string
}

export interface IGetContactHistoryList extends IBasePaginationRequest {}

export interface ICreateContractPayload {}

export interface IUpdateContractPayload extends Partial<ICreateContractPayload> {}
export interface IActionContractPayload extends ICreateContractPayload {}
