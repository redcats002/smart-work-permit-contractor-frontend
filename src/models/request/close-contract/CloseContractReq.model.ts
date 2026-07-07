import type { EVatType } from '@/enums/modules/Vat.enum'
import type { PaymentMethodEnum } from '@/enums/modules/contract/PaymentMethod.enum'

export interface ICloseContractFile {
  name: string
  url: string
  path?: string
}

export interface ICloseContractExpense {
  amount: number
  expenseCategoryId: number
  expenseTypeId: number
  vatType: EVatType
  files?: ICloseContractFile[]
  remark?: string
}

export interface ICloseContractPayload {
  paymentType: PaymentMethodEnum
  discountInterestMonth?: number
  discountOther?: number
  otherExpenses?: ICloseContractExpense[]
}
