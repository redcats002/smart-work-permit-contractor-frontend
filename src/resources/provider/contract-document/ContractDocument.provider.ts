import type {
  ICreateDocument,
  IGetDocumentList,
  IUpdateDocument
} from '@/models/request/contract-document/ContractDocumentReq.model'
import type {
  TActionContractDocumentResponse,
  TGetDocumentListResponse
} from '@/models/response/contract-document/ContractDocumentRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IContractDocumentProvider {
  getDocumentList(id: TBaseParamsId, query?: IGetDocumentList): Promise<TGetDocumentListResponse>
  getDocumentById(id: TBaseParamsId): Promise<TGetDocumentListResponse>
  createDocument(contractId: TBaseParamsId, payload: ICreateDocument): Promise<TActionContractDocumentResponse>
  updateDocument(id: TBaseParamsId, payload: IUpdateDocument): Promise<TActionContractDocumentResponse>
  deleteDocument(documentId: TBaseParamsId): Promise<TActionContractDocumentResponse>
}

class ContractDocumentProvider extends HttpRequest implements IContractDocumentProvider {
  private urlPrefix: string = '/api/v1/management/contract-document'

  public async getDocumentList (id: TBaseParamsId, query?: IGetDocumentList): Promise<TGetDocumentListResponse> {
    const response = await this.get(`${this.urlPrefix}/paginate/${id}`, query)
    return response
  }

  public async getDocumentById (id: TBaseParamsId): Promise<TGetDocumentListResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async createDocument (contractId: TBaseParamsId, payload: ICreateDocument): Promise<TActionContractDocumentResponse> {
    const response = await this.post(`${this.urlPrefix}/${contractId}`, payload)
    return response
  }

  public async updateDocument (id: TBaseParamsId, payload: IUpdateDocument): Promise<TActionContractDocumentResponse> {
    const response = await this.put(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async deleteDocument (documentId: TBaseParamsId): Promise<TActionContractDocumentResponse> {
    const response = await this.delete(`${this.urlPrefix}/${documentId}`)
    return response
  }
}

export default ContractDocumentProvider
