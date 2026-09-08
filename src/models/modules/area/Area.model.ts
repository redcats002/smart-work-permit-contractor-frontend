import type { IPermitAuthor } from '@/models/modules/permit/Permit.model'
import type { TAreaStatus } from '@/enums/modules/area/AreaStatus.enum'

/**
 * wayfinder ticket 037 (backend: ticket 036) — a named place in the facility a permit's work is
 * located in. Flat, no `parentId` (034 resolution, decision 5).
 *
 * wayfinder ticket 044 made `GET /v1/areas` **scopable per contractor**, correcting what this
 * comment used to claim. When the deployment sets `AREA_VISIBILITY_SCOPED=TRUE` the server
 * narrows this app's list to areas this contractor proposed (and that were APPROVED) plus areas
 * explicitly granted to them via the officer-only `AreaGrant` routes; unset — the default — is the
 * old behaviour, every APPROVED area visible. There is no client-side flag and no query
 * parameter: the list call is identical either way. `GET /v1/areas/:id` is deliberately left
 * UNSCOPED, which is what lets `AreaPicker` still resolve and display an area a permit already
 * references but this contractor cannot see in the list.
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
