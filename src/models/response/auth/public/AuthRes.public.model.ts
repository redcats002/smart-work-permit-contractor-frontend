import type { IUser } from '@/stores/Auth'
import type { IBaseSuccessResponse } from '../../Response.model'
import type { IAuthBranchList } from '../private/AuthRes.private.model'

export interface IPreLoginResponse {
  isNew: boolean
}
export interface ILoginResponse {
  user: IUser
  token: string
}
export interface IRegisterResponse {
  user: IUser
  token: string
  branches: IAuthBranchList[]
}

export type TActionPreLoginResponse = IBaseSuccessResponse<IPreLoginResponse>
export type TActionLoginResponse = IBaseSuccessResponse<ILoginResponse>
export type TActionRegisterResponse = IBaseSuccessResponse<IRegisterResponse>
export type TActionRequestResetPasswordResponse = IBaseSuccessResponse<boolean>
export type TActionResetPasswordResponse = IBaseSuccessResponse<boolean>
export type TActionCheckTokenResetPasswordResponse = IBaseSuccessResponse<boolean>
