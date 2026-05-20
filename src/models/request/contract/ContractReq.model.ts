import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TDocumentType } from '@/enums/modules/contract/DocumentType.enum'
import type { TVatType } from '@/enums/modules/Vat.enum'
import type { IMedia, IUploadResponse } from '@/resources/provider/Upload.provider'
import type { ContractHistoryFormValues } from '@/pages/contract/pages/detail/components/tab/contact-history/schema/contract-history.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetContractList extends IBasePaginationRequest {
  status?: TContractStatus
  contractLoanTypeId?: number
}
export interface IGetAssetContract {}

export interface IGetInstallmentList extends IBasePaginationRequest {}
export interface IGetInstallmentSummary {}
export interface IUpdateInstallmentFeePayload {
  amount: number
}

export interface IGetExpenseList extends IBasePaginationRequest {}
export interface ICreateExpense {
  expenseCategoryId: number
  expenseTypeId: number
  amount: number
  file: IUploadResponse[]
  note: string
  vatType: TVatType
}
export interface IUpdateExpense extends Partial<ICreateExpense> {}

export interface IGetIncomeList extends IBasePaginationRequest {}
export interface ICreateIncome {
  incomeCategoryId: number
  incomeTypeId: number
  note: string
  amount: number
  file: IUploadResponse[]
  vatType: TVatType
}
export interface IUpdateIncome extends Partial<ICreateIncome> {}

export interface IGetGuarantorContractList extends IBasePaginationRequest {}
export interface IGetContractHistoryList extends IBasePaginationRequest {}
export interface ICreateContractHistory extends ContractHistoryFormValues {}

export interface IGetDocumentList extends IBasePaginationRequest {}
export interface ICreateDocument {
  documentType: TDocumentType
  locationId: number
  files: IMedia[]
  note: string
}
export interface IUpdateDocument extends Partial<ICreateDocument> {}

export interface IGetContactHistoryList extends IBasePaginationRequest {}
export interface ICreateContractHistoryPayload {
  date: string
  topic: string
  note: string
}

export interface ICreateContractPayload {}

export interface IUpdateContractPayload extends Partial<ICreateContractPayload> {}
export interface IActionContractPayload extends ICreateContractPayload {}
