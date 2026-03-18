import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface ICustomerOccupationList extends IEntity {
  name: string
}
export interface ICustomerOccupationById {}

export type TGetCustomerOccupationListResponse = IBasePaginationResponse<ICustomerOccupationList>
export type TGetCustomerOccupationByIdResponse = IBaseSuccessResponse<ICustomerOccupationById>
export type TActionCustomerOccupation = IBaseSuccessResponse<boolean>
