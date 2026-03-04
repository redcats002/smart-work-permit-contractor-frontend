import type { IBasePaginationRequest } from '../Request.model'

export interface ICreateCustomerPayload {}
export interface IUpdateCustomerPayload extends ICreateCustomerPayload {}

export interface IGetCustomerList extends IBasePaginationRequest {}
