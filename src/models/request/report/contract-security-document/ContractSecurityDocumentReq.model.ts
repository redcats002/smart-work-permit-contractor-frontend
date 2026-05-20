import type { IBasePaginationRequest } from '../../Request.model'


export interface IGetContractSecurityDocumentReportList extends IBasePaginationRequest {
  branchId?: number
  startDate?: string
  endDate?: string
}
