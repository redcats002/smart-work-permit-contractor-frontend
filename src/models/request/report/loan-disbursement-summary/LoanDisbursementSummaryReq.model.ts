import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetLoanDisbursementSummaryList extends IBasePaginationRequest {
  startDate?: string
  endDate?: string
  branchId?: number
}
