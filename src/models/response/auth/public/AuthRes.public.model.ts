import type { IUser } from '@/stores/Auth'
import type { IBranchResponse } from '@/pages/auth/pages/login/components/select-branch/SelectBranchBody.vue'
import type { IBaseSuccessResponse } from '../../Response.model'

export interface IPreLoginResponse {
  isNew: boolean
}
export interface ILoginResponse {
  user: IUser
  token: string
  branches: IBranchResponse[]
}
export interface IRegisterResponse {
  user: IUser
  token: string
  branches: IBranchResponse[]
}

export type TActionPreLoginResponse = IBaseSuccessResponse<IPreLoginResponse>
export type TActionLoginResponse = IBaseSuccessResponse<ILoginResponse>
export type TActionRegisterResponse = IBaseSuccessResponse<IRegisterResponse>
export type TActionRequestResetPasswordResponse = IBaseSuccessResponse<boolean>
export type TActionResetPasswordResponse = IBaseSuccessResponse<boolean>
export type TActionCheckTokenResetPasswordResponse = IBaseSuccessResponse<boolean>
