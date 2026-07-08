import type { EReportPeriod } from '@/models/request/leader-branch-report/LeaderBranchReportReq.model'
import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetBranchHeadSummaryList extends IBasePaginationRequest {
  branchId?: string
  period?: EReportPeriod
  date?: string
}
