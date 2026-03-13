import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import type { PreContractFormValues } from '@/pages/contract/pages/create/schema/pre-contract.schema'
import type { AppraisalPriceFormValues } from '@/pages/contract/pages/detail/schema/appraisal-price.schema'
import type { AssetValuationFormValues } from '@/pages/contract/pages/detail/schema/asset-valuation.schema'
import type { InstallmentFormValues } from '@/pages/contract/pages/detail/schema/installment.schema'
import type { MortgageFormValues } from '@/pages/contract/pages/detail/schema/mortgage.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetPreContractList extends IBasePaginationRequest {
  status?: TContractStatus
  assetStatus?: TPreContractStatus
  loanTypeId?: number
}

export interface ICreatePreContractPayload extends PreContractFormValues {}

export interface IUpdatePreContractPayload extends Partial<ICreatePreContractPayload> {}
export interface IActionPreContractPayload extends ICreatePreContractPayload {}
export interface IRequestReappraisalPayload extends AssetValuationFormValues {}
export interface IAppraisalPricePayload extends AppraisalPriceFormValues {}
export interface IConfirmMortgagePayload extends MortgageFormValues {}
export interface IMakeAContractPayload extends InstallmentFormValues {}
