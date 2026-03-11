import type { TCollateralAssessmentStatus } from '@/enums/modules/contract/CollateralAssessmentStatus.enum'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { IBasePaginationRequest } from '../Request.model'

export type TContractTab = 'COLLATERAL' | 'CONTRACT'

export interface IGetContractList extends IBasePaginationRequest {
  status?: TContractStatus
  collateralStatus?: TCollateralAssessmentStatus
  loanTypeId?: number
  tab?: TContractTab
}

export interface ICollateralItem {
  collateralType: string
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
  collateralStatus: TCollateralAssessmentStatus
  collaterals: ICollateralItem[]
}

export interface IUpdateContractPayload extends Partial<ICreateContractPayload> {}
export interface IActionContractPayload extends ICreateContractPayload {}
