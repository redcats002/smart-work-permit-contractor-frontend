import type { IBasePaginationRequest } from '../Request.model'

export interface IGetAccessLogList extends IBasePaginationRequest {
  branchId?: number
  startDate?: string
  endDate?: string
}
