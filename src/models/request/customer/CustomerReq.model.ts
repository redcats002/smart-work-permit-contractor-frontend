import type { TCustomerStatus } from '@/enums/modules/customer/CustomerStatus.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IAddressRequest } from '../AddressReq.model'
import type { IBasePaginationRequest } from '../Request.model'

export interface IActionCustomerPayload extends ICreateCustomerPayload, IUpdateCustomerPayload {}
export interface ICreateCustomerPayload {
  status: TCustomerStatus
  idCard: string
  titleName: TTitleName
  firstName: string
  lastName: string
  birthDate: string
  customerGroupId?: number
  occupationId?: number
  phoneNumber: string
  phoneNumber2?: string
  email?: string
  workAddress: IAddressRequest
  mainAddress: IAddressRequest
  currentAddress: IAddressRequest
}
export interface IUpdateCustomerPayload extends ICreateCustomerPayload {}

export interface IGetCustomerList extends IBasePaginationRequest {}
export interface IGetCustomerContractList extends IBasePaginationRequest {}
export interface IGetCustomerPaymentHistoryList extends IBasePaginationRequest {}
export interface IGetCustomerContactHistoryList extends IBasePaginationRequest {}
export interface IGetCustomerEstateList extends IBasePaginationRequest {}
