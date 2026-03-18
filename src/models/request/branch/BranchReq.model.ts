import type { BranchFormValues } from '@/pages/setting/pages/other/pages/branch/pages/create/schema/branch.schema'
import type { IBasePaginationRequest } from '../Request.model'

export interface IActionBranchPayload extends ICreateBranchPayload, IUpdateBranchPayload {}
export interface ICreateBranchPayload extends BranchFormValues {}
export interface IUpdateBranchPayload extends ICreateBranchPayload {}

export interface IGetBranchList extends IBasePaginationRequest {}
