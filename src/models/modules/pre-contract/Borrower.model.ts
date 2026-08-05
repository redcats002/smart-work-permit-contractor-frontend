import type { IAddressRequest } from '@/models/request/AddressReq.model'

export interface IBorrowerList {
  isMain: boolean
  customer: IBorrowerCustomerList
}

export interface IBorrowerCustomerList {
  id: number
  idNo: string
  idCard: string
  email?: string
  firstName: string
  lastName: string
  fullName: string
  birthDate?: string
  mainAddress?: IAddressRequest
}
