export interface ISelectBranchPayload {
  branchId: number
}
export interface IApproveBranchPayload extends ISelectBranchPayload {}
export interface IRejectBranchPayload extends ISelectBranchPayload {}
