import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

export interface IBranchSummaryReportList extends IEntity {
  branchNo: string
  branchName: string
  createdAt: string
  openedTime: string
}


export type TGetBranchSummaryReportListResponse = IBasePaginationResponse<IBranchSummaryReportList>
export type TActionBranchSummaryReport = IBaseSuccessResponse<boolean>
