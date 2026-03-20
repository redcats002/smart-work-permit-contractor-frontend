import type { IEntity, TBaseModel } from '@/models/Global.model'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TCustomerStatus } from '@/enums/modules/customer/CustomerStatus.enum'
import type { TEstateStatus } from '@/enums/modules/estate/EstateStatus.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { ICustomerGroupList } from '../customer-group/CustomerGroupRes.model'
import type { ICustomerOccupationList } from '../customer-occupation/CustomerOccupationRes.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface ICustomerList extends IEntity {
  titleName: TTitleName
  firstName: string
  lastName: string
  phoneNumber: string
  phoneNumber2?: string
  customerGroup?: TBaseModel
  status: TCustomerStatus
}
export interface ICustomerById extends IEntity {
  status: TCustomerStatus
  idCard: string
  titleName: TTitleName
  firstName: string
  lastName: string
  phoneNumber: string
  phoneNumber2?: string
  birthDate: string
  workAddress: IAddressRequest
  mainAddress: IAddressRequest
  currentAddress: IAddressRequest
  customerGroup?: ICustomerGroupList
  occupation?: ICustomerOccupationList
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
