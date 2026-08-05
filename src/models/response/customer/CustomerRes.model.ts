import type { IEntity, IEntityId, TBaseModel } from '@/models/Global.model'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import type { TAssetType } from '@/enums/modules/asset/AssetType.enum'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TPaymentMethod } from '@/enums/modules/contract/PaymentMethod.enum'
import type { TCustomerStatus } from '@/enums/modules/customer/CustomerStatus.enum'
import type { TPersonalType } from '@/enums/modules/customer/PersonalType.enum'
import type { TAssetStatus } from '@/enums/modules/asset/AssetStatus.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { ICustomerGroupList } from '../customer-group/CustomerGroupRes.model'
import type { ICustomerOccupationList } from '../customer-occupation/CustomerOccupationRes.model'
import type { IEmployeeList } from '../employee/EmployeeRes.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface ICustomerList extends IEntity {
  titleName: TTitleName
  firstName: string
  lastName: string
  phoneNumber: string
  phoneNumber2?: string
  customerGroup?: TBaseModel
  personalType?: TPersonalType // TODO: need from backend and wait to test
  status: TCustomerStatus
}
export interface ICustomerById extends IEntity {
  status: TCustomerStatus
  personalType: TPersonalType
  idCard: string
  titleName?: TTitleName
  firstName: string
  lastName?: string
  phoneNumber: string
  phoneNumber2?: string
  birthDate?: string
  workAddress?: IAddressRequest
  mainAddress: IAddressRequest
  currentAddress?: IAddressRequest
  customerGroup?: ICustomerGroupList
  occupation?: ICustomerOccupationList
  email?: string
}

export interface ICustomerContractList extends IEntity {
  contractedAt: string
  loanAmount: number
  firstInstallmentDate: string
  finalInstallmentDate: string
  status: TContractStatus
  contractLoanType: TBaseModel
  isLate: boolean
}
export interface ICustomerPaymentHistoryList {
  paidAt: string
  receipt: IEntityId
  contract: IEntityId
  amount: number
  paymentType: TPaymentMethod
}
export interface ICustomerContactHistoryList extends IEntity {
  contactAt: string
  topic: string
  note: string
  contract: TBaseModel
  employee: IEmployeeList
}
export interface ICustomerAssetList extends IEntity {
  type: TAssetType
  detail: string
  status: TAssetStatus
  location: TBaseModel
  contract: TBaseModel
}

export interface ICustomerDocumentById {
  id: number
  name: string
  fileName: string
  image: string
  location: TBaseModel
}

export type TGetCustomerListResponse = IBasePaginationResponse<ICustomerList>
export type TGetCustomerByIdResponse = IBaseSuccessResponse<ICustomerById>
export type TActionCustomer = IBaseSuccessResponse<boolean>

export type TGetCustomerContractListResponse = IBasePaginationResponse<ICustomerContractList>
export type TGetCustomerPaymentHistoryListResponse = IBasePaginationResponse<ICustomerPaymentHistoryList>
export type TGetCustomerContactHistoryListResponse = IBasePaginationResponse<ICustomerContactHistoryList>
export type TGetCustomerAssetListResponse = IBasePaginationResponse<ICustomerAssetList>

export type TGetCustomerDocumentByIdResponse = IBaseSuccessResponse<ICustomerDocumentById>
export type TGetCustomerDocumentListResponse = IBasePaginationResponse<ICustomerDocumentById>
export type TActionCustomerDocument = IBaseSuccessResponse<boolean>
