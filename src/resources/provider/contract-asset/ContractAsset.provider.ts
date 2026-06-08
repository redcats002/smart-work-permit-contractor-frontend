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
    this.setLogHeaders({ menu: 'CONTRACT-ASSETS' })
    return this.get(this.urlPrefix, query)
  }

  async getContractAssetDetail (id: number): Promise<IGetContractAssetDetailResponse> {
    this.setLogHeaders({ menu: 'CONTRACT-ASSETS' })
    return this.get(`${this.urlPrefix}/${id}`)
  }

  async sellContractAsset (id: number, payload: ISellContractAssetPayload): Promise<IActionContractAssetResponse> {
    this.setLogHeaders({ menu: 'CONTRACT-ASSETS', subMenu: 'ขายต่อ/ประมูล' })
    return this.patch(`${this.urlPrefix}/${id}/sell`, payload)
  }

  async updateContractAssetStatus (id: number, payload: IUpdateContractAssetStatusPayload): Promise<IActionContractAssetResponse> {
    this.setLogHeaders({ menu: 'CONTRACT-ASSETS', subMenu: 'แก้ไขสถานะหลักทรัพย์' })
    return this.patch(`${this.urlPrefix}/status/${id}`, payload)
  }

  async getDocumentMovement (id: number, query: IGetDocumentMovementList): Promise<TGetDocumentMovementListResponse> {
    this.setLogHeaders({ menu: 'CONTRACT-ASSETS', subMenu: 'ประวัติการจัดเก็บเอกสาร' })
    return this.get(`${this.urlPrefix}/document-movement/${id}`, query)
  }
}

export default ContractAssetProvider
