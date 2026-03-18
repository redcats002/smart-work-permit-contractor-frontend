export interface IActionLoginPayload extends IPreLoginPayload, ILoginPayload, IRegisterPayload {}
export interface IPreLoginPayload {
  email: string
}
export interface ILoginPayload {
  email: string
  password: string
}
export interface IRegisterPayload {
  email: string
  password: string
  confirmPassword: string
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
