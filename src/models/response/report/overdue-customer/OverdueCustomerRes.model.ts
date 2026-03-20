import type { IEntity } from '@/models/Global.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

interface IOverdueCustomerContract {
  id: number
  idNo: string
}

interface ICustomerCustomerCustomer {
  id: number
  titleName: TTitleName
  firstName: string
  lastName: string
}

export interface IOverdueCustomerList extends IEntity {
  createdAt: string
  dueDate: string
  contract: IOverdueCustomerContract
  customer: ICustomerCustomerCustomer
  totalAmount: number
  totalAmountNet: number
  paidAmount: number
  remainAmount: number
  latestPaymentDate: string
  outstanding: number
  installmentAmount: number
}

export interface IOverdueCustomerSummary {
  customer: number
  totalAmount: number
  totalAmountNet: number
  paidAmount: number
  outstanding: number
}

export interface IOverdueCustomerById extends IEntity {
  name: string
  taxId: string
  openAt: string
  address: string
  district: string
  subDistrict: string
  province: string
  postCode: string
}

export type TGetOverdueCustomerListResponse = IBasePaginationResponse<IOverdueCustomerList>
export type TActionOverdueCustomer = IBaseSuccessResponse<boolean>
