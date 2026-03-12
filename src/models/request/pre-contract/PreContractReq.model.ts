import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import type { PreContractFormValues } from '@/pages/contract/pages/create/schema/pre-contract.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetPreContractList extends IBasePaginationRequest {
  status?: TContractStatus
  assetStatus?: TPreContractStatus
  loanTypeId?: number
}

export interface ICreatePreContractPayload extends PreContractFormValues {}

export interface IUpdatePreContractPayload extends Partial<ICreatePreContractPayload> {}
export interface IActionPreContractPayload extends ICreatePreContractPayload {}
