import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetDailyLoanDisbursementList extends IBasePaginationRequest {
  branchId?: string
  startDate?: string
  endDate?: string
}
