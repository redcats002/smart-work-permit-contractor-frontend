import type { IUser } from '@/stores/Auth'
import type { IBaseSuccessResponse } from '../../Response.model'

export interface ILoginResponse {
  user: IUser
  token: string
}

export type TActionLoginResponse = IBaseSuccessResponse<ILoginResponse>
export type TActionRequestResetPasswordResponse = IBaseSuccessResponse<boolean>
export type TActionResetPasswordResponse = IBaseSuccessResponse<boolean>
export interface ICheckTokenResetPasswordResponse {
  valid: boolean
}

export type TActionCheckTokenResetPasswordResponse = IBaseSuccessResponse<ICheckTokenResetPasswordResponse>
