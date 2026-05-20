import type { IBasePaginationResponse } from '../../Response.model'

export interface IContractSecurityDocumentReportList {
  id: string
  branchName: string
  contractAmount: number
  contractCloseAmount: number
  contractPendingAmount: number
  assetLandAmount: number
  ns3Amount: number
  ns3kAmount: number
  vehicle: number
  motorcycle: number
}

export interface IContractSecurityDocumentReportSummary {
  contractAmount: number
  contractCloseAmount: number
  contractPendingAmount: number
  assetLandAmount: number
  ns3Amount: number
  ns3kAmount: number
  vehicle: number
  motorcycle: number
}

export interface TGetContractSecurityDocumentReportListResponse extends IBasePaginationResponse<IContractSecurityDocumentReportList> {
  summary: IContractSecurityDocumentReportSummary
}
