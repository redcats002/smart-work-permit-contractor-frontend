import type { IBasePaginationRequest } from '../Request.model'

/**
 * `GET /v1/facility-plans/`. `?active=true` is the currently-in-use set; `?active=false` is
 * retired plans; omit for everything (wayfinder 104). The picker asks for the full active set in
 * one page — pass an explicit `limit: 9999`, same convention `AreaPicker` already uses, rather
 * than relying on the server's default page size of 10.
 */
export interface IGetFacilityPlanListQuery extends IBasePaginationRequest {
  active?: boolean
}
