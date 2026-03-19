import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../../Response.model'

export interface IContractSecurityDocumentReportList extends IEntity {
  branchName: string
  contractAmount: number
  accountClosedAmount: number
  remainingAmount: number
  landTitleDeedAmount: number
  ns3gor: number
  ns3: number
  car: number
  motorcycle: number
}


export interface TGetContractSecurityDocumentReportListResponse extends IBasePaginationResponse<IContractSecurityDocumentReportList> {}
export interface TActionContractSecurityDocumentReport extends IBaseSuccessResponse<boolean> {}
