import type { EManagementPosition } from '@/enums/modules/management-structure/ManagementPosition.enum'
import type { IBasePaginationRequest } from '../Request.model'

export interface ICreateManagementPositionPayload {
  managementPosition: EManagementPosition
  name: string
  parentId?: number
}

export interface IUpdateManagementPositionPayload {
  managementPosition: EManagementPosition
  name: string
  parentId?: number | null
}

export interface IGetManagementPositionList extends IBasePaginationRequest {
  managementPosition?: EManagementPosition
  parentId?: number
}
