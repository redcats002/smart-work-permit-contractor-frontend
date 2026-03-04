import type { TCustomerStatus } from '@/enums/modules/customer/CustomerStatus.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IAddressRequest, ICurrentAddressRequest, IWorkAddressRequest } from '../AddressReq.model'
import type { IBasePaginationRequest } from '../Request.model'

export interface IActionCustomerPayload extends ICreateCustomerPayload, IUpdateCustomerPayload {}
export interface ICreateCustomerPayload extends ICurrentAddressRequest, IAddressRequest, IWorkAddressRequest {
  customerStatus: TCustomerStatus
  citizenId: string
  titleName: TTitleName
  firstName: string
  lastName: string
  phoneNumber: string
  phoneNumber2?: string
  birthDate: string
  customerGroupId?: number
  jobId?: number
  email?: string
}
export interface IUpdateCustomerPayload extends ICreateCustomerPayload {}

export interface IGetCustomerList extends IBasePaginationRequest {}
