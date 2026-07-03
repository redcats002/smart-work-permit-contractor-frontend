import type { EManagementPosition } from '@/enums/modules/management-structure/ManagementPosition.enum'
import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IManagementPositionChild {
  id: number
  managementPosition: EManagementPosition
  name: string
}

export interface IManagementPositionList extends IEntity {
  managementPosition: EManagementPosition
  name: string
  children?: IManagementPositionChild[]
}

export interface IManagementPositionParent {
  id: number
  managementPosition: EManagementPosition
  name: string
}

export interface IManagementPositionById {
  id: number
  managementPosition: EManagementPosition
  name: string
  parentId?: number
  parent?: IManagementPositionParent
  children?: IManagementPositionChild[]
}

export type TGetManagementPositionListResponse = IBasePaginationResponse<IManagementPositionList>
export type TGetManagementPositionByIdResponse = IBaseSuccessResponse<IManagementPositionById>
export type TActionManagementPosition = IBaseSuccessResponse<boolean>
