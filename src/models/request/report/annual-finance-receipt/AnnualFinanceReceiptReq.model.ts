import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetAnnualFinanceReceiptList extends IBasePaginationRequest {
  branchId?: number
  year?: string
}
