import type { TAssetAssessmentStatus } from '@/enums/modules/contract/AssetAssessmentStatus.enum'
import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetContractList extends IBasePaginationRequest {
  status?: TContractStatus
  assetStatus?: TAssetAssessmentStatus
  loanTypeId?: number
}

export interface ICreateContractPayload {}

export interface IUpdateContractPayload extends Partial<ICreateContractPayload> {}
export interface IActionContractPayload extends ICreateContractPayload {}
