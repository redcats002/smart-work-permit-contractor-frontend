import type { IGetContractAssetList, IGetDocumentMovementList, ISellContractAssetPayload, IUpdateContractAssetStatusPayload } from '@/models/request/contract/ContractAssetReq.model'
import type {
  IActionContractAssetResponse,
  IGetContractAssetDetailResponse,
  TGetContractAssetListResponse,
  TGetDocumentMovementListResponse
} from '@/models/response/contract-asset/ContractAssetRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IContractAssetProvider {
  getContractAssetPaginate(query: IGetContractAssetList): Promise<TGetContractAssetListResponse>
  getContractAssetDetail(id: number): Promise<IGetContractAssetDetailResponse>
  sellContractAsset(id: number, payload: ISellContractAssetPayload): Promise<IActionContractAssetResponse>
  updateContractAssetStatus(id: number, payload: IUpdateContractAssetStatusPayload): Promise<IActionContractAssetResponse>
  getDocumentMovement(id: number, query: IGetDocumentMovementList): Promise<TGetDocumentMovementListResponse>
}

class ContractAssetProvider extends HttpRequest implements IContractAssetProvider {
  private urlPrefix: string = '/api/v1/management/contract-assets'

  async getContractAssetPaginate (query: IGetContractAssetList): Promise<TGetContractAssetListResponse> {
    return this.get(this.urlPrefix, query)
  }

  async getContractAssetDetail (id: number): Promise<IGetContractAssetDetailResponse> {
    return this.get(`${this.urlPrefix}/${id}`)
  }

  async sellContractAsset (id: number, payload: ISellContractAssetPayload): Promise<IActionContractAssetResponse> {
    return this.patch(`${this.urlPrefix}/${id}/sell`, payload)
  }

  async updateContractAssetStatus (id: number, payload: IUpdateContractAssetStatusPayload): Promise<IActionContractAssetResponse> {
    return this.patch(`${this.urlPrefix}/status/${id}`, payload)
  }

  async getDocumentMovement (id: number, query: IGetDocumentMovementList): Promise<TGetDocumentMovementListResponse> {
    return this.get(`${this.urlPrefix}/document-movement/${id}`, query)
  }
}

export default ContractAssetProvider
