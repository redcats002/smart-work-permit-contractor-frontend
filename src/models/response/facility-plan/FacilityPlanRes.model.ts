import type { IFacilityPlan } from '@/models/modules/facility-plan/FacilityPlan.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

/**
 * GET /v1/facility-plans/ — flat, paginated (wayfinder 104; replaces the pre-104 singular
 * `GET /facility-plans/active`, which no longer exists on the wire). See
 * `IGetFacilityPlanListQuery` for the `active` filter.
 */
export type TGetFacilityPlanListResponse = IBasePaginationResponse<IFacilityPlan>

/** GET /facility-plans/:id — one plan by id, active or not. 404 if the id doesn't exist. */
export type TGetFacilityPlanResponse = IBaseSuccessResponse<IFacilityPlan>
