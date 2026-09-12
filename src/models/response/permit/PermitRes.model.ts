import type {
  IJsaStep, IPermitAuditEntry, IPermitAuthor, IPermitBase, IPermitFireWatch, IPermitPhoto, IPermitQr, IPermitSafetyReading,
  IPermitValidationSummary, IPermitWorker, IPreWorkChecklistAnswer
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
   * wayfinder 105/107. Replaces the old flattened `planId`/`planX`/`planY` (feat-023) — the pin
   * knows its own plan, so one reference is all the entity carries. `null` for a permit created
   * before any plan/pin existed, or one never pinned (105's own migration note: the nine
   * pre-105 positioned permits were dropped, not migrated — ruling 10 — so they render unplaced).
   */
  pinId: number | null
  /**
   * wayfinder 098 (API built 2026-09-11; this app's read-only awareness lands with wayfinder 113).
   * Set once by `POST /permits/:id/close-request` (inspector or the owning contractor) and **never
   * cleared**, even after the permit actually closes — so "awaiting safety" is `closeRequestedAt`
   * set AND the permit is still `ACTIVE`/`FIRE_MONITOR`, never just "is it set". Optional because
   * every fixture in this module predates the field and constructs a full literal — see
   * `closureChecklist` above for the same reason. Wire name is `closeRequestReason`, not
   * `closeRequestedReason`.
   */
  closeRequestedAt?: string | null
  closeRequestedBy?: IPermitAuthor | null
  closeRequestedRole?: string | null
  closeRequestReason?: string | null
  /**
   * Closes `docs/api/GAPS.md` row J. Present on both `GET /permits` and `GET /permits/:id` —
   * declared here (not only on `IPermitDetail`) for that reason. Optional because every fixture
   * in this module predates the field and constructs a full literal — see `closeRequestedAt`
   * above for the same reason. `null` for a permit created before this field existed, or one
   * whose contractor never answered any row.
   */
  preWorkChecklist?: IPreWorkChecklistAnswer[] | null
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

/**
 * POST /permits/:id/close-request — wayfinder 098. Raises the flag only; does not close the
 * permit. 403 PERMIT_NOT_ACTIVE if the permit is not ACTIVE/FIRE_MONITOR. Idempotent overwrite,
 * not a conflict, so a repeat call answers 200 with the refreshed closeRequested* fields.
 */
export type TRequestClosePermitResponse = IBaseSuccessResponse<IPermitDetail>

/** GET /permits/:id/qr — ACTIVE / FIRE_MONITOR only, else 403 PERMIT_NOT_ACTIVE */
export type TGetPermitQrResponse = IBaseSuccessResponse<IPermitQr>

/** GET /permits/:id/audit */
export type TGetPermitAuditResponse = IBaseSuccessResponse<IPermitAuditEntry[]>
