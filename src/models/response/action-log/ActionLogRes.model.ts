import type { IEntity } from '@/models/Global.model'
import type { ActionLogType } from '@/enums/modules/action-log/ActionLogType.enum'
import type { IBasePaginationResponse, IBaseSuccessResponse } from '../Response.model'

export interface IActionLogList extends IEntity {
  createdAtDate: string
  createdAtTime: string
  userId?: number // TODO: future key
  userNo: string
  userName: string
  frontendMenuName: string
  action: ActionLogType
  ref: string
  branch: string
}
export interface IActionLogById extends IEntity {}

export type TGetActionLogListResponse = IBasePaginationResponse<IActionLogList>
export type TGetActionLogByIdResponse = IBaseSuccessResponse<IActionLogById>
export type TActionActionLog = IBaseSuccessResponse<boolean>
