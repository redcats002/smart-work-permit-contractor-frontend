import type { IBasePaginationResponse } from '../Response.model'

export interface ILeaderBranchReportItem {
  id: string | null
  branchName: string | null
  monthlyInstallment: number
  percentReceive: number
  receiveAmount: number
  principal: number
}

export interface ILeaderBranchReportSummary {
  id: null
  branchName: null
  monthlyInstallment: number
  percentReceive: number
  receiveAmount: number
  principal: number
}

export type TGetLeaderBranchReportListResponse = IBasePaginationResponse<ILeaderBranchReportItem> & {
  summary: ILeaderBranchReportSummary
}
