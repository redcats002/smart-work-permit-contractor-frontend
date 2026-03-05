import type { IEntity, TBaseModel, TBaseOption } from '@/models/Global.model'
import type { IAddressRequest, ICurrentAddressRequest, IWorkAddressRequest } from '@/models/request/AddressReq.model'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TCustomerStatus } from '@/enums/modules/customer/CustomerStatus.enum'
import type { TEstateStatus } from '@/enums/modules/estate/EstateStatus.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { ICustomerGroupList } from '../customer-group/CustomerGroupRes.model'
import type { IJobList } from '../job/JobRes.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface ICustomerList extends IEntity {
  titleName: TTitleName
  firstName: string
  lastName: string
  phoneNumber: string
  phoneNumber2?: string
  customerGroup: TBaseOption
  customerStatus: TCustomerStatus
}
export interface ICustomerById extends ICurrentAddressRequest, IAddressRequest, IWorkAddressRequest {
  customerStatus: TCustomerStatus
  citizenId: string
  titleName: TTitleName
  firstName: string
  lastName: string
  phoneNumber: string
  phoneNumber2?: string
  birthDate: string
  customerGroup?: ICustomerGroupList
  job?: IJobList
  email?: string
}

export interface ICustomerContractList extends IEntity {
  contractType: TBaseModel
  loanLimit: number
  contractStartAt?: string
  contractEndAt?: string
  contractStatus: TContractStatus
  isLate: boolean
}
export interface ICustomerPaymentHistoryList extends IEntity {
  paymentMethod: TBaseModel
  paymentAmount: number
}
export interface ICustomerContactHistoryList extends IEntity {
  contractIdNo: string
  subject: string
  detail: string
}
export interface ICustomerEstateList extends IEntity {
  contractIdNo: string
  estateType: TBaseModel
  storage: string
  estateStatus: TEstateStatus
}

export type TGetCustomerListResponse = IBasePaginationResponse<ICustomerList>
export type TGetCustomerByIdResponse = IBaseSuccessResponse<ICustomerById>
export type TActionCustomer = IBaseSuccessResponse<boolean>

export type TGetCustomerContractListResponse = IBasePaginationResponse<ICustomerContractList>
export type TGetCustomerPaymentHistoryListResponse = IBasePaginationResponse<ICustomerPaymentHistoryList>
export type TGetCustomerContactHistoryListResponse = IBasePaginationResponse<ICustomerContactHistoryList>
export type TGetCustomerEstateListResponse = IBasePaginationResponse<ICustomerEstateList>
