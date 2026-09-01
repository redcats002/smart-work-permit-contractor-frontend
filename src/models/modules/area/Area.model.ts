import type { IPermitAuthor } from '@/models/modules/permit/Permit.model'
import type { TAreaStatus } from '@/enums/modules/area/AreaStatus.enum'

/**
 * wayfinder ticket 037 (backend: ticket 036) — a named place in the facility a permit's work is
 * located in. Flat, no `parentId` (034 resolution, decision 5). Every role may read the full
 * list (docs/api/openapi.json `GET /v1/areas`) — per-contractor visibility scoping is
 * deliberately out of scope.
 *
 * `planId`/`planX`/`planY` are an OPTIONAL default position, same shape and "0 is a legal falsy
 * percentage" / "set together, cleared together" convention as `IPermitPosition` — picking an
 * approved area with one pre-drops the contractor's pin, which they may still nudge (034
 * resolution, decision 4). Reuses `IPermitAuthor` for `createdBy`/`approvedBy` — same author
 * shape the permit entity already declares.
 */
export interface IArea {
  id: number
  name: string
  status: TAreaStatus
  planId: number | null
  planX: number | null
  planY: number | null
  createdById: string
  createdBy: IPermitAuthor | null
  createdAt: string
  updatedAt: string
  approvedById: string | null
  approvedBy: IPermitAuthor | null
  approvedAt: string | null
  rejectedReason: string | null
  rejectedAt: string | null
}
