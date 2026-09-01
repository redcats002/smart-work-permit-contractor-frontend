import type { TAreaStatus } from '@/enums/modules/area/AreaStatus.enum'
import type { IPermitPosition } from '@/models/modules/permit/Permit.model'
import type { IBasePaginationRequest } from '../Request.model'

/**
 * `GET /v1/areas`. Every role may read this, filterable only by status (034 resolution — no
 * per-contractor scoping). The picker asks for the full `APPROVED` set in one page — pass an
 * explicit `limit: 9999` at the call site rather than relying on the server's default page size
 * of 10, which would silently truncate the list.
 */
export interface IGetAreaListQuery extends IBasePaginationRequest {
  status?: TAreaStatus
}

/**
 * `POST /v1/areas` — contractor only, always creates `PENDING`. `position` is the proposer's own
 * best guess at a default pin; omitted here deliberately by the in-wizard "propose an area"
 * modal (name only) — the area still needs a safety-officer `APPROVED` status before any permit
 * may reference it regardless of whether a position was supplied.
 */
export interface ICreateAreaPayload {
  name: string
  position?: IPermitPosition | null
}
