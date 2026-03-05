import type { IBasePaginationRequest } from '../Request.model'

export interface IActionHowDidFindUsPayload extends ICreateHowDidFindUsPayload, IUpdateHowDidFindUsPayload {}
export interface ICreateHowDidFindUsPayload {
  name: string
}
export interface IUpdateHowDidFindUsPayload extends ICreateHowDidFindUsPayload {}

export interface IGetHowDidFindUsList extends IBasePaginationRequest {}
