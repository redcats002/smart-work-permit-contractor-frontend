import type { TAreaStatus } from '@/enums/modules/area/AreaStatus.enum'
import type { IPermitPosition } from '@/models/modules/permit/Permit.model'
import type { IBasePaginationRequest } from '../Request.model'

/**
 * `GET /v1/areas`. Every role may read this; the only client-supplied filter is `status`. The
 * picker asks for the full `APPROVED` set in one page — pass an explicit `limit: 9999` at the call
 * site rather than relying on the server's default page size of 10, which would silently truncate
 * the list.
 *
 * wayfinder ticket 044: the server may ALSO narrow the result to areas this contractor proposed or
 * was granted, when the deployment sets `AREA_VISIBILITY_SCOPED=TRUE`. That is entirely
 * server-side and composes with `status` — there is no query parameter for it, so nothing about
 * this type changes. Do not add one, and do not try to detect the flag from the client: a shorter
 * list is indistinguishable from a deployment that simply has fewer approved areas, and it does
 * not need to be distinguished.
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
