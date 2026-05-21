import type { TBaseModel } from '@/models/Global.model'
import type { IBaseSuccessResponse } from '../../Response.model'

export interface IRankLoanItem {
  branch: TBaseModel
  paidAmount: number
  totalAmount: number
  topCount: number
  percent: number
}

export type TGetRankLoanListResponse = IBaseSuccessResponse<IRankLoanItem[]>
