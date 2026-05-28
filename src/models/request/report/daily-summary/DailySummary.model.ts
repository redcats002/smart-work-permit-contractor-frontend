import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetDailySummaryList extends IBasePaginationRequest {
  startDate?: string
  endDate?: string
}

export interface ICreateDailySummary {
  reason?: string
}
