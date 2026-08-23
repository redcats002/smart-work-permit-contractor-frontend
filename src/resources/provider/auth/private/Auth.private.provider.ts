import type { TActionCheckSessionResponse, TActionLogoutResponse } from '@/models/response/auth/private/AuthRes.private.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IAuthPrivateProvider {
  logout (): Promise<TActionLogoutResponse>
  checkSession (): Promise<TActionCheckSessionResponse>
}

class AuthPrivateProvider extends HttpRequest implements IAuthPrivateProvider {
  private urlPrefix: string = '/api/v1/auth/user'

  public async logout (): Promise<TActionLogoutResponse> {
    const response = await this.post(`${this.urlPrefix}/logout`)
    return response
  }

  // Named for what it does: the endpoint validates the session cookie. Its path still says
  // "check-bearer" server-side, but the backend accepts no bearer token at all.
  public async checkSession (): Promise<TActionCheckSessionResponse> {
    const response = await this.get(`${this.urlPrefix}/check-bearer/user`)
    return response
  }
}

export default AuthPrivateProvider
