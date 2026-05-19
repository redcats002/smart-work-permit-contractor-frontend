import type { IEntity } from '@/models/Global.model'
import type { TAssetType } from '@/enums/modules/asset/AssetType.enum'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import type { ICustomerList } from '../customer/CustomerRes.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IAssetAppraisalBaseWorkList extends IEntity {
  status: TPreContractStatus
  customer: ICustomerList
  types: TAssetType[]
}

export interface IAssetAppraisalNewWorkList extends IAssetAppraisalBaseWorkList {}
export interface IAssetAppraisalCompleteWorkList extends IAssetAppraisalBaseWorkList {}

export type TGetNewWorkAppraisalListResponse = IBasePaginationResponse<IAssetAppraisalBaseWorkList>
export type TGetCompleteWorkAppraisalListResponse = IBasePaginationResponse<IAssetAppraisalBaseWorkList>

export interface IDebtCollectionContractSummary {
  id: number
  idNo: string
}

export interface IDebtCollectionCustomerSummary extends IEntity {
  firstName: string
  lastName: string
  fullName: string
  phoneNumber: string
}

export interface IDebtCollectionList extends IEntity {
  contract: IDebtCollectionContractSummary
  order: number
  customer: IDebtCollectionCustomerSummary
}

export type TGetDebtCollectionListResponse = IBasePaginationResponse<IDebtCollectionList>
export type TDeferDebtCollectionResponse = IBaseSuccessResponse
