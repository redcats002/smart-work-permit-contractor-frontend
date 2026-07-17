import type { EVatType } from '@/enums/modules/Vat.enum'
import type { IBaseSuccessResponse } from '../Response.model'
import type { IReceiptReference } from '../receipt/ReceiptRes.model'

export interface IRefinanceFile {
  name: string
  url: string
  path?: string
}

export interface IRefinanceExpense {
  id: number
  amount: number
  expenseCategoryId: number
  expenseCategoryName?: string
  expenseTypeId: number
  expenseTypeName?: string
  vatType: EVatType
  files?: IRefinanceFile[]
  remark?: string
}

export interface IRefinanceCustomerGroup {
  id: number
  name: string
}

export interface IRefinanceOccupation {
  id: number
  name: string
}

export interface IRefinanceCustomer {
  id: number
  idNo: string
  status: string
  titleName: string
  firstName: string
  lastName: string
  idCard: string
  birthDate: string
  age: number
  customerGroup: IRefinanceCustomerGroup
  occupation: IRefinanceOccupation
  phoneNumber: string
  phoneNumber2: string
  email: string
  receiptReference?: IReceiptReference | null
}

export interface IRefinanceInstallment {
  id: number
  order: number
  status: string
  penaltyFee: number
  collectionFee: number
  legalFee: number
  principal: number
  interest: number
  total: number
}

export interface IRefinanceSummary {
  penaltyFee: number
  collectionFee: number
  legalFee: number
  principal: number
  interest: number
  total: number
}

export interface IRefinanceContract {
  id: number
  idNo: string
  installments: IRefinanceInstallment[]
  summary: IRefinanceSummary
}

export interface IRefinanceData {
  customer: IRefinanceCustomer
  contract: IRefinanceContract
}

export interface IRefinanceActionData {
  discountAmount: number
  totalAmount: number
}

export type TGetRefinanceResponse = IBaseSuccessResponse<IRefinanceData>
export type TCreateRefinanceResponse = IBaseSuccessResponse<IRefinanceActionData>
export type TMakeAContractResponse = IBaseSuccessResponse<boolean>
