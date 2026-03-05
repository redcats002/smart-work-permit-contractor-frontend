import type { IBasePaginationRequest } from '../Request.model'

export interface IActionCustomerOccupationPayload extends ICreateCustomerOccupationPayload, IUpdateCustomerOccupationPayload {}
export interface ICreateCustomerOccupationPayload {
  name: string
}
export interface IUpdateCustomerOccupationPayload extends ICreateCustomerOccupationPayload {}

export interface IGetCustomerOccupationList extends IBasePaginationRequest {}
