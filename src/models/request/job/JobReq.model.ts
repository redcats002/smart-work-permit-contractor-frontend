import type { IBasePaginationRequest } from '../Request.model'

export interface ICreateJobPayload {}
export interface IUpdateJobPayload extends ICreateJobPayload {}

export interface IGetJobList extends IBasePaginationRequest {}
