import type {
  IJsaStep, IPermitAuditEntry, IPermitAuthor, IPermitBase, IPermitPhoto, IPermitQr, IPermitSafetyReading, IPermitWorker
} from '@/models/modules/permit/Permit.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

/**
 * Row shape for GET /permits (My Permits list + History). The list returns the permit ENTITY —
 * the same fields as the detail minus its collections. It carries no entrant count and no
 * fire-watch remainder: only GET /permits/qr/:token reports those (docs/api/GAPS.md).
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
}

/** GET /permits/:id — the entity plus its collections. */
export interface IPermitDetail extends IPermitListItem {
  jsaSteps: IJsaStep[]
  workers: IPermitWorker[]
  photos: IPermitPhoto[]
  /** Singular: the most recent reading only. PATCH appends; this reads back the latest. */
  latestSafetyReading: IPermitSafetyReading | null
  closureChecklist?: Record<string, unknown> | null
}

export type TGetPermitListResponse = IBasePaginationResponse<IPermitListItem>
export type TGetPermitDetailResponse = IBaseSuccessResponse<IPermitDetail>
export type TCreatePermitDraftResponse = IBaseSuccessResponse<IPermitDetail>
export type TUpdatePermitDraftResponse = IBaseSuccessResponse<IPermitDetail>
export type TSubmitPermitResponse = IBaseSuccessResponse<IPermitDetail>
export type TMarkPermitCompleteResponse = IBaseSuccessResponse<IPermitDetail>

/** GET /permits/:id/qr — ACTIVE / FIRE_MONITOR only, else 403 PERMIT_NOT_ACTIVE */
export type TGetPermitQrResponse = IBaseSuccessResponse<IPermitQr>

/** GET /permits/:id/audit */
export type TGetPermitAuditResponse = IBaseSuccessResponse<IPermitAuditEntry[]>
