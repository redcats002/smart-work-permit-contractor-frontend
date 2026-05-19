import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetCurrentComparativeList extends IBasePaginationRequest {
  branchId?: number
  date?: string
}
