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
  TGetPermitListResponse,
  TGetPermitQrResponse,
  TMarkPermitCompleteResponse,
  TSubmitPermitResponse,
  TUpdatePermitDraftResponse
} from '@/models/response/permit/PermitRes.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * Live against the real backend (API-006). The stub fixtures this provider used to resolve from
 * are gone — they described a shape the server never sends.
 *
 * Deliberately absent: approve and reject. Both are `safety_officer`-only and answer 403
 * `FORBIDDEN_ROLE` for a contractor account, so exposing them here would only invite a caller to
 * build a button that cannot work.
 *
 * `close` IS exposed, and that is a deliberate exception, not an oversight. The backend guards
 * `POST /permits/:id/close` with `auth: ['safety_officer']` too, so a contractor request answers
 * 403 `FORBIDDEN_ROLE` today — but the contractor closure flow (`PMT-011`, design lines 574-611)
 * must not pre-empt the server: it attempts the call and renders whatever verdict comes back,
 * localized off `errorCode`. See `docs/api/GAPS.md` row **H** for the backend change that closes it.
 */
export interface IPermitProvider {
  create (payload: ICreatePermitDraftPayload): Promise<TCreatePermitDraftResponse>
  update (id: string, payload: IUpdatePermitDraftPayload): Promise<TUpdatePermitDraftResponse>
  submit (id: string, payload?: ISubmitPermitPayload): Promise<TSubmitPermitResponse>
  list (query: IGetPermitListQuery): Promise<TGetPermitListResponse>
  detail (id: string): Promise<TGetPermitDetailResponse>
  markComplete (id: string, payload?: IMarkPermitCompletePayload): Promise<TMarkPermitCompleteResponse>
  qr (id: string): Promise<TGetPermitQrResponse>
  audit (id: string): Promise<TGetPermitAuditResponse>
  close (id: string, payload: IClosePermitPayload): Promise<TClosePermitResponse>
}

class PermitProvider extends HttpRequest implements IPermitProvider {
  private urlPrefix: string = '/api/v1/permits'

  public async create (payload: ICreatePermitDraftPayload): Promise<TCreatePermitDraftResponse> {
    const response = await this.post(this.urlPrefix, payload)
    return response
  }

  /** DRAFT only — 403 PERMIT_NOT_EDITABLE afterwards. See the payload type for collection semantics. */
  public async update (id: string, payload: IUpdatePermitDraftPayload): Promise<TUpdatePermitDraftResponse> {
    const response = await this.patch(`${this.urlPrefix}/${id}`, payload)
    return response
  }

  /** Answers 400 with the first failing validation code (LEL_MISSING, GAS_OUT_OF_RANGE, CERT_EXPIRED, …). */
  public async submit (id: string, payload?: ISubmitPermitPayload): Promise<TSubmitPermitResponse> {
    const response = await this.post(`${this.urlPrefix}/${id}/submit`, payload)
    return response
  }

  /** Paginated. A contractor account is scoped to its own permits server-side. */
  public async list (query: IGetPermitListQuery): Promise<TGetPermitListResponse> {
    const response = await this.get(this.urlPrefix, query)
    return response
  }

  public async detail (id: string): Promise<TGetPermitDetailResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}`)
    return response
  }

  /** Hot Work only — 403 NOT_HOT_WORK / PERMIT_NOT_ACTIVE otherwise. Starts the 30-min Fire Watch. */
  public async markComplete (id: string, payload?: IMarkPermitCompletePayload): Promise<TMarkPermitCompleteResponse> {
    const response = await this.post(`${this.urlPrefix}/${id}/mark-complete`, payload)
    return response
  }

  public async qr (id: string): Promise<TGetPermitQrResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/qr`)
    return response
  }

  public async audit (id: string): Promise<TGetPermitAuditResponse> {
    const response = await this.get(`${this.urlPrefix}/${id}/audit`)
    return response
  }

  /**
   * Closure checklist + e-signature. Answers 403 `ENTRANTS_STILL_INSIDE` while a Confined Space
   * entrant is checked in, 403 `FIRE_WATCH_NOT_ELAPSED` while Hot Work's countdown runs, and — for
   * a contractor account today — 403 `FORBIDDEN_ROLE` (GAPS.md row H). Never swallow the failure.
   */
  public async close (id: string, payload: IClosePermitPayload): Promise<TClosePermitResponse> {
    const response = await this.post(`${this.urlPrefix}/${id}/close`, payload)
    return response
  }
}

export default PermitProvider
