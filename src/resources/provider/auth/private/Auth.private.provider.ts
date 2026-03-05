import type { TActionCheckBearerTokenResponse, TActionLogoutResponse } from '@/models/response/auth/private/AuthRes.private.model'
import HttpRequest from '@/resources/HttpRequest'

export interface IAuthPublicProvider {
  logout (): Promise<TActionLogoutResponse>
  checkBearerToken (): Promise<TActionCheckBearerTokenResponse>
}

class AuthPublicProvider extends HttpRequest implements IAuthPublicProvider {
  private urlPrefix: string = '/api/v1/auth'

  public async logout (): Promise<TActionLogoutResponse> {
    const response = await this.post(`${this.urlPrefix}/logout`)
    return response
  }

  public async checkBearerToken (): Promise<TActionCheckBearerTokenResponse> {
    const response = await this.get(`${this.urlPrefix}/check-bearer/user`)
    return response
  }
}

export default AuthPublicProvider
