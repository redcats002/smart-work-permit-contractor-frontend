import type { IEntity, TBaseModel } from '@/models/Global.model'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TEmployeeStatus } from '@/enums/modules/employee/EmployeeStatus.enum'
import type { TEstateStatus } from '@/enums/modules/estate/EstateStatus.enum'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IEmployeeList extends IEntity {
  titleName: TTitleName
  firstName: string
  lastName: string
  phoneNumber: string
  phoneNumber2?: string
  status: TEmployeeStatus
}
export interface IEmployeeById extends IEntity {
  status: TEmployeeStatus
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
  email?: string
}

export interface IEmployeeContractList extends IEntity {
  contractType: TBaseModel
  loanLimit: number
  contractStartAt?: string
  contractEndAt?: string
  contractStatus: TContractStatus
  isLate: boolean
}
export interface IEmployeePaymentHistoryList extends IEntity {
  paymentMethod: TBaseModel
  paymentAmount: number
}
export interface IEmployeeContactHistoryList extends IEntity {
  contractIdNo: string
  subject: string
  detail: string
}
export interface IEmployeeEstateList extends IEntity {
  contractIdNo: string
  estateType: TBaseModel
  storage: string
  estateStatus: TEstateStatus
}

export type TGetEmployeeListResponse = IBasePaginationResponse<IEmployeeList>
export type TGetEmployeeByIdResponse = IBaseSuccessResponse<IEmployeeById>
export type TActionEmployee = IBaseSuccessResponse<boolean>

export type TGetEmployeeContractListResponse = IBasePaginationResponse<IEmployeeContractList>
export type TGetEmployeePaymentHistoryListResponse = IBasePaginationResponse<IEmployeePaymentHistoryList>
export type TGetEmployeeContactHistoryListResponse = IBasePaginationResponse<IEmployeeContactHistoryList>
export type TGetEmployeeEstateListResponse = IBasePaginationResponse<IEmployeeEstateList>
