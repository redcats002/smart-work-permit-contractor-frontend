import type { IEntity } from '@/models/Global.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IReceiptCustomer {
  id: number | null
  idCard: string
  titleName: TTitleName
  firstName: string
  lastName: string
  birthDate?: string | null
  customerGroup?: { id: number, name: string } | null
  occupation?: { id: number, name: string } | null
  phoneNumber?: string | null
  email?: string | null
}

export interface IReceiptPaymentRow {
  installmentNo: number
  penalty: number
  tracking: number
  lawyer: number
  interest: number
  principal: number
  total: number
}

export interface IReceiptPaymentGroup {
  contractNo: string
  rows: IReceiptPaymentRow[]
}

export interface IReceiptList extends IEntity {
  contractId: number | null
  contractIdNo: string | null
  receiptDate: string | null
  customer: IReceiptCustomer
  totalValue: number | null
}

export interface IReceiptDetailItems {
  detail: string
  price: number
}

export interface IReceiptById extends IEntity {
  contractId: number | null
  receiptNo: string | null
  contractNo: string | null
  dateOfPayment: string | null
  officer: IReceiptCustomer
  branch: string | null
  paymentChannel: string | null
  customer: IReceiptCustomer
  address: string
  subDistrict: string
  district: string
  province: string
  postCode: string
  totalValue: number | null
  items: IReceiptDetailItems[]
  interest: number | null
  principal: number | null
  outstanding: number | null
  paymentGroups: IReceiptPaymentGroup[]
}

export interface IReceiptInstallment extends IEntity {
  status: string
  contractNo: string
  installmentDate: string
  installmentPrice: number
  interest: number
  paid: number
  outstanding: number
}

export type TGetReceiptListResponse = IBasePaginationResponse<IReceiptList>
export type TGetReceiptDetailResponse = IBaseSuccessResponse<IReceiptById>
export type TActionReceipt = IBaseSuccessResponse<boolean>
