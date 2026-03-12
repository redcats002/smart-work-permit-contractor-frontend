import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TEstateAssessmentStatus } from '@/enums/modules/contract/EstateAssessmentStatus.enum'
import type { TEstateType } from '@/enums/modules/contract/EstateType.enum'
import type { IBasePaginationRequest } from '../Request.model'

export type TContractTab = 'COLLATERAL' | 'CONTRACT'

export interface IGetContractList extends IBasePaginationRequest {
  status?: TContractStatus
  collateralStatus?: TEstateAssessmentStatus
  loanTypeId?: number
  tab?: TContractTab
}

export interface IEstateItem {
  estateType: TEstateType
  detail?: string
  // Land fields
  address?: string
  subDistrict?: string
  district?: string
  province?: string
  postCode?: string
  urlGoogleMap?: string
  landNumber?: string
  surveyPageNumber?: string
  landLocation?: string
  aerialPhotoNumber?: string
  aerialPhotoSheet?: string
  areaRai?: number | null
  areaRgan?: number | null
  areaTarangWa?: number | null
  // Vehicle fields
  brand?: string
  vehicleModel?: string
  color?: string
  licensePlate?: string
  vehicleProvince?: string
  yearManufactured?: number | null
  yearRegistered?: number | null
  chassisNumber?: string
  engineNumber?: string
  mileage?: number | null
}

export interface ICreateContractPayload {
  customerId: number
  estateStatus: TEstateAssessmentStatus
  estates: IEstateItem[]
}

export interface IUpdateContractPayload extends Partial<ICreateContractPayload> {}
export interface IActionContractPayload extends ICreateContractPayload {}
