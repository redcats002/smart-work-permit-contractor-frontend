import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetDailySummaryDetailList {
  monthly: Date | string
}

export interface IGetDailySummaryDetailListRequest extends IBasePaginationRequest {}
