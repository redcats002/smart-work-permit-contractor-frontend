import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetPercentInstallmentList extends IBasePaginationRequest {
  branchId?: number
  date?: string
}
