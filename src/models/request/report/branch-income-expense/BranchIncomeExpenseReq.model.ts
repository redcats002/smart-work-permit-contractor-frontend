import type { TReportType } from '@/enums/modules/report/branch-income-expense/ReportType.enum'
import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetBranchIncomeExpenseList extends IBasePaginationRequest {
  filter?: TReportType
}
