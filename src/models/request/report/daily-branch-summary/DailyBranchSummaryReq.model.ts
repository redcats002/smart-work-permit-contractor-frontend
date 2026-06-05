import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetDailyBranchSummaryList extends IBasePaginationRequest {
  branchId?: string
  startDate?: string
  endDate?: string
}
