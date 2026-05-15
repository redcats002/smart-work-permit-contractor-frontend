import type {
  ICreateDocumentMovementPayload,
  IGetDocumentAssetsList,
  IGetDocumentMovementAssetsList,
  IGetDocumentMovementList,
  IReceiveDocumentMovementPayload
} from '@/models/request/document-storage/DocumentStorageReq.model'
import type {
  TActionDocumentMovement,
  TGetDocumentAssetsListResponse,
  TGetDocumentMovementAssetsListResponse,
  TGetDocumentMovementByIdResponse,
  TGetDocumentMovementListResponse
} from '@/models/response/document-storage/DocumentStorageRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IDocumentStorageProvider {
  getDocumentAssetsPaginate(query?: IGetDocumentAssetsList): Promise<TGetDocumentAssetsListResponse>
  getDocumentMovementPaginate(query?: IGetDocumentMovementList): Promise<TGetDocumentMovementListResponse>
  getDocumentMovementFindOne(id: TBaseParamsId): Promise<TGetDocumentMovementByIdResponse>
  createDocumentMovement(payload: ICreateDocumentMovementPayload): Promise<TActionDocumentMovement>
  receiveDocumentMovement(id: TBaseParamsId, payload: IReceiveDocumentMovementPayload): Promise<TActionDocumentMovement>
  getDocumentMovementAssetsPaginateByWarehouseId(
    warehouseId: TBaseParamsId,
    query?: IGetDocumentMovementAssetsList
  ): Promise<TGetDocumentMovementAssetsListResponse>
  cancelledDocumentMovement(id: TBaseParamsId): Promise<TActionDocumentMovement>
}

class DocumentStorageProvider extends HttpRequest implements IDocumentStorageProvider {
  private urlPrefix: string = '/api/v1/management/document-storages'

  public async getDocumentAssetsPaginate (query?: IGetDocumentAssetsList): Promise<TGetDocumentAssetsListResponse> {
    const response = await this.get(`${this.urlPrefix}/assets`, query)
    return response
  }

  public async getDocumentMovementPaginate (query?: IGetDocumentMovementList): Promise<TGetDocumentMovementListResponse> {
    const response = await this.get(`${this.urlPrefix}/movement`, query)
    return response
  }

  public async getDocumentMovementFindOne (id: TBaseParamsId): Promise<TGetDocumentMovementByIdResponse> {
    const response = await this.get(`${this.urlPrefix}/movement/${id}`)
    return response
  }

  public async createDocumentMovement (payload: ICreateDocumentMovementPayload): Promise<TActionDocumentMovement> {
    const response = await this.post(`${this.urlPrefix}/movement`, payload)
    return response
  }

  public async receiveDocumentMovement (id: TBaseParamsId, payload: IReceiveDocumentMovementPayload): Promise<TActionDocumentMovement> {
    const response = await this.put(`${this.urlPrefix}/movement/${id}`, payload)
    return response
  }

  public async getDocumentMovementAssetsPaginateByWarehouseId (
    warehouseId: TBaseParamsId,
    query?: IGetDocumentMovementAssetsList
  ): Promise<TGetDocumentMovementAssetsListResponse> {
    const response = await this.get(`${this.urlPrefix}/movement/${warehouseId}/assets`, query)
    return response
  }

  public async cancelledDocumentMovement (id: TBaseParamsId): Promise<TActionDocumentMovement> {
    const response = await this.delete(`${this.urlPrefix}/movement/${id}`)
    return response
  }
}

export default DocumentStorageProvider
