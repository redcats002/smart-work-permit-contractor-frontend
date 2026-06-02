import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetDailyInstallmentList extends IBasePaginationRequest {
  branchId?: string
  startDate?: string
  endDate?: string
}
