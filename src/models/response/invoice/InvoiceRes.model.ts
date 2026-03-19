import type { IEntity } from '@/models/Global.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IInvoiceCustomer {
  id: number
  idCard: string
  idNo?: string
  titleName?: TTitleName
  firstName: string
  lastName: string
  fullName?: string
  mainAddress: {
    address: string
    subDistrict: string
    district: string
    province: string
    postCode: string
  }
}

export interface IInvoiceList extends IEntity {
  contract: {
    id: number
    idNo: string
    customer: IInvoiceCustomer
  }
  totalAmount: number | null
}

export interface IInvoiceDetailItems {
  name: string
  qty: number
  isMain: boolean
  amount: number
}

export interface IInvoiceContractInstallment {
  id: number
  dueDate: string
}
export interface IInvoiceDetail extends IEntity, IInvoiceList {
  idNo: string
  contractInstallment: IInvoiceContractInstallment
  items: IInvoiceDetailItems[]
}

export interface IInvoiceBranch {
  id: string
  taxId: string
  name: string
  address: string
  subDistrict: string
  district: string
  province: string
  postCode: string
  logo: string | null
}

export interface IInoviceInstallmentContract {
  id: number
  idNo: string
  customer: IInvoiceCustomer
  branch: IInvoiceBranch
}
export interface IInvoiceInstallment {
  contractInstallment: IInvoiceContractInstallment
  contract: IInoviceInstallmentContract
  items: IInvoiceDetailItems[]
}

export type TGetInvoiceListResponse = IBasePaginationResponse<IInvoiceList>
export type TGetInvoiceByIdResponse = IBaseSuccessResponse<IInvoiceDetail>
export type TGetInvoiceInstallmentByIdResponse = IBaseSuccessResponse<IInvoiceInstallment>
export type TActionInvoice = IBaseSuccessResponse<boolean>
