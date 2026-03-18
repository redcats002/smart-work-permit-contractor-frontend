import type { IBasePaginationRequest } from '../Request.model'

export interface ICreateInvoicePayload {
  name: string
  qty: number
  amount: number
  isMain: boolean
}

export interface IGetInvoiceList extends IBasePaginationRequest {}
