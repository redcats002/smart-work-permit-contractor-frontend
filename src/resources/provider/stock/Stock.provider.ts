import type {
  ICreateStockPayload,
  IGetStockContactHistoryList,
  IGetStockContractList,
  IGetStockEstateList,
  IGetStockList,
  IGetStockPaymentHistoryList,
  IUpdateStockPayload
} from '@/models/request/stock/StockReq.model'
import type {
  TActionDocumentMovement,
  TGetDocumentAssetsListResponse,
  TGetStockByIdResponse,
  TGetStockContactHistoryListResponse,
  TGetStockContractListResponse,
  TGetStockEstateListResponse,
  TGetStockPaymentHistoryListResponse
} from '@/models/response/document-storage/DocumentStorageRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IStockProvider {
  getStockPaginate (query: IGetStockList): Promise<TGetDocumentAssetsListResponse>
  createStock (payload: ICreateStockPayload): Promise<TActionDocumentMovement>
  updateStock (id: TBaseParamsId, payload: IUpdateStockPayload): Promise<TActionDocumentMovement>
  deleteStock (id: number): Promise<TActionDocumentMovement>
  getStockFindOne (id: TBaseParamsId): Promise<TGetStockByIdResponse>
  getStockContracts (id: TBaseParamsId, query: IGetStockContractList): Promise<TGetStockContractListResponse>
  getStockPaymentHistory (id: TBaseParamsId, query: IGetStockPaymentHistoryList): Promise<TGetStockPaymentHistoryListResponse>
  getStockContactHistory (id: TBaseParamsId, query: IGetStockContactHistoryList): Promise<TGetStockContactHistoryListResponse>
  getStockEstates (id: TBaseParamsId, query: IGetStockEstateList): Promise<TGetStockEstateListResponse>
}

class StockProvider extends HttpRequest implements IStockProvider {
  private urlPrefix: string = '/api/v1/stock'

  public async getStockPaginate (query: IGetStockList): Promise<TGetDocumentAssetsListResponse> {
    const response = await this.get(`${this.urlPrefix}`, query)
    return response
  }

  public async createStock (payload: ICreateStockPayload): Promise<TActionDocumentMovement> {
    const response = await this.post(`${this.urlPrefix}`, payload)
    return response
  }

  public async updateStock (id: TBaseParamsId, payload: IUpdateStockPayload): Promise<TActionDocumentMovement> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteStock (id: number): Promise<TActionDocumentMovement> {
    const response = await this.delete(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getStockFindOne (id: TBaseParamsId): Promise<TGetStockByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async getStockContracts (id: TBaseParamsId, query: IGetStockContractList): Promise<TGetStockContractListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/contracts`, query)
    return response
  }

  public async getStockPaymentHistory (id: TBaseParamsId, query: IGetStockPaymentHistoryList): Promise<TGetStockPaymentHistoryListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/payment-history`, query)
    return response
  }

  public async getStockContactHistory (id: TBaseParamsId, query: IGetStockContactHistoryList): Promise<TGetStockContactHistoryListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/contact-history`, query)
    return response
  }

  public async getStockEstates (id: TBaseParamsId, query: IGetStockEstateList): Promise<TGetStockEstateListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/estates`, query)
    return response
  }
}

export default StockProvider
