import type { TInterestType } from '@/enums/modules/contract/InterestType.enum'
import type { PaymentMethodEnum } from '@/enums/modules/contract/PaymentMethod.enum'
import type { ICloseContractExpense } from '../close-contract/CloseContractReq.model'

export type IRefinanceExpense = ICloseContractExpense

export interface IRefinancePayload {
  paymentType: PaymentMethodEnum
  discountInterestMonth?: number
  discountOther?: number
  otherExpenses?: IRefinanceExpense[]
}

export interface IRefinanceMakeAContractPayload {
  annualInterestRate: number
  installmentCount: number
  interestType: TInterestType
}
