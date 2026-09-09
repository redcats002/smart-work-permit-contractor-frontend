import type { ICreateCertificatePayload, IGetCertificateListQuery, IUpdateCertificatePayload } from '@/models/request/certificate/CertificateReq.model'
import type {
  TCreateCertificateResponse,
  TGetCertificateByWorkerResponse,
  TGetCertificateListResponse,
  TGetCertificateResponse,
  TUpdateCertificateResponse
} from '@/models/response/certificate/CertificateRes.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * Live against the real backend (API-007). A contractor account is scoped to its own workers'
 * certificates server-side. Every row carries a backend-computed `expired` flag — the client must
 * not recompute expiry; see src/utils/CertificateStatus.ts.
 */
export interface ICertificateProvider {
  list (query: IGetCertificateListQuery): Promise<TGetCertificateListResponse>
  detail (id: number): Promise<TGetCertificateResponse>
  create (payload: ICreateCertificatePayload): Promise<TCreateCertificateResponse>
  update (id: number, payload: IUpdateCertificatePayload): Promise<TUpdateCertificateResponse>
  byWorker (workerName: string): Promise<TGetCertificateByWorkerResponse>
}

class CertificateProvider extends HttpRequest implements ICertificateProvider {
  private urlPrefix: string = '/api/v1/certificates'

  public async list (query: IGetCertificateListQuery): Promise<TGetCertificateListResponse> {
    const response = await this.get(this.urlPrefix, query)
    return response
  }

  /** Scoped server-side: a contractor reading another contractor's id gets 403, not the row. */
  public async detail (id: number): Promise<TGetCertificateResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async create (payload: ICreateCertificatePayload): Promise<TCreateCertificateResponse> {
    const response = await this.post(this.urlPrefix, payload)
    return response
  }

  /**
   * Only the keys present in `payload` are written. Omitting `filePath` keeps the existing
   * attachment; sending `null` detaches it.
   */
  public async update (id: number, payload: IUpdateCertificatePayload): Promise<TUpdateCertificateResponse> {
    const response = await this.patch(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  /** Answers ONE certificate or null — not an array. */
  public async byWorker (workerName: string): Promise<TGetCertificateByWorkerResponse> {
    const response = await this.get(`${this.urlPrefix}/worker/${encodeURIComponent(workerName)}`)
    return response
  }
}

export default CertificateProvider
