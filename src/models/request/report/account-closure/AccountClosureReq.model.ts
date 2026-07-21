import type { IBasePaginationRequest } from '../../Request.model'

export interface IGetAccountClosureList extends IBasePaginationRequest {
  receiptType?: string
  assetType?: string
}
