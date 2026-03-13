import type { IEntity } from '@/models/Global.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IInvoiceCustomer {
  id: number
  idCard: string
  titleName: TTitleName
  firstName: string
  lastName: string
}

export interface IInvoiceList extends IEntity {
  contractId: number | null
  invoiceNo: string | null
  contractNo: string | null
  invoiceDate: string | null
  customer: IInvoiceCustomer | null
  totalValue: number | null
}

export interface IInvoiceDetailItems {
  detail: string
  amount: number
  price: number
  new?: boolean
}
export interface IInvoiceDetail extends IEntity {
  contractId: number | null
  invoiceNo: string | null
  contractNo: string | null
  dateOfPayment: string | null
  dueDate: string | null
  branch: string | null
  customer: IInvoiceCustomer
  address: string
  subDistrict: string
  district: string
  province: string
  postCode: string
  totalValue: number | null
  items: IInvoiceDetailItems[]
}

export type TGetInvoiceListResponse = IBasePaginationResponse<IInvoiceList>
export type TGetInvoiceByIdResponse = IBaseSuccessResponse<IInvoiceDetail>
export type TActionInvoice = IBaseSuccessResponse<boolean>
