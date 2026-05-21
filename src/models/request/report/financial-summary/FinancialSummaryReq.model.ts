import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetFinancialSummaryReportList extends IBasePaginationRequest {
  branchId?: string
}
