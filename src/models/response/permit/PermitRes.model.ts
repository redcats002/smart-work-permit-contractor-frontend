import type {
  IJsaStep, IPermitAuditEntry, IPermitAuthor, IPermitBase, IPermitFireWatch, IPermitPhoto, IPermitQr, IPermitSafetyReading,
  IPermitValidationSummary, IPermitWorker
} from '@/models/modules/permit/Permit.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

/**
 * Row shape for GET /permits (My Permits list + History). The list returns the permit ENTITY —
 * the same fields as the detail minus its collections. Since the backend's 2026-08-21 pass it also
 * carries `entrantCount` and `fireWatch` (docs/api/GAPS.md row A) — no QR token needed.
 */
export interface IPermitListItem extends IPermitBase {
  createdById: string
  createdBy: IPermitAuthor | null
  createdAt: string
  updatedAt: string
  submittedAt: string | null
  approvedById: string | null
  approvedBy: IPermitAuthor | null
  approvedAt: string | null
  rejectedReason: string | null
  rejectedAt: string | null
  closedById: string | null
  closedBy: IPermitAuthor | null
  closedAt: string | null
  /** Hot Work only — set when mark-complete starts the 30-min Fire Watch countdown. */
  fireMonitorStartedAt: string | null
  qrIssuedAt: string | null
  /** Confined Space entrants currently checked in. `0` for every other type. */
  entrantCount: number
  /** Server-computed remainder — render it, never recompute a verdict from it. `null` unless FIRE_MONITOR. */
  fireWatch: IPermitFireWatch | null
  /**
   * feat-023. Flattened here (not nested `position`) because that is what GET actually returns —
   * PATCH/POST accept the nested `{ planId, planX, planY }` shape instead (see
   * `IUpdatePermitDraftPayload.position`). All three are `null` together or set together; a
   * permit created before any plan existed, or one never pinned, has all three `null`.
   */
  planId: number | null
  planX: number | null
  planY: number | null
  /**
   * wayfinder ticket 037. The structured place this permit's work is in — nullable, and not
   * necessarily `APPROVED` any more by the time this is read back (an area's approval can be
   * revoked after a permit already references it). Render whatever this resolves to; never
   * assume it is still approved.
   */
  areaId: number | null
}

/** GET /permits/:id — the entity plus its collections. */
export interface IPermitDetail extends IPermitListItem {
  jsaSteps: IJsaStep[]
  workers: IPermitWorker[]
  photos: IPermitPhoto[]
  /** Singular: the most recent reading only. PATCH appends; this reads back the latest. */
  latestSafetyReading: IPermitSafetyReading | null
  closureChecklist?: Record<string, unknown> | null
  /** Server-computed verdict for the safety readings only — rendered as-is, never recomputed. */
  validationSummary?: IPermitValidationSummary | null
}

export type TGetPermitListResponse = IBasePaginationResponse<IPermitListItem>
export type TGetPermitDetailResponse = IBaseSuccessResponse<IPermitDetail>
export type TCreatePermitDraftResponse = IBaseSuccessResponse<IPermitDetail>
export type TUpdatePermitDraftResponse = IBaseSuccessResponse<IPermitDetail>
export type TSubmitPermitResponse = IBaseSuccessResponse<IPermitDetail>
export type TMarkPermitCompleteResponse = IBaseSuccessResponse<IPermitDetail>

/** POST /permits/:id/close — 403 ENTRANTS_STILL_INSIDE / FIRE_WATCH_NOT_ELAPSED / PERMIT_NOT_CLOSABLE. */
export type TClosePermitResponse = IBaseSuccessResponse<IPermitDetail>

/** GET /permits/:id/qr — ACTIVE / FIRE_MONITOR only, else 403 PERMIT_NOT_ACTIVE */
export type TGetPermitQrResponse = IBaseSuccessResponse<IPermitQr>

/** GET /permits/:id/audit */
export type TGetPermitAuditResponse = IBaseSuccessResponse<IPermitAuditEntry[]>
