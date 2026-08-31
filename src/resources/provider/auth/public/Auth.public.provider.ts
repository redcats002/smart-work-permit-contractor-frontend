import type {
  IDemoLoginPayload,
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
 * `demoLogin` hits `/api/v1/auth/demo-login`, a sibling of `/api/v1/auth/user/public` rather than
 * a child of it, so it does not go through `urlPrefix`. It returns a session through the exact
 * same shape as `login` (`docs/wayfinder/tickets/023-server-issued-demo-login.md`) — the server
 * signs the caller into a dedicated demo account, so no password ever reaches this client. Off
 * unless the deployment sets `DEMO_LOGIN_ENABLED=TRUE`; refuses 404 otherwise, with no `errorCode`.
 */
export interface IAuthPublicProvider {
  login (payload: ILoginPayload): Promise<TActionLoginResponse>
  demoLogin (payload: IDemoLoginPayload): Promise<TActionLoginResponse>
  requestPasswordReset (payload: IRequestResetPasswordPayload): Promise<TActionRequestResetPasswordResponse>
  resetPassword (payload: IResetPasswordPayload): Promise<TActionResetPasswordResponse>
}

class AuthPublicProvider extends HttpRequest implements IAuthPublicProvider {
  private urlPrefix: string = '/api/v1/auth/user/public'

  public async login (payload: ILoginPayload): Promise<TActionLoginResponse> {
    const response = await this.post(`${this.urlPrefix}/login`, payload)
    return response
  }

  public async demoLogin (payload: IDemoLoginPayload): Promise<TActionLoginResponse> {
    const response = await this.post('/api/v1/auth/demo-login', payload)
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
