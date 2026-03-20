import type { IEntity } from '@/models/Global.model'
import type { IBranchList } from '../../branch/BranchRes.model'
import type { IBasePaginationResponse } from '../../Response.model'

export interface IAmountAndPercent {
  amount: number
  percent: number
}

export interface IAnnualFinanceReceiptList extends IEntity {
  branch: IBranchList
  january: IAmountAndPercent
  february: IAmountAndPercent
  march: IAmountAndPercent
  april: IAmountAndPercent
  may: IAmountAndPercent
  june: IAmountAndPercent
  july: IAmountAndPercent
  august: IAmountAndPercent
  september: IAmountAndPercent
  october: IAmountAndPercent
  november: IAmountAndPercent
  december: IAmountAndPercent
  total: IAmountAndPercent
}
export interface IAnnualFinanceReceiptSummary {
  numberOfBranches: number
  january: IAmountAndPercent
  february: IAmountAndPercent
  march: IAmountAndPercent
  april: IAmountAndPercent
  may: IAmountAndPercent
  june: IAmountAndPercent
  july: IAmountAndPercent
  august: IAmountAndPercent
  september: IAmountAndPercent
  october: IAmountAndPercent
  november: IAmountAndPercent
  december: IAmountAndPercent
  total: IAmountAndPercent
}

export interface TGetAnnualFinanceReceiptListResponse extends IBasePaginationResponse<IAnnualFinanceReceiptList>, IAnnualFinanceReceiptSummary {}
