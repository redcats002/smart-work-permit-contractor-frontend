import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetProfitBasedOnActualPaymentList extends IBasePaginationRequest {
  branchId?: string
  startDate?: string
  endDate?: string
}
