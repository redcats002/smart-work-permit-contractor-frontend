import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import type { PreContractFormValues } from '@/pages/contract/pages/create/schema/pre-contract.schema'
import type { AppraisalPriceFormValues } from '@/pages/contract/pages/pre-contract-detail/schema/appraisal-price.schema'
import type { AssetValuationFormValues } from '@/pages/contract/pages/pre-contract-detail/schema/asset-valuation.schema'
import type { ConfirmAppraisalFormValues } from '@/pages/contract/pages/pre-contract-detail/schema/confirm-appraisal.schema'
import type { MakeContractFormValues } from '@/pages/contract/pages/pre-contract-detail/schema/make-contract.schema'
import type { MortgageFormValues } from '@/pages/contract/pages/pre-contract-detail/schema/mortgage.schema'
import type { PreAssetUpdateValues } from '@/pages/contract/pages/pre-contract-detail/schema/pre-asset.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetPreContractList extends IBasePaginationRequest {
  status?: TPreContractStatus
  loanTypeId?: number
  branchId?: string
}

export interface ICreatePreContractPayload extends PreContractFormValues {}

export interface IUpdatePreContractPayload extends Partial<ICreatePreContractPayload> {}
export interface IActionPreContractPayload extends ICreatePreContractPayload {}
export interface IRequestAppraisalPayload extends AssetValuationFormValues {}
export interface IRequestReappraisalPayload extends AssetValuationFormValues {}
export interface IConfirmAppraisalPayload extends ConfirmAppraisalFormValues {}
export interface IAppraisalPricePayload extends AppraisalPriceFormValues {}
export interface IConfirmMortgagePayload extends MortgageFormValues {}
export interface IUpdatePreAssetPayload extends PreAssetUpdateValues {}
export interface IMakeAContractPayload extends Omit<MakeContractFormValues, 'loanAmount' | 'lateFee'> {}
