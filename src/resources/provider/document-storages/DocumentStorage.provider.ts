import type {
  ICreateDocumentMovementPayload,
  IGetDocumentMovementAssetsList,
  IGetDocumentStorageAssetsList
} from '@/models/request/document-storage/DocumentStorageReq.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import type { TActionStock, TGetStockListResponse, TGetStockMoveAssetsListResponse } from '@/models/response/stock/StockRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IDocumentStorageProvider {
  getDocumentStorageAssetsPaginate (query: IGetDocumentStorageAssetsList): Promise<TGetStockListResponse>
  getDocumentMovementAssetsPaginate (id: TBaseParamsId, query: IGetDocumentMovementAssetsList): Promise<TGetStockMoveAssetsListResponse>
  createDocumentMovementAssets (payload: ICreateDocumentMovementPayload): Promise<TActionStock>
}

class DocumentStorageProvider extends HttpRequest implements IDocumentStorageProvider {
  private urlPrefix: string = '/api/v1/document-storages'

  public async getDocumentStorageAssetsPaginate (query: IGetDocumentStorageAssetsList): Promise<TGetStockListResponse> {
    const response = await this.get(`${this.urlPrefix}/assets`, query)
    return response
  }

  public async getDocumentMovementAssetsPaginate (id: TBaseParamsId,
    query: IGetDocumentMovementAssetsList): Promise<TGetStockMoveAssetsListResponse> {
    const response = await this.get(`${this.urlPrefix}/movement/${id}/assets`, query)
    return response
  }

  public async createDocumentMovementAssets (payload: ICreateDocumentMovementPayload): Promise<TActionStock> {
    const response = await this.post(`${this.urlPrefix}/movement`, payload)
    return response
  }
}

export default DocumentStorageProvider
