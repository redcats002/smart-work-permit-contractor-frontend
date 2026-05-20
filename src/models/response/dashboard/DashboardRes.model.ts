import type { IBaseSuccessResponse } from '@/models/response/Response.model'

export interface IDashboardCardData {
  daily: number
  cash: number
  bankTransfer: number
  totalOutstanding: number
  outstandingPrincipal: number
  outstandingInterest: number
}

export interface IDashboardChartItem {
  id: number
  name: string
  total: number
  percent: number
}

export interface IDashboardChartData {
  total: number
  items: IDashboardChartItem[]
}

export type TDashboardCardResponse = IBaseSuccessResponse<IDashboardCardData>
export type TDashboardChartResponse = IBaseSuccessResponse<IDashboardChartData>
