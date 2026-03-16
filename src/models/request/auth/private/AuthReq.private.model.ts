import type { TBaseParamsId } from '@/models/response/Response.model'

export interface ISelectBranchPayload {
  branchId: TBaseParamsId
}
export interface IApproveBranchPayload extends ISelectBranchPayload {}
export interface IRejectBranchPayload extends ISelectBranchPayload {}
