import type { ILeaderBranchReportItem, ILeaderBranchReportSummary } from '@/models/response/leader-branch-report/LeaderBranchReportRes.model'
import type { IBasePaginationResponse } from '../../Response.model'

export type IBranchHeadSummaryList = ILeaderBranchReportItem

export interface TGetBranchHeadSummaryListResponse extends IBasePaginationResponse<IBranchHeadSummaryList> {
  summary?: ILeaderBranchReportSummary
}
