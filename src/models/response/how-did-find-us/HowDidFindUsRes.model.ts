import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IHowDidFindUsList extends IEntity {
  name: string
}
export interface IHowDidFindUsById {}

export type TGetHowDidFindUsListResponse = IBasePaginationResponse<IHowDidFindUsList>
export type TGetHowDidFindUsByIdResponse = IBaseSuccessResponse<IHowDidFindUsById>
export type TActionHowDidFindUs = IBaseSuccessResponse<boolean>
