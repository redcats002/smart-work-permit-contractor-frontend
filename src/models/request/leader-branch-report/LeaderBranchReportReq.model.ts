import type { IBasePaginationRequest } from '../Request.model'

export enum EReportPeriod {
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year'
}

export type TReportPeriod = keyof typeof EReportPeriod

export interface IGetLeaderBranchReportList extends IBasePaginationRequest {
  branchId?: string
  period?: EReportPeriod
  date?: string
}
