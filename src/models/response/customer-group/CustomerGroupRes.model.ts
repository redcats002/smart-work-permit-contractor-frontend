import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface ICustomerGroupList extends IEntity {
  name: string
}
export interface ICustomerGroupById {}

export type TGetCustomerGroupListResponse = IBasePaginationResponse<ICustomerGroupList>
export type TGetCustomerGroupByIdResponse = IBaseSuccessResponse<ICustomerGroupById>
export type TActionCustomerGroup = IBaseSuccessResponse<boolean>
