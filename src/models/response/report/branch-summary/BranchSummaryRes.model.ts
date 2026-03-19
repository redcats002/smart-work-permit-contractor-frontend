import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

export interface IBranchSummaryReportList extends IEntity {
  branchNo: string
  branchName: string
  createdAt: string
  openedTime: string
}


export interface TGetBranchSummaryReportListResponse extends IBasePaginationResponse<IBranchSummaryReportList> {}
export interface TActionBranchSummaryReport extends IBaseSuccessResponse<boolean> {}
