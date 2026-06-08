import type { ICreateReceiptPayload, IGetReceiptList } from '@/models/request/receipt/ReceiptReq.model'
import type {
  TActionReceipt,
  TGetReceiptDetailResponse,
  TGetReceiptInstallmentsResponse,
  TGetReceiptListResponse
} from '@/models/response/receipt/ReceiptRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IReceiptProvider {
  getReceiptPaginate(query: IGetReceiptList): Promise<TGetReceiptListResponse>
  getReceiptById(id: TBaseParamsId): Promise<TGetReceiptDetailResponse>
  deleteReceipt(id: TBaseParamsId): Promise<TActionReceipt>
  createReceipt(payload: ICreateReceiptPayload): Promise<TActionReceipt>
  getInstallmentsByCustomerId(customerId: TBaseParamsId): Promise<TGetReceiptInstallmentsResponse>
}

class ReceiptProvider extends HttpRequest implements IReceiptProvider {
  private urlPrefix: string = '/api/v1/management/receipt'

  public async getReceiptPaginate (query: IGetReceiptList): Promise<TGetReceiptListResponse> {
    this.setLogHeaders({ menu: 'DOCUMENT-FINANCE', subMenu: 'ใบเสร็จรับเงิน' })
    return this.get(this.urlPrefix, query)
  }

  public async getReceiptById (id: TBaseParamsId): Promise<TGetReceiptDetailResponse> {
    this.setLogHeaders({ menu: 'DOCUMENT-FINANCE', subMenu: 'ใบเสร็จรับเงิน' })
    return this.get(`${this.urlPrefix}/${id}`)
  }

  public async deleteReceipt (id: TBaseParamsId): Promise<TActionReceipt> {
    this.setLogHeaders({ menu: 'DOCUMENT-FINANCE', subMenu: 'ใบเสร็จรับเงิน' })
    return this.delete(`${this.urlPrefix}/${id}`)
  }

  public async createReceipt (payload: ICreateReceiptPayload): Promise<TActionReceipt> {
    this.setLogHeaders({ menu: 'DOCUMENT-FINANCE', subMenu: 'ใบเสร็จรับเงิน > ชำระเงิน/ออกใบเสร็จใหม่' })
    return this.post(this.urlPrefix, payload)
  }

  public async getInstallmentsByCustomerId (customerId: TBaseParamsId): Promise<TGetReceiptInstallmentsResponse> {
    this.setLogHeaders({ menu: 'DOCUMENT-FINANCE', subMenu: 'ใบเสร็จรับเงิน' })
    return this.get(`${this.urlPrefix}/installments/${customerId}`)
  }
}

export default ReceiptProvider
