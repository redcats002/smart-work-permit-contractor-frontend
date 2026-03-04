import type { IBasePaginationRequest } from '../Request.model'

export interface ICreateCustomerGroupPayload {}
export interface IUpdateCustomerGroupPayload extends ICreateCustomerGroupPayload {}

export interface IGetCustomerGroupList extends IBasePaginationRequest {}
