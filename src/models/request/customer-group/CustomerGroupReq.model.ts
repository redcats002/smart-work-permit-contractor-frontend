import type { IBasePaginationRequest } from '../Request.model'

export interface IActionCustomerGroupPayload extends ICreateCustomerGroupPayload, IUpdateCustomerGroupPayload {}
export interface ICreateCustomerGroupPayload {
  name: string
}
export interface IUpdateCustomerGroupPayload extends ICreateCustomerGroupPayload {}

export interface IGetCustomerGroupList extends IBasePaginationRequest {}
