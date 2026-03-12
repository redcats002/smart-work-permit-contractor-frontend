import type { IEntity } from '@/models/Global.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IReceiptCustomer {
  id: number | null
  titleName: TTitleName | null
  firstName: string | null
  lastName: string | null
}

export interface IReceiptList extends IEntity {
  contractId: number | null
  contractIdNo: string | null
  receiptDate: string | null
  customer: IReceiptCustomer | null
  totalValue: number | null
}

export type TGetReceiptListResponse = IBasePaginationResponse<IReceiptList>
export type TActionReceipt = IBaseSuccessResponse<boolean>
