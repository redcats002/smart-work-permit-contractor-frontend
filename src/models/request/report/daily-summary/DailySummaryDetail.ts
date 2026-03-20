import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetDailySummaryDetailList {
  monthly?: string
}

export interface IGetDailySummaryDetailListRequest extends IGetDailySummaryDetailList, IBasePaginationRequest {}
