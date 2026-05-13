import type { IBasePaginationRequest } from '../Request.model'

export interface IGetActionLogList extends IBasePaginationRequest {
  branchId?: number
  startDate?: string
  endDate?: string
}
