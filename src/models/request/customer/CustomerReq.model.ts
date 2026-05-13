import type { TCustomerStatus } from '@/enums/modules/customer/CustomerStatus.enum'
import type { CustomerFormValues } from '@/pages/customer/pages/create/schema/customer.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IActionCustomerPayload extends ICreateCustomerPayload, IUpdateCustomerPayload {}
export interface ICreateCustomerPayload extends CustomerFormValues {}
export interface IUpdateCustomerPayload extends ICreateCustomerPayload {}

export interface IGetCustomerList extends IBasePaginationRequest {
  status?: TCustomerStatus
  customerGroupId?: number
}
export interface IGetCustomerContractList extends IBasePaginationRequest {}
export interface IGetCustomerPaymentHistoryList extends IBasePaginationRequest {}
export interface IGetCustomerContactHistoryList extends IBasePaginationRequest {}
export interface IGetCustomerEstateList extends IBasePaginationRequest {}
export interface IGetCustomerDocumentList extends IBasePaginationRequest {
  customerId?: number
}

export interface ICreateCustomerDocumentPayload {
  name: string
  fileName: string
  image: string
  locationId: number
  customerId: number
}

export interface IUpdateCustomerDocumentPayload {
  name: string
  fileName: string
  image: string
  locationId: number
}
