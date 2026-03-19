import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

export interface IRankLoanList extends IEntity {
  branchName: string
  branchIdNo: string
  totalReceived: number
  rankedInTopTimes: number
}

export type TGetRankLoanListResponse = IBasePaginationResponse<IRankLoanList>
export type TActionRankLoanInstallment = IBaseSuccessResponse<boolean>
