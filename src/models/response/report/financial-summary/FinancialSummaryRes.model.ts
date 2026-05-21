import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse } from '../../Response.model'

export interface IFinancialSummaryReportList extends IEntity {
  branchName: string
  income: number
  principal: number
  expenses: number
}

export interface IFinancialSummaryReportSummary {
  income: number
  principal: number
  expenses: number
}

export interface TGetFinancialSummaryReportListResponse extends IBasePaginationResponse<IFinancialSummaryReportList> {
  summary: IFinancialSummaryReportSummary
}
