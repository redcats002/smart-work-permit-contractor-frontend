import type { TBaseParamsId } from '@/models/response/Response.model'

export interface IDashboardCardQuery {
  branchId?: TBaseParamsId | null
}

export interface IDashboardChartQuery extends IDashboardCardQuery {
  startDate?: string | null
  endDate?: string | null
}
