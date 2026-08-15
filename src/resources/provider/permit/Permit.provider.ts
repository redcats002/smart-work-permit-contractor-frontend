import type {
  IClosePermitPayload,
  ICreatePermitDraftPayload,
  IGetPermitListQuery,
  IMarkPermitCompletePayload,
  ISubmitPermitPayload,
  IUpdatePermitDraftPayload
} from '@/models/request/permit/PermitReq.model'
import type {
  TClosePermitResponse,
  TCreatePermitDraftResponse,
  TGetPermitAuditResponse,
  TGetPermitDetailResponse,
  TGetPermitQrResponse,
  TGetPermitListResponse,
  TMarkPermitCompleteResponse,
  TSubmitPermitResponse,
  TUpdatePermitDraftResponse
} from '@/models/response/permit/PermitRes.model'
import HttpRequest from '@/resources/HttpRequest'
import { buildMockDraft, findMockPermitDetail, queryMockPermits } from './Permit.mock'

/**
 * ⚠ STUB MODE — the backend `/permits` endpoints (docs/modules/permit/context.md) are
 * not deployed/reachable yet. While `USE_STUB_DATA` is true, every method below resolves
 * from the in-memory fixtures in `./Permit.mock.ts` instead of hitting the network, so the
 * My Permits list (PMT-003) is reviewable offline with realistic data.
 *
 * To go live once the backend is up: set `USE_STUB_DATA = false` (one line). The real HTTP
 * calls are already wired below on every method — nothing else needs to change, and the
 * base URL already comes from `VITE_APP_API_URL` via HttpRequest. `Permit.mock.ts` can be
 * deleted at that point; nothing else imports from it.
 */
const USE_STUB_DATA = true

export interface IPermitProvider {
  create (payload: ICreatePermitDraftPayload): Promise<TCreatePermitDraftResponse>
  update (id: string, payload: IUpdatePermitDraftPayload): Promise<TUpdatePermitDraftResponse>
  submit (id: string, payload?: ISubmitPermitPayload): Promise<TSubmitPermitResponse>
  list (query: IGetPermitListQuery): Promise<TGetPermitListResponse>
  detail (id: string): Promise<TGetPermitDetailResponse>
  markComplete (id: string, payload?: IMarkPermitCompletePayload): Promise<TMarkPermitCompleteResponse>
  close (id: string, payload: IClosePermitPayload): Promise<TClosePermitResponse>
  qr (id: string): Promise<TGetPermitQrResponse>
  audit (id: string): Promise<TGetPermitAuditResponse>
}

class PermitProvider extends HttpRequest implements IPermitProvider {
  private urlPrefix: string = '/api/v1/permits'

  public async create (payload: ICreatePermitDraftPayload): Promise<TCreatePermitDraftResponse> {
    if (USE_STUB_DATA) {
      return { message: 'stub: draft created', data: buildMockDraft(payload) }
    }
    const response = await this.post(this.urlPrefix, payload)
    return response
  }

  public async update (id: string, payload: IUpdatePermitDraftPayload): Promise<TUpdatePermitDraftResponse> {
    if (USE_STUB_DATA) {
      return { message: 'stub: draft updated', data: buildMockDraft({ id, ...payload }) }
    }
    const response = await this.patch(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  public async submit (id: string, payload?: ISubmitPermitPayload): Promise<TSubmitPermitResponse> {
    if (USE_STUB_DATA) {
      return { message: 'stub: permit submitted', data: buildMockDraft({ id, status: 'PENDING' }) }
    }
    const response = await this.post(`${this.urlPrefix}/${id}/submit`, payload)
    return response
  }

  public async list (query: IGetPermitListQuery): Promise<TGetPermitListResponse> {
    if (USE_STUB_DATA) {
      const { items, count } = queryMockPermits(query)
      const limit = query.limit ?? 10
      return {
        message: 'stub: permit list',
        data: items,
        page: query.page ?? 1,
        limit,
        count,
        totalPage: Math.max(1, Math.ceil(count / Number(limit)))
      }
    }
    const response = await this.get(this.urlPrefix, query)
    return response
  }

  public async detail (id: string): Promise<TGetPermitDetailResponse> {
    if (USE_STUB_DATA) {
      const data = findMockPermitDetail(id) ?? buildMockDraft({ id })
      return { message: 'stub: permit detail', data }
    }
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  public async markComplete (id: string, payload?: IMarkPermitCompletePayload): Promise<TMarkPermitCompleteResponse> {
    if (USE_STUB_DATA) {
      return { message: 'stub: marked complete', data: buildMockDraft({ id, status: 'FIRE_MONITOR' }) }
    }
    const response = await this.post(`${this.urlPrefix}/${id}/mark-complete`, payload)
    return response
  }

  public async close (id: string, payload: IClosePermitPayload): Promise<TClosePermitResponse> {
    if (USE_STUB_DATA) {
      return { message: 'stub: permit closed', data: buildMockDraft({ id, status: 'CLOSED' }) }
    }
    const response = await this.post(`${this.urlPrefix}/${id}/close`, payload)
    return response
  }

  public async qr (id: string): Promise<TGetPermitQrResponse> {
    if (USE_STUB_DATA) {
      return { message: 'stub: qr payload', data: { token: `stub-token-${id}`, permitId: id, status: 'ACTIVE' } }
    }
    const response = await this.get(`${this.urlPrefix}/${id}/qr`)
    return response
  }

  public async audit (id: string): Promise<TGetPermitAuditResponse> {
    if (USE_STUB_DATA) {
      return { message: 'stub: audit trail', data: [] }
    }
    const response = await this.get(`${this.urlPrefix}/${id}/audit`)
    return response
  }
}

export default PermitProvider
