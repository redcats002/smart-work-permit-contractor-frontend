import type { TReceiptPaymentMethod } from '@/models/response/receipt/PaymentMethod.enum'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetReceiptList extends IBasePaginationRequest {}

export interface IReceiptInstallmentPayload {
  id: number
  discountPenaltyFee: number
  amount: number
}

export interface IReceiptContractPayload {
  id: number
  installments: IReceiptInstallmentPayload[]
}

export interface ICreateReceiptPayload {
  paymentType: TReceiptPaymentMethod
  customerId: number
  contracts: IReceiptContractPayload[]
}
