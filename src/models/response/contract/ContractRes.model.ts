import type { IBaseModel, IEntity } from '@/models/Global.model'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TEstateAssessmentStatus } from '@/enums/modules/contract/EstateAssessmentStatus.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IContractCustomer {
  id: number | null
  titleName: string | null
  firstName: string | null
  lastName: string | null
}

export interface IContractCustomerDetail extends IContractCustomer {
  idNo: string | null
  idCard: string | null
  birthDate: string | null
  customerGroup: IBaseModel | null
  occupation: IBaseModel | null
  email: string | null
  phoneNumber: string | null
  phoneNumber2: string | null
}

export interface IContractStaff {
  id: number | null
  titleName: string | null
  firstName: string | null
  lastName: string | null
}

export interface ICollateralImage {
  id: number | null
  url: string
  name: string
}

export interface ICollateralDetailInfo extends IEntity {
  collateralType: string | null
  detail: string | null
  address: string | null
  subDistrict: string | null
  district: string | null
  province: string | null
  postCode: string | null
  urlGoogleMap: string | null
  // vehicle-specific
  licensePlate: string | null
  vehicleProvince: string | null
  yearManufactured: number | null
  yearRegistered: number | null
  chassisNumber: string | null
  mileage: number | null
  // land-specific
  landNumber: string | null
  surveyPageNumber: string | null
  landLocation: string | null
  aerialPhotoNumber: string | null
  aerialPhotoSheet: string | null
  areaRai: number | null
  areaRgan: number | null
  areaTarangWa: number | null
  images: ICollateralImage[]
}

export interface IContractLoanType {
  id: number | null
  name: string
}

export interface IContractList extends IEntity {
  contractDate: string | null
  startDate: string | null
  endDate: string | null
  amount: number | null
  status: TContractStatus | null
  collateralStatus: TEstateAssessmentStatus | null
  customer: IContractCustomer | null
  loanType: IContractLoanType | null
}

export interface IContractById extends IEntity {
  contractDate: string | null
  startDate: string | null
  endDate: string | null
  amount: number | null
  status: TContractStatus | null
  collateralStatus: TEstateAssessmentStatus | null
  customer: IContractCustomerDetail | null
  loanType: IContractLoanType | null
  staff: IContractStaff | null
  collaterals: ICollateralDetailInfo[]
}

export type TGetContractListResponse = IBasePaginationResponse<IContractList>
export type TGetContractByIdResponse = IBaseSuccessResponse<IContractById>
export type TActionContract = IBaseSuccessResponse<boolean>
