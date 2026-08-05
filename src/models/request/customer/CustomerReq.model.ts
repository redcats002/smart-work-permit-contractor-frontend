import type { TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'
import type { TAssetType } from '@/enums/modules/asset/AssetType.enum'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TContractTopic } from '@/enums/modules/contract/ContractTopic.enum'
import type { TPaymentMethod } from '@/enums/modules/contract/PaymentMethod.enum'
import type { TCustomerStatus } from '@/enums/modules/customer/CustomerStatus.enum'
import type { TPersonalType } from '@/enums/modules/customer/PersonalType.enum'
import type { CustomerFormValues } from '@/pages/customer/pages/create/schema/customer.schema'
import type { IBasePaginationRequest } from '../Request.model'

// titleName/lastName/birthDate/occupationId/currentAddress/workAddress are omitted from the payload for CORPORATE customers
type TCorporateOmittedFields = 'titleName' | 'lastName' | 'birthDate' | 'occupationId' | 'currentAddress' | 'workAddress'

export interface IActionCustomerPayload extends ICreateCustomerPayload, IUpdateCustomerPayload {}
export interface ICreateCustomerPayload extends Omit<CustomerFormValues, TCorporateOmittedFields> {
  titleName?: CustomerFormValues['titleName']
  lastName?: CustomerFormValues['lastName']
  birthDate?: CustomerFormValues['birthDate']
  occupationId?: CustomerFormValues['occupationId']
  currentAddress?: CustomerFormValues['currentAddress']
  workAddress?: CustomerFormValues['workAddress']
}
export interface IUpdateCustomerPayload extends ICreateCustomerPayload {}

export interface IGetCustomerList extends Omit<IBasePaginationRequest, 'status'> {
  personalType?: TPersonalType
  status?: TCustomerStatus
  customerGroupId?: number
}
export interface IGetCustomerContractList extends Omit<IBasePaginationRequest, 'status'> {
  status?: TContractStatus
}
export interface IGetCustomerPaymentHistoryList extends IBasePaginationRequest {
  paymentType?: TPaymentMethod
}
export interface IGetCustomerContactHistoryList extends IBasePaginationRequest {
  employeeId?: string
  topic?: TContractTopic
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
