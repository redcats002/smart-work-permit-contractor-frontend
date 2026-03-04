import type { IEntity } from '@/models/Global.model'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IJobList extends IEntity {
  name: string
}
export interface IJobById {}

export type TGetJobListResponse = IBasePaginationResponse<IJobList>
export type TGetJobByIdResponse = IBaseSuccessResponse<IJobById>
export type TActionJob = IBaseSuccessResponse<boolean>
