import type { TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'
import type { TAssetType } from '@/enums/modules/asset/AssetType.enum'
import type { TPaymentMethod } from '@/enums/modules/contract/PaymentMethod.enum'
import type { TCustomerStatus } from '@/enums/modules/customer/CustomerStatus.enum'
import type { CustomerFormValues } from '@/pages/customer/pages/create/schema/customer.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IActionCustomerPayload extends ICreateCustomerPayload, IUpdateCustomerPayload {}
export interface ICreateCustomerPayload extends CustomerFormValues {}
export interface IUpdateCustomerPayload extends ICreateCustomerPayload {}

export interface IGetCustomerList extends Omit<IBasePaginationRequest, 'status'> {
  status?: TCustomerStatus
  customerGroupId?: number
}
export interface IGetCustomerContractList extends IBasePaginationRequest {}
export interface IGetCustomerPaymentHistoryList extends IBasePaginationRequest {
  paymentMethod?: TPaymentMethod
}
export interface IGetCustomerContactHistoryList extends IBasePaginationRequest {
  userId?: string
}
export interface IGetCustomerEstateList extends IBasePaginationRequest {
  type?: TAssetType
  status?: TAssetStatus
}
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
