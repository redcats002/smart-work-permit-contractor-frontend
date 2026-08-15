import type { TActionCheckBearerTokenResponse, TActionLogoutResponse } from '@/models/response/auth/private/AuthRes.private.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * ⚠ STUB MODE — same reasoning as Auth.public.provider.ts: the backend auth endpoints
 * beyond login are not deployed. `logout` and `checkBearerToken` resolve locally so the
 * sidebar logout affordance is reviewable offline. To go live: set `USE_STUB_DATA = false`
 * (one line) — the real HTTP calls are already wired below.
 */
const USE_STUB_DATA = true

export interface IAuthPrivateProvider {
  logout (): Promise<TActionLogoutResponse>
  checkBearerToken (): Promise<TActionCheckBearerTokenResponse>
}

class AuthPrivateProvider extends HttpRequest implements IAuthPrivateProvider {
  private urlPrefix: string = '/api/v1/auth'

  public async logout (): Promise<TActionLogoutResponse> {
    if (USE_STUB_DATA) {
      return { message: 'stub: logged out', data: true }
    }
    const response = await this.post(`${this.urlPrefix}/logout`)
    return response
  }

  public async checkBearerToken (): Promise<TActionCheckBearerTokenResponse> {
    if (USE_STUB_DATA) {
      return { message: 'stub: token valid', data: true }
    }
    const response = await this.get(`${this.urlPrefix}/check-bearer/user`)
    return response
  }
}

export default AuthPrivateProvider
