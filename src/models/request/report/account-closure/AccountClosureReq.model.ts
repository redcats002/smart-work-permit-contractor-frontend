import type { TAssetType } from '@/enums/modules/asset/AssetType.enum'
import type { IBasePaginationRequest } from '../../Request.model'
import type { TReceiptType } from '@/enums/modules/finance/receipt/ReceiptType.enum'

export interface IGetAccountClosureList extends IBasePaginationRequest {
  receiptType?: TReceiptType
  assetType?: TAssetType
}
