import type {
  IGetContractAssetList,
  ISellContractAssetPayload,
  IUpdateContractAssetStatusPayload
} from '@/models/request/contract-asset/ContractAssetReq.model'
import type {
  IActionContractAssetResponse,
  IGetContractAssetDetailResponse,
  TGetContractAssetListResponse
} from '@/models/response/contract-asset/ContractAssetRes.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IContractAssetProvider {
  getContractAssetPaginate(query: IGetContractAssetList): Promise<TGetContractAssetListResponse>
  getContractAssetDetail(id: number): Promise<IGetContractAssetDetailResponse>
  sellContractAsset(id: number, payload: ISellContractAssetPayload): Promise<IActionContractAssetResponse>
  updateContractAssetStatus(id: number, payload: IUpdateContractAssetStatusPayload): Promise<IActionContractAssetResponse>
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
    return this.patch(`${this.urlPrefix}/${id}/update-status`, payload)
  }
}

export default ContractAssetProvider
