import type { TBaseModel } from '@/models/Global.model'
import type { IBaseSuccessResponse } from '../../Response.model'

export interface IRankLendingItem {
  branch: TBaseModel
  amount: number
  topCount: number
}

export type TGetRankLendingListResponse = IBaseSuccessResponse<IRankLendingItem[]>
