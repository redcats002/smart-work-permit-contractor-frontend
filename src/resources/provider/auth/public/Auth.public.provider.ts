import type {
  ICheckTokenResetPasswordPayload,
  ILoginPayload,
  IRequestResetPasswordPayload,
  IResetPasswordPayload
} from '@/models/request/auth/public/AuthReq.public.model'
import type {
  TActionCheckTokenResetPasswordResponse,
  TActionLoginResponse,
  TActionRequestResetPasswordResponse,
  TActionResetPasswordResponse
} from '@/models/response/auth/public/AuthRes.public.model'
import type { IApiErrorResponse } from '@/models/modules/error/ApiError.model'
import HttpRequest from '@/resources/HttpRequest'

/**
 * ⚠ STUB MODE — the backend `/auth/public` endpoints (docs/main/dev-handoff/01-backend-elysia-tasks.md
 * only promises "login + session/token issuance", nothing else is deployed yet) are not
 * reachable. While `USE_STUB_DATA` is true, `login` checks against an in-memory dev
 * credential and `requestPasswordReset` / `resetPassword` / `checkTokenResetPassword`
 * always succeed, so the login screen and the reset-password screen are both reviewable
 * offline — the same pattern as `Permit.provider.ts` / `Certificate.provider.ts`.
 *
 * This stub deliberately bypasses `Interceptors.ts` entirely (no HTTP call is made), so it
 * cannot exercise the 401 → logout path — that is verified separately, against a real (or
 * mocked) 401 response, not through this stub.
 *
 * To go live: set `USE_STUB_DATA = false` (one line). The real HTTP calls are already
 * wired below on every method — nothing else needs to change, and the base URL already
 * comes from `VITE_APP_API_URL` via `HttpRequest`.
 */
const USE_STUB_DATA = true

const STUB_CREDENTIAL = {
  email: 'contractor@smartworkpermit.dev',
  password: 'password123'
}

function stubInvalidCredentialError (): Promise<never> {
  // No backend error code exists for this (the backend doc names none for auth) — this
  // intentionally falls back to `error.unknown` in useApiError() rather than inventing one.
  const error: IApiErrorResponse = { code: 'INVALID_CREDENTIALS' }
  return Promise.reject(error)
}

export interface IAuthPublicProvider {
  login (payload: ILoginPayload): Promise<TActionLoginResponse>
  requestPasswordReset (payload: IRequestResetPasswordPayload): Promise<TActionRequestResetPasswordResponse>
  resetPassword (payload: IResetPasswordPayload): Promise<TActionResetPasswordResponse>
  checkTokenResetPassword (payload: ICheckTokenResetPasswordPayload): Promise<TActionCheckTokenResetPasswordResponse>
}

class AuthPublicProvider extends HttpRequest implements IAuthPublicProvider {
  private urlPrefix: string = '/api/v1/auth/public'

  public async login (payload: ILoginPayload): Promise<TActionLoginResponse> {
    if (USE_STUB_DATA) {
      if (payload.email !== STUB_CREDENTIAL.email || payload.password !== STUB_CREDENTIAL.password) {
        return stubInvalidCredentialError()
      }
      return {
        message: 'stub: logged in',
        data: {
          user: {
            id: 'stub-contractor-1',
            name: 'Somchai Contractor',
            firstName: 'Somchai',
            lastName: 'Contractor',
            email: STUB_CREDENTIAL.email,
            company: 'NNY Mechanical',
            role: 'contractor'
          },
          token: 'stub-access-token'
        }
      }
    }
    const response = await this.post(`${this.urlPrefix}/login`, payload)
    return response
  }

  public async requestPasswordReset (payload: IRequestResetPasswordPayload): Promise<TActionRequestResetPasswordResponse> {
    if (USE_STUB_DATA) {
      return { message: 'stub: reset link sent', data: true }
    }
    const response = await this.post(`${this.urlPrefix}/user-request-password-reset`, payload)
    return response
  }

  public async resetPassword (payload: IResetPasswordPayload): Promise<TActionResetPasswordResponse> {
    if (USE_STUB_DATA) {
      return { message: 'stub: password reset', data: true }
    }
    const response = await this.post(`${this.urlPrefix}/user-reset-password`, payload)
    return response
  }

  public async checkTokenResetPassword (payload: ICheckTokenResetPasswordPayload): Promise<TActionCheckTokenResetPasswordResponse> {
    if (USE_STUB_DATA) {
      return { message: 'stub: token check', data: { valid: Boolean(payload.token) } }
    }
    const response = await this.post(`${this.urlPrefix}/check-token-reset-password`, payload)
    return response
  }
}

export default AuthPublicProvider
