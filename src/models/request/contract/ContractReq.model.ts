import type { IBasePaginationRequest } from '../Request.model'

export interface IActionContractPayload extends ICreateContractPayload, IUpdateContractPayload {}
export interface ICreateContractPayload {}
export interface IUpdateContractPayload extends ICreateContractPayload {}

export interface IGetContractList extends IBasePaginationRequest {}
