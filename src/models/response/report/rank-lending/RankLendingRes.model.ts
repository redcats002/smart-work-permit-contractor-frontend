import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

export interface IRankLendingList extends IEntity {
  branchName: string
  branchIdNo: string
  totalReceived: number
  rankedInTopTimes: number
}

export type TGetRankLendingListResponse = IBasePaginationResponse<IRankLendingList>
export type TActionRankLendingInstallment = IBaseSuccessResponse<boolean>
