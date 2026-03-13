import type { IEntity } from '@/models/Global.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IReceiptCustomer {
  id: number | null
  idCard: string
  titleName: TTitleName
  firstName: string
  lastName: string
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
}

export type TGetReceiptListResponse = IBasePaginationResponse<IReceiptList>
export type TGetReceiptDetailResponse = IBaseSuccessResponse<IReceiptById>
export type TActionReceipt = IBaseSuccessResponse<boolean>
