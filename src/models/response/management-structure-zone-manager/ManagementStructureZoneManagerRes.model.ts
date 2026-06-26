import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IManagementStructureZoneManagerList extends IEntity {
  name: string
}
export interface IManagementStructureZoneManagerById {
  name: string
}

export type TGetManagementStructureZoneManagerListResponse = IBasePaginationResponse<IManagementStructureZoneManagerList>
export type TGetManagementStructureZoneManagerByIdResponse = IBaseSuccessResponse<IManagementStructureZoneManagerById>
export type TActionManagementStructureZoneManager = IBaseSuccessResponse<boolean>
