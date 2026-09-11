import type {
  ICreatePermitDraftPayload,
  IGetPermitListQuery,
  IMarkPermitCompletePayload,
  IRequestClosePermitPayload,
  ISubmitPermitPayload,
  IUpdatePermitDraftPayload
} from '@/models/request/permit/PermitReq.model'
import type {
  TCreatePermitDraftResponse,
  TGetPermitAuditResponse,
  TGetPermitDetailResponse,
  TGetPermitListResponse,
  TGetPermitQrResponse,
  TMarkPermitCompleteResponse,
  TRequestClosePermitResponse,
  TSubmitPermitResponse,
  TUpdatePermitDraftResponse
} from '@/models/response/permit/PermitRes.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * Live against the real backend (API-006). The stub fixtures this provider used to resolve from
 * are gone — they described a shape the server never sends.
 *
 * Deliberately absent: approve, reject AND close. All three are `safety_officer`-only routes
 * (wayfinder 098, CR round 4, PROMPT-LOG.md session 13 — reverses ticket 020's "closure is the
 * Foreman's act": closure moved to safety, and `close` is no longer a deliberate contractor
 * exception the way it briefly was under `feat-020`/GAPS.md row H). Exposing any of the three
 * here would only invite a caller to build a button that always answers 403 `FORBIDDEN_ROLE`.
 *
 * `requestClose` IS exposed: `POST /permits/:id/close-request` admits `contractor` (own permit
 * only) and `inspector`. It does not close the permit — it flags `closeRequestedAt`/`By`/`Role`/
 * `Reason` for Safety to act on, via the same `close` command a safety officer now owns
 * exclusively.
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
  requestClose (id: string, payload: IRequestClosePermitPayload): Promise<TRequestClosePermitResponse>
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
   * Raises a closure request — does NOT close the permit. Accepted only while ACTIVE or
   * FIRE_MONITOR (403 `PERMIT_NOT_ACTIVE` otherwise); idempotent, so calling it again just
   * refreshes who/when/why rather than answering a conflict.
   */
  public async requestClose (id: string, payload: IRequestClosePermitPayload): Promise<TRequestClosePermitResponse> {
    const response = await this.post(`${this.urlPrefix}/${id}/close-request`, payload)
    return response
  }
}

export default PermitProvider
