import type { IAuthor } from '@/models/Global.model'
import type { TJsaPhase } from '@/enums/modules/permit/JsaPhase.enum'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { TWorkerRole } from '@/enums/modules/permit/WorkerRole.enum'

/**
 * Shared domain shapes for the `permit` module. Field names mirror the backend
 * data model in docs/main/dev-handoff/01-backend-elysia-tasks.md, converted to
 * camelCase — src/resources/Interceptors.ts handles snake_case<->camelCase via
 * humps, so no model here should use snake_case.
 *
 * Permit ID format: `WP-{TYPE}-{YYYYMMDD}-{seq}` e.g. `WP-HOT-20260625-001`.
 */

export interface IPermitBase {
  id: string
  type: TPermitType
  status: TPermitStatus
  project: string
  title: string
  foreman: string
  location: string
  workDate: string
  workTimeStart: string
  workTimeEnd: string
  outdoorWork: boolean
}

export interface IPermitSafetyReading {
  lel?: number
  o2?: number
  co?: number
  so2?: number
  wind?: number
  height?: number
  recordedAt?: string
  recordedBy?: IAuthor
}

export interface IJsaStep {
  id?: string | number
  phase: TJsaPhase
  step: string
  hazard: string
  control: string
  sortOrder?: number
}

export interface IPermitWorkerHealthCheck {
  bloodPressure?: string
  alcoholReading?: string
  passed?: boolean
}

export interface IPermitWorker {
  id?: string | number
  workerName: string
  roleOnPermit: TWorkerRole
  certificateId?: string | number
  /** Confined Space only — pre-work BP + alcohol reading per Thai ministerial regulation. */
  healthCheck?: IPermitWorkerHealthCheck
}

export interface IPermitPhoto {
  slotKey: string
  fileRef: string
  uploadedAt?: string
}

export interface IClosureChecklistAnswer {
  itemKey: string
  answer: 'yes' | 'no' | 'na'
}

export interface IPermitQr {
  token: string
  permitId: string
  status: TPermitStatus
  issuedAt?: string
}

export interface IPermitAuditEntry {
  id: string | number
  permitId: string
  actor: IAuthor
  action: string
  payload?: Record<string, unknown>
  createdAt: string
}
