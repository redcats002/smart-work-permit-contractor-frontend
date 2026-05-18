import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

export interface IBranchSummaryReportList extends IEntity {
  idNo: string
  name: string
  openAt: string
  duration: string
}

export interface TGetBranchSummaryReportListResponse extends IBasePaginationResponse<IBranchSummaryReportList> {}
export interface TActionBranchSummaryReport extends IBaseSuccessResponse<boolean> {}
