import type { TContractStatus } from '@/enums/modules/contract/ContractStatus.enum'
import type { PreContractFormValues } from '@/pages/contract/pages/create/schema/pre-contract.schema'
import type { AppraisalPriceFormValues } from '@/pages/contract/pages/pre-contract-detail/schema/appraisal-price.schema'
import type { AssetValuationFormValues } from '@/pages/contract/pages/pre-contract-detail/schema/asset-valuation.schema'
import type { ConfirmAppraisalFormValues } from '@/pages/contract/pages/pre-contract-detail/schema/confirm-appraisal.schema'
import type { InstallmentFormValues } from '@/pages/contract/pages/pre-contract-detail/schema/installment.schema'
import type { MortgageFormValues } from '@/pages/contract/pages/pre-contract-detail/schema/mortgage.schema'
import type { PreAssetUpdateValues } from '@/pages/contract/pages/pre-contract-detail/schema/pre-asset.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IGetPreContractList extends IBasePaginationRequest {
  status?: TContractStatus
  loanTypeId?: number
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
export interface IMakeAContractPayload extends Omit<InstallmentFormValues, 'loanAmount' | 'lateFee'> {}
