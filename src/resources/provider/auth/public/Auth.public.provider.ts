import type {
  ILoginPayload,
  IRequestResetPasswordPayload,
  IResetPasswordPayload
} from '@/models/request/auth/public/AuthReq.public.model'
import type {
  TActionLoginResponse,
  TActionRequestResetPasswordResponse,
  TActionResetPasswordResponse
} from '@/models/response/auth/public/AuthRes.public.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * Live against the real auth module (API-003). Two things about it are unusual and are why the
 * types here do not reuse `IBaseSuccessResponse`:
 *
 * - `login` answers `{ success, data: { token, user } }` — the one endpoint that does not use the
 *   `{ message, data }` envelope.
 * - the password-reset endpoints answer `{ message: 'success' }` with **no `data` key at all**.
 *
 * The credential is a better-auth session cookie, not the returned token: `Authorization: Bearer`
 * is rejected with 401. `HttpRequest` already sends `withCredentials: true`; the API must answer
 * with this app's exact origin in CORS_ORIGIN for the cookie to stick.
 *
 * There is no token-probe endpoint: a reset token is only ever validated by the reset call itself,
 * which answers 400 for an expired or forged one.
 *
 * There is no demo/trial sign-in here and there must never be one again: wayfinder ticket 042
 * deleted `POST /api/v1/auth/demo-login` from the API outright (owner ruling 2026-09-08 — no demo
 * environment will exist), so a call to it would 404 on every deployment.
 */
export interface IAuthPublicProvider {
  login (payload: ILoginPayload): Promise<TActionLoginResponse>
  requestPasswordReset (payload: IRequestResetPasswordPayload): Promise<TActionRequestResetPasswordResponse>
  resetPassword (payload: IResetPasswordPayload): Promise<TActionResetPasswordResponse>
}

class AuthPublicProvider extends HttpRequest implements IAuthPublicProvider {
  private urlPrefix: string = '/api/v1/auth/user/public'

  public async login (payload: ILoginPayload): Promise<TActionLoginResponse> {
    const response = await this.post(`${this.urlPrefix}/login`, payload)
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
}

export default AuthPublicProvider
