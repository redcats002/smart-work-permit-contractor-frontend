import type { ICreateCertificatePayload, IGetCertificateListQuery } from '@/models/request/certificate/CertificateReq.model'
import type {
  TCreateCertificateResponse,
  TGetCertificateByWorkerResponse,
  TGetCertificateListResponse
} from '@/models/response/certificate/CertificateRes.model'
import HttpRequest from '@/resources/HttpRequest'
import { addMockCertificate, findMockCertificatesByWorker, queryMockCertificates } from './Certificate.mock'

/**
 * ⚠ STUB MODE — the backend `/certificates` endpoints (docs/modules/certificate/context.md)
 * are not deployed/reachable yet. While `USE_STUB_DATA` is true, every method below resolves
 * from the in-memory fixtures in `./Certificate.mock.ts` instead of hitting the network, so
 * the certificate list (CRT-002) is reviewable offline with realistic data covering all
 * three validity states.
 *
 * To go live once the backend is up: set `USE_STUB_DATA = false` (one line). The real HTTP
 * calls are already wired below on every method — nothing else needs to change, and the
 * base URL already comes from `VITE_APP_API_URL` via HttpRequest. `Certificate.mock.ts` can
 * be deleted at that point; nothing else imports from it.
 */
const USE_STUB_DATA = true

export interface ICertificateProvider {
  list (query: IGetCertificateListQuery): Promise<TGetCertificateListResponse>
  create (payload: ICreateCertificatePayload): Promise<TCreateCertificateResponse>
  byWorker (workerName: string): Promise<TGetCertificateByWorkerResponse>
}

class CertificateProvider extends HttpRequest implements ICertificateProvider {
  private urlPrefix: string = '/api/v1/certificates'

  public async list (query: IGetCertificateListQuery): Promise<TGetCertificateListResponse> {
    if (USE_STUB_DATA) {
      const page = query.page ?? 1
      const limit = Number(query.limit ?? 50)
      const { items, count } = queryMockCertificates(page, limit)
      return {
        message: 'stub: certificate list',
        data: items,
        page,
        limit,
        count,
        totalPage: Math.max(1, Math.ceil(count / limit))
      }
    }
    const response = await this.get(this.urlPrefix, query)
    return response
  }

  public async create (payload: ICreateCertificatePayload): Promise<TCreateCertificateResponse> {
    if (USE_STUB_DATA) {
      return { message: 'stub: certificate created', data: addMockCertificate(payload) }
    }
    const response = await this.post(this.urlPrefix, payload)
    return response
  }

  public async byWorker (workerName: string): Promise<TGetCertificateByWorkerResponse> {
    if (USE_STUB_DATA) {
      return { message: 'stub: certificates by worker', data: findMockCertificatesByWorker(workerName) }
    }
    const response = await this.get(`${this.urlPrefix}/worker/${encodeURIComponent(workerName)}`)
    return response
  }
}

export default CertificateProvider
