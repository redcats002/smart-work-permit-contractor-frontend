import type { IFacilityPlan } from '@/models/modules/facility-plan/FacilityPlan.model'
import type { IBaseSuccessResponse } from '../Response.model'

/** GET /facility-plans/active — `data` is `null` when no plan has ever been activated. */
export type TGetActiveFacilityPlanResponse = IBaseSuccessResponse<IFacilityPlan | null>

/** GET /facility-plans/:id — one version by id, active or not. 404 if the id doesn't exist. */
export type TGetFacilityPlanResponse = IBaseSuccessResponse<IFacilityPlan>
