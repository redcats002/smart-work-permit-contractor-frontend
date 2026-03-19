import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetDailyLoanDisbursementList extends IBasePaginationRequest {
  paymentTypeId?: number
  categoryId?: number
}
