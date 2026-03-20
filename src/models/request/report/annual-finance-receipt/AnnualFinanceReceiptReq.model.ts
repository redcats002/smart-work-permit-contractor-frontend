import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetAnnualFinanceReceiptList extends IBasePaginationRequest {
  year?: string
}
