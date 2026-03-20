import type { IEntity, TBaseModel } from '@/models/Global.model'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import type { TAssetType } from '@/enums/modules/contract/AssetType.enum'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TCustomerStatus } from '@/enums/modules/customer/CustomerStatus.enum'
import type { TEstateStatus } from '@/enums/modules/estate/EstateStatus.enum'
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
  customerGroup: TBaseModel
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
  contractedAt: string
  loanAmount: number
  firstInstallmentDate: string
  finalInstallmentDate: string
  status: TContractStatus
  contractLoanType: TBaseModel
  isLate: boolean
}
export interface ICustomerPaymentHistoryList extends IEntity {
  paymentMethod: TBaseModel
  paymentAmount: number
}
export interface ICustomerContactHistoryList extends IEntity {
  contactAt: string
  topic: string
  note: string
  contract: TBaseModel
  employee: IEmployeeList
}
export interface ICustomerEstateList extends IEntity {
  type: TAssetType
  detail: string
  status: TEstateStatus
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
export type TGetCustomerEstateListResponse = IBasePaginationResponse<ICustomerEstateList>

export type TGetCustomerDocumentByIdResponse = IBaseSuccessResponse<ICustomerDocumentById>
export type TGetCustomerDocumentListResponse = IBasePaginationResponse<ICustomerDocumentById>
