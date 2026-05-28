import type { IBaseSuccessResponse } from '../../Response.model'

export interface ISummaryStockList {
  branchId: string
  branchName: string
  headOfficeStock: number
  stockInOtherBranch: number
  stockReceivedFromOtherBranches: number
  branchStock: number
  legalExecutionStock: number
  total: number
  moving: number
  lastTotal: number
}

export type TGetSummaryStockResponse = IBaseSuccessResponse<ISummaryStockList[]>
