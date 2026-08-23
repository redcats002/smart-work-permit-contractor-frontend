import type { IUser } from '@/stores/Auth'

export interface ILoginResponse {
  user: IUser
  token: string
}

// Login does NOT use the { message, data } envelope — it answers { success, data }.
export interface TActionLoginResponse {
  success: boolean
  data: ILoginResponse
}

// The password-reset endpoints answer { message: 'success' } with no data key at all.
export interface TActionMessageOnlyResponse {
  message: string
}

export type TActionRequestResetPasswordResponse = TActionMessageOnlyResponse
export type TActionResetPasswordResponse = TActionMessageOnlyResponse
