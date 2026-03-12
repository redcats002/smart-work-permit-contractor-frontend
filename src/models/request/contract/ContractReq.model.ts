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
  detail: string
  address: string
  subDistrict: string
  district: string
  province: string
  postCode: string
  urlGoogleMap: string
}

export interface ICreateContractPayload {
  customerId: number
  estateStatus: TEstateAssessmentStatus
  estates: IEstateItem[]
}

export interface IUpdateContractPayload extends Partial<ICreateContractPayload> {}
export interface IActionContractPayload extends ICreateContractPayload {}
