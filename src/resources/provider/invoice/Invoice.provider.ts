import type { ICreateInvoicePayload, IGetInvoiceList } from '@/models/request/invoice/InvoiceReq.model'
import type {
  TActionInvoice,
  TGetInvoiceByIdResponse,
  TGetInvoiceInstallmentByIdResponse,
  TGetInvoiceListResponse
} from '@/models/response/invoice/InvoiceRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IInvoiceProvider {
  getInvoicePaginate(query: IGetInvoiceList): Promise<TGetInvoiceListResponse>
  getInvoiceById (invoiceId: TBaseParamsId): Promise<TGetInvoiceByIdResponse>
  getInvoiceInstallmentById (installmentId: TBaseParamsId): Promise<TGetInvoiceInstallmentByIdResponse>
  createInvoice (id: TBaseParamsId, payload: ICreateInvoicePayload[]): Promise<TActionInvoice>
  deleteInvoice(id: TBaseParamsId): Promise<TActionInvoice>
}

class InvoiceProvider extends HttpRequest implements IInvoiceProvider {
  private urlPrefix: string = '/api/v1/management/invoice'

  public async getInvoicePaginate (query: IGetInvoiceList): Promise<TGetInvoiceListResponse> {
    this.setLogHeaders({ menu: 'DOCUMENT-FINANCE', subMenu: 'ใบแจ้งหนี้' })
    return this.get(this.urlPrefix, query)
  }

  public async getInvoiceById (invoiceId: TBaseParamsId): Promise<TGetInvoiceByIdResponse> {
    this.setLogHeaders({ menu: 'DOCUMENT-FINANCE', subMenu: 'ใบแจ้งหนี้' })
    return this.get(`${this.urlPrefix}/${invoiceId}`)
  }

  public async getInvoiceInstallmentById (installmentId: TBaseParamsId): Promise<TGetInvoiceInstallmentByIdResponse> {
    this.setLogHeaders({ menu: 'DOCUMENT-FINANCE', subMenu: 'ใบแจ้งหนี้' })
    return this.get(`${this.urlPrefix}/${installmentId}/installment`)
  }

  public async createInvoice (id: TBaseParamsId, payload: ICreateInvoicePayload[]): Promise<TActionInvoice> {
    this.setLogHeaders({ menu: 'DOCUMENT-FINANCE', subMenu: 'ใบแจ้งหนี้' })
    return this.post(`${this.urlPrefix}/${id}`, { item: payload })
  }

  public async deleteInvoice (id: TBaseParamsId): Promise<TActionInvoice> {
    this.setLogHeaders({ menu: 'DOCUMENT-FINANCE', subMenu: 'ใบแจ้งหนี้' })
    return this.delete(`${this.urlPrefix}/${id}`)
  }
}

export default InvoiceProvider
