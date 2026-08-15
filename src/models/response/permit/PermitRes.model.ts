import type { IAuthor } from '@/models/Global.model'
import type {
  IJsaStep, IPermitAuditEntry, IPermitBase, IPermitPhoto, IPermitQr, IPermitSafetyReading, IPermitWorker
} from '@/models/modules/permit/Permit.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

/** Row shape for GET /permits (My Permits list + History). */
export interface IPermitListItem extends IPermitBase {
  /** Confined Space, ACTIVE only — count of entrants currently checked in. */
  entrantsInside?: number
  /** CLOSED / EXPIRED only — closure timestamp + closer, surfaced by the history archive table. */
  closedAt?: string
  closedBy?: IAuthor
}

/** GET /permits/:id */
export interface IPermitDetail extends IPermitBase {
  workDescription: string
  createdBy?: IAuthor
  createdAt?: string
  submittedAt?: string
  approvedAt?: string
  approvedBy?: IAuthor
  rejectedReason?: string
  closedAt?: string
  closedBy?: IAuthor
  /** Hot Work only — set when mark-complete starts the 30-min Fire Watch countdown. */
  fireMonitorStartedAt?: string
  safetyReadings?: IPermitSafetyReading
  jsaSteps: IJsaStep[]
  workers: IPermitWorker[]
  photos: IPermitPhoto[]
}

export type TGetPermitListResponse = IBasePaginationResponse<IPermitListItem>
export type TGetPermitDetailResponse = IBaseSuccessResponse<IPermitDetail>
export type TCreatePermitDraftResponse = IBaseSuccessResponse<IPermitDetail>
export type TUpdatePermitDraftResponse = IBaseSuccessResponse<IPermitDetail>
export type TSubmitPermitResponse = IBaseSuccessResponse<IPermitDetail>
export type TMarkPermitCompleteResponse = IBaseSuccessResponse<IPermitDetail>
export type TClosePermitResponse = IBaseSuccessResponse<IPermitDetail>

/** GET /permits/:id/qr — ACTIVE / FIRE_MONITOR only */
export type TGetPermitQrResponse = IBaseSuccessResponse<IPermitQr>

/** GET /permits/:id/audit */
export type TGetPermitAuditResponse = IBaseSuccessResponse<IPermitAuditEntry[]>
