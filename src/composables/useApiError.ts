import axios from 'axios'
import { EApiErrorCode } from '@/enums/modules/error/ApiErrorCode.enum'
import i18n from '@/plugins/I18n.plugin'
import type { IApiErrorResponse } from '@/models/modules/error/ApiError.model'

const KNOWN_CODES: string[] = Object.values(EApiErrorCode)

/**
 * Result of mapping a caught error through `useApiError().mapError()`.
 *
 * `message` is always the localized string — never the backend's raw
 * `message`, per the "backend errors are localized client-side" rule.
 * `code` is exposed separately so a caller can branch on it (e.g. send the
 * wizard back to step 3 on `EApiErrorCode.GAS_OUT_OF_RANGE`) without parsing
 * the localized string.
 */
export interface IApiErrorResult {
  /** The backend's machine-readable code, or `'unknown'` when the response carried none. */
  code: string
  /** Localized message — safe to render directly. */
  message: string
  /** True when `code` is a member of `EApiErrorCode`. */
  isKnown: boolean
  /** HTTP status, when the error came from a response at all (absent on a network failure). */
  status?: number
}

interface IUseApiError {
  mapError: (error: unknown) => IApiErrorResult
}

// The discriminator is `errorCode`; `code` is the numeric HTTP status. Duck-typing on either one
// being present is deliberate — a 404 or a validation 400 is a real backend body with no errorCode,
// and it must still be recognized as structured rather than logged as an unknown transport failure.
function isApiErrorResponse (value: unknown): value is IApiErrorResponse {
  if (typeof value !== 'object' || value === null) return false
  const candidate = value as { code?: unknown, errorCode?: unknown }
  return typeof candidate.code === 'number' || typeof candidate.errorCode === 'string'
}

/**
 * Pulls a structured `{ code, ... }` body out of a caught error.
 *
 * `HttpRequest`'s response interceptor (`onResponseError`) already unwraps a
 * failed request down to `error.response.data` before rejecting, so the
 * common case here is a plain object, not an `AxiosError`. An `AxiosError`
 * only reaches this function when the interceptor had nothing to unwrap —
 * a network failure, timeout, or a non-JSON error body — in which case there
 * is no backend `code` to read.
 */
function extractErrorPayload (error: unknown): IApiErrorResponse | undefined {
  if (isApiErrorResponse(error)) return error
  if (axios.isAxiosError(error) && isApiErrorResponse(error.response?.data)) {
    return error.response?.data
  }
  return undefined
}

/** Maps a caught HTTP error to a localized message, without ever rendering a backend-authored string. */
export function useApiError (): IUseApiError {
  function mapError (error: unknown): IApiErrorResult {
    const payload = extractErrorPayload(error)
    const errorCode = payload?.errorCode
    const isKnown = errorCode !== undefined && KNOWN_CODES.includes(errorCode)

    if (isKnown) {
      return {
        code: errorCode as string,
        message: i18n.global.t(`error.${errorCode}`),
        isKnown: true,
        status: payload?.code
      }
    }

    // No code at all (404, ownership 403, validation 400), an unrecognized code, or a
    // non-structured failure (network, timeout, 500 HTML page). Never silently swallow — and
    // never render payload.message, which is backend-authored English.
    console.error('[useApiError] Unhandled API error', error)

    return {
      code: errorCode ?? 'unknown',
      message: i18n.global.t('error.unknown'),
      isKnown: false,
      status: payload?.code
    }
  }

  return { mapError }
}
