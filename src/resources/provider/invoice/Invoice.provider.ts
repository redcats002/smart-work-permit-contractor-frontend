import type { IGetInvoiceList } from '@/models/request/invoice/InvoiceReq.model'
import type { TActionInvoice, TGetInvoiceByIdResponse, TGetInvoiceListResponse } from '@/models/response/invoice/InvoiceRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IInvoiceProvider {
  getInvoicePaginate(query: IGetInvoiceList): Promise<TGetInvoiceListResponse>
  getInvoiceById (invoiceId: TBaseParamsId): Promise<TGetInvoiceByIdResponse>
  deleteInvoice(id: TBaseParamsId): Promise<TActionInvoice>
}

class InvoiceProvider extends HttpRequest implements IInvoiceProvider {
  private urlPrefix: string = '/api/v1/invoice'

  public async getInvoicePaginate (query: IGetInvoiceList): Promise<TGetInvoiceListResponse> {
    return this.get(this.urlPrefix, query)
  }

  public async getInvoiceById (invoiceId: TBaseParamsId): Promise<TGetInvoiceByIdResponse> {
    return this.get(`${this.urlPrefix}/${invoiceId}`)
  }

  public async deleteInvoice (id: TBaseParamsId): Promise<TActionInvoice> {
    return this.delete(`${this.urlPrefix}/${id}`)
  }
}

export default InvoiceProvider
