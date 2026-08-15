export interface ILoginPayload {
  email: string
  password: string
}
export interface IRequestResetPasswordPayload {
  email: string
}
export interface IResetPasswordPayload {
  token: string
  newPassword: string
  confirmNewPassword: string
}
export interface ICheckTokenResetPasswordPayload {
  token: string
}
