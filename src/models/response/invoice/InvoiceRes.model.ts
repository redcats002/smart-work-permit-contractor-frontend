import type { IEntity } from '@/models/Global.model'
import type { TTitleName } from '@/enums/TitleName.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IInvoiceCustomer {
  id: number | null
  titleName: TTitleName | null
  firstName: string | null
  lastName: string | null
}

export interface IInvoiceList extends IEntity {
  contractId: number | null
  contractIdNo: string | null
  invoiceDate: string | null
  customer: IInvoiceCustomer | null
  totalValue: number | null
}

export type TGetInvoiceListResponse = IBasePaginationResponse<IInvoiceList>
export type TActionInvoice = IBaseSuccessResponse<boolean>
