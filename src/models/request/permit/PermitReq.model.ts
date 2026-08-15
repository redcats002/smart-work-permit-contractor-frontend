import type {
  IClosureChecklistAnswer, IJsaStep, IPermitPhoto, IPermitSafetyReading, IPermitWorker
} from '@/models/modules/permit/Permit.model'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IBasePaginationRequest } from '../Request.model'

/** POST /permits */
export interface ICreatePermitDraftPayload {
  type: TPermitType
  project: string
  foreman: string
  workDate: string
  workTimeStart: string
  workTimeEnd: string
  workDescription: string
  location: string
  outdoorWork: boolean
}

/** PATCH /permits/:id — only while status is DRAFT */
export interface IUpdatePermitDraftPayload extends Partial<ICreatePermitDraftPayload> {
  safetyReadings?: IPermitSafetyReading
  jsaSteps?: IJsaStep[]
  workers?: IPermitWorker[]
  photos?: IPermitPhoto[]
}

/** POST /permits/:id/submit — no body beyond the permit id in the URL */
export interface ISubmitPermitPayload {}

/** POST /permits/:id/mark-complete — Hot Work only, no body beyond the permit id */
export interface IMarkPermitCompletePayload {}

/** POST /permits/:id/close */
export interface IClosePermitPayload {
  checklistAnswers: IClosureChecklistAnswer[]
  signature: string
  signedAt: string
}

/** GET /permits */
export interface IGetPermitListQuery extends IBasePaginationRequest {
  /**
   * A single status or a set of statuses (e.g. the "Active" filter chip covers
   * both ACTIVE and FIRE_MONITOR — see docs/modules/permit/context.md § My Permits).
   */
  status?: TPermitStatus | TPermitStatus[]
  type?: TPermitType
  dateFrom?: string
  dateTo?: string
}
