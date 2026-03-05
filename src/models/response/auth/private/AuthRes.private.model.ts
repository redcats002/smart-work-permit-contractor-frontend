import type { IBranch, IToken } from '@/stores/Auth'
import type { IBranchResponse } from '@/pages/auth/pages/login/components/select-branch/SelectBranchBody.vue'
import type { IBaseSuccessResponse } from '../../Response.model'

export interface ISelectBranchResponse {
  branch: IBranch
  token: IToken
}
export interface IApproveBranchResponse extends ISelectBranchResponse {
  branches: IBranchResponse[]
}
export interface IRejectBranchResponse extends ISelectBranchResponse {
  branches: IBranchResponse[]
}

export type TActionLogoutResponse = IBaseSuccessResponse<boolean>
export type TActionCheckBearerTokenResponse = IBaseSuccessResponse<boolean>
export type TActionSelectBranchResponse = IBaseSuccessResponse<ISelectBranchResponse>
export type TActionApproveBranchResponse = IBaseSuccessResponse<IApproveBranchResponse>
export type TActionRejectBranchResponse = IBaseSuccessResponse<IRejectBranchResponse>
