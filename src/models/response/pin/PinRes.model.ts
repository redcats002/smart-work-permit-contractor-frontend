import type { IPin } from '@/models/modules/pin/Pin.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

/** GET /v1/pins/ — flat, paginated. See `IGetPinListQuery` for the `planId`/`active` filters. */
export type TGetPinListResponse = IBasePaginationResponse<IPin>

/** GET /v1/pins/:id — resolves ANY pin by id regardless of active status (or its plan's). */
export type TGetPinDetailResponse = IBaseSuccessResponse<IPin>
