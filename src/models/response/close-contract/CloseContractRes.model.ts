import type { EVatType } from '@/enums/modules/Vat.enum'
import type { IBaseSuccessResponse } from '../Response.model'

export interface ICloseContractFile {
  name: string
  url: string
  path?: string
}

export interface ICloseContractExpense {
  id: number
  amount: number
  expenseCategoryId: number
  expenseCategoryName?: string
  expenseTypeId: number
  expenseTypeName?: string
  vatType: EVatType
  files?: ICloseContractFile[]
  remark?: string
}

export interface ICloseContractCustomerGroup {
  id: number
  name: string
}

export interface ICloseContractOccupation {
  id: number
  name: string
}

export interface ICloseContractCustomer {
  id: number
  idNo: string
  status: string
  titleName: string
  firstName: string
  lastName: string
  idCard: string
  birthDate: string
  age: number
  customerGroup: ICloseContractCustomerGroup
  occupation: ICloseContractOccupation
  phoneNumber: string
  phoneNumber2: string
  email: string
}

export interface ICloseContractInstallment {
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

export interface ICloseContractSummary {
  penaltyFee: number
  collectionFee: number
  legalFee: number
  principal: number
  interest: number
  total: number
}

export interface ICloseContractContract {
  id: number
  idNo: string
  installments: ICloseContractInstallment[]
  summary: ICloseContractSummary
}

export interface ICloseContractData {
  customer: ICloseContractCustomer
  contract: ICloseContractContract
}

export type TGetCloseContractResponse = IBaseSuccessResponse<ICloseContractData>
export type TActionCloseContract = IBaseSuccessResponse<boolean>
