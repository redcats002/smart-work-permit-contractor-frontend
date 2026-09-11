import type { TInspectorVisitNoteType } from '@/enums/modules/inspector-visit/InspectorVisitNoteType.enum'
import type { IPermitAuthor } from '@/models/modules/permit/Permit.model'
import type { IBasePaginationResponse } from '@/models/response/Response.model'

/**
 * Client-asserted provenance flag carried on a field action (entrant scan, gas reading, inspector
 * visit). Not a security signal — render as a plain label, never gate on it.
 */
export type TFieldActionSource = 'scan' | 'manual' | 'system'

export interface IInspectorVisitNote {
  id: number
  noteType: TInspectorVisitNoteType
  text: string
  createdById: string
  createdAt: string
}

export interface IInspectorVisitPhoto {
  id: number
  fileRef: string
  originalName: string | null
  fileType: string | null
  uploadedById: string
  uploadedAt: string
}

/**
 * `GET /permits/:id/inspector-visits` row (wayfinder 073/119/112). Own-permit-only for a
 * contractor (map ruling 18) — a 403 on another contractor's permit carries no `errorCode`.
 *
 * `ppeChecklist` is `Record<string, unknown> | null` on the wire — three shapes exist side by side
 * forever ('none' / 'new' / 'legacy'). Classify with `src/utils/InspectorVisitPpe.ts` before
 * rendering; never assume a shape here.
 */
export interface IInspectorVisitWire {
  id: number
  permitId: string
  inspectorId: string
  inspector: IPermitAuthor | null
  startedAt: string
  submittedAt: string | null
  source: TFieldActionSource | null
  ppeChecklist: Record<string, unknown> | null
  notes: IInspectorVisitNote[]
  photos: IInspectorVisitPhoto[]
  createdAt: string
}

export type TGetInspectorVisitListResponse = IBasePaginationResponse<IInspectorVisitWire>
