import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IManagementStructureLineHeadList extends IEntity {
  name: string
}
export interface IManagementStructureLineHeadById {
  name: string
}

export type TGetManagementStructureLineHeadListResponse = IBasePaginationResponse<IManagementStructureLineHeadList>
export type TGetManagementStructureLineHeadByIdResponse = IBaseSuccessResponse<IManagementStructureLineHeadById>
export type TActionManagementStructureLineHead = IBaseSuccessResponse<boolean>
