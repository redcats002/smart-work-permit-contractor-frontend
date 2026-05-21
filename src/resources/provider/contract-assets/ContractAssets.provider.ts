import type { TGetAssetContractListResponse } from '@/models/response/contract-assets/ContractAssetsRes.model'
import type { TActionContract } from '@/models/response/contract/ContractRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IContractAssetsProvider {
  getContractAssets(id: TBaseParamsId): Promise<TGetAssetContractListResponse>
  saveAssetDetail(contractId: TBaseParamsId, assetId: TBaseParamsId, formData: FormData): Promise<TActionContract>
}

class ContractAssetsProvider extends HttpRequest implements IContractAssetsProvider {
  private urlPrefix: string = '/api/v1/management/contract'

  public async getContractAssets (id: TBaseParamsId): Promise<TGetAssetContractListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/assets`)
    return response
  }

  public async saveAssetDetail (contractId: TBaseParamsId, assetId: TBaseParamsId, formData: FormData): Promise<TActionContract> {
    const response = await this.put(`${this.urlPrefix}/${contractId}/asset/${assetId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return response
  }
}

export default ContractAssetsProvider
