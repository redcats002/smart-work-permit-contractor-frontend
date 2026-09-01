import type { IArea } from '@/models/modules/area/Area.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export type TGetAreaListResponse = IBasePaginationResponse<IArea>
export type TGetAreaDetailResponse = IBaseSuccessResponse<IArea>
export type TCreateAreaResponse = IBaseSuccessResponse<IArea>
