import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

export interface IFinancialSummaryReportList extends IEntity {
  branchName: string
  income: number | null
  loan: number
  expenses: number | null
}


export interface TGetFinancialSummaryReportListResponse extends IBasePaginationResponse<IFinancialSummaryReportList> {}
export interface TActionFinancialSummaryReport extends IBaseSuccessResponse<boolean> {}
