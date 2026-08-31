import type { TUserRole } from '@/stores/Auth'

export interface ILoginPayload {
  email: string
  password: string
}
// POST /api/v1/auth/demo-login — server-provisioned demo sign-in, no password. See
// docs/wayfinder/tickets/023-server-issued-demo-login.md. This app only ever sends `contractor`,
// but the wire type is the full role union so a bad literal is caught by the type checker.
export interface IDemoLoginPayload {
  role: TUserRole
}
export interface IRequestResetPasswordPayload {
  email: string
}
export interface IResetPasswordPayload {
  token: string
  newPassword: string
  confirmNewPassword: string
}
