import type {
  ICheckTokenResetPasswordPayload,
  ILoginPayload,
  IPreLoginPayload,
  IRegisterPayload,
  IRequestResetPasswordPayload,
  IResetPasswordPayload
} from '@/models/request/auth/public/AuthReq.public.model'
import type {
  TActionCheckTokenResetPasswordResponse,
  TActionLoginResponse,
  TActionPreLoginResponse,
  TActionRegisterResponse,
  TActionRequestResetPasswordResponse,
  TActionResetPasswordResponse
} from '@/models/response/auth/public/AuthRes.public.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IAuthPublicProvider {
  preLogin (payload: IPreLoginPayload): Promise<TActionPreLoginResponse>
  login (payload: ILoginPayload): Promise<TActionLoginResponse>
  register (payload: IRegisterPayload): Promise<TActionRegisterResponse>
  requestPasswordReset (payload: IRequestResetPasswordPayload): Promise<TActionRequestResetPasswordResponse>
  resetPassword (payload: IResetPasswordPayload): Promise<TActionResetPasswordResponse>
  checkTokenResetPassword (payload: ICheckTokenResetPasswordPayload): Promise<TActionCheckTokenResetPasswordResponse>
}

class AuthPublicProvider extends HttpRequest implements IAuthPublicProvider {
  private urlPrefix: string = '/api/v1/auth/public'

  public async preLogin (payload: IPreLoginPayload): Promise<TActionPreLoginResponse> {
    const response = await this.post(`${this.urlPrefix}/pre-login`, payload)
    return response
  }

  public async login (payload: ILoginPayload): Promise<TActionLoginResponse> {
    const response = await this.post(`${this.urlPrefix}/login`, payload)
    return response
  }

  public async register (payload: IRegisterPayload): Promise<TActionRegisterResponse> {
    const response = await this.post(`${this.urlPrefix}/register`, payload)
    return response
  }

  public async requestPasswordReset (payload: IRequestResetPasswordPayload): Promise<TActionRequestResetPasswordResponse> {
    const response = await this.post(`${this.urlPrefix}/user-request-password-reset`, payload)
    return response
  }

  public async resetPassword (payload: IResetPasswordPayload): Promise<TActionResetPasswordResponse> {
    const response = await this.post(`${this.urlPrefix}/user-reset-password`, payload)
    return response
  }

  public async checkTokenResetPassword (payload: ICheckTokenResetPasswordPayload): Promise<TActionCheckTokenResetPasswordResponse> {
    const response = await this.post(`${this.urlPrefix}/check-token-reset-password`, payload)
    return response
  }
}

export default AuthPublicProvider
