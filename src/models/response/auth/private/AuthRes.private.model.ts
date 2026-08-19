export interface TActionLogoutResponse {
  success: boolean
}

export interface ISessionUser {
  userId: string
  email: string
  firstName: string | null
  lastName: string | null
}

export interface TActionCheckSessionResponse {
  success: boolean
  user: ISessionUser
}
