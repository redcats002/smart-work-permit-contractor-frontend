import axios from 'axios'
import { EApiErrorCode } from '@/enums/modules/error/ApiErrorCode.enum'
import i18n from '@/plugins/I18n.plugin'
import type { IApiErrorResponse, TApiErrorDetail } from '@/models/modules/error/ApiError.model'

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
  /** The backend's machine-readable code, or `'unknown'` when none could be read from the error. */
  code: string
  /** Localized message — safe to render directly. */
  message: string
  /** True when `code` is a member of `EApiErrorCode`. */
  isKnown: boolean
  /** Loosely-typed detail payload, if the backend sent one. */
  details?: TApiErrorDetail
}

interface IUseApiError {
  mapError: (error: unknown) => IApiErrorResult
}

function isApiErrorResponse (value: unknown): value is IApiErrorResponse {
  return typeof value === 'object' && value !== null && typeof (value as { code?: unknown }).code === 'string'
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
    const isKnown = payload !== undefined && KNOWN_CODES.includes(payload.code)

    if (payload !== undefined && isKnown) {
      return {
        code: payload.code,
        message: i18n.global.t(`error.${payload.code}`),
        isKnown: true,
        details: payload.details
      }
    }

    // Unknown code, or a non-structured error (network failure, 500 HTML page,
    // timeout) — never silently swallow; log the real error for diagnosis.
    console.error('[useApiError] Unhandled API error', error)

    return {
      code: payload?.code ?? 'unknown',
      message: i18n.global.t('error.unknown'),
      isKnown: false,
      details: payload?.details
    }
  }

  return { mapError }
}
