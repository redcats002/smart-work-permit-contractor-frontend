import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setLocale } from '@/plugins/I18n.plugin'
import { API_ERROR_CODES, EApiErrorCode } from '@/enums/modules/error/ApiErrorCode.enum'
import { useApiError } from '@/composables/useApiError'
import en from '@/locales/en/error'
import th from '@/locales/th/error'

describe('useApiError', () => {
  beforeEach(() => {
    setLocale('en')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('maps a known code to its localized message and marks it known', () => {
    const { mapError } = useApiError()

    const result = mapError({ code: 400, errorCode: EApiErrorCode.GAS_OUT_OF_RANGE })

    expect(result.message).toBe(en.GAS_OUT_OF_RANGE)
    expect(result.code).toBe(EApiErrorCode.GAS_OUT_OF_RANGE)
    expect(result.isKnown).toBe(true)
  })

  it('exposes the HTTP status separately from the machine code', () => {
    const { mapError } = useApiError()

    const result = mapError({ code: 403, errorCode: EApiErrorCode.CERT_EXPIRED })

    expect(result.status).toBe(403)
    expect(result.code).toBe(EApiErrorCode.CERT_EXPIRED)
  })

  // Drives the whole vocabulary from the enum, so adding a code without copy fails here rather
  // than silently rendering the generic fallback in production.
  it('resolves every code in the vocabulary to distinct EN and TH copy', () => {
    const { mapError } = useApiError()
    const seen = new Set<string>()

    API_ERROR_CODES.forEach((code: string): void => {
      setLocale('en')
      const english = mapError({ code: 400, errorCode: code })
      expect(english.isKnown).toBe(true)
      expect(english.message).toBe((en as Record<string, string>)[code])
      expect(english.message).not.toBe(en.unknown)
      expect(seen.has(english.message)).toBe(false)
      seen.add(english.message)

      setLocale('th')
      const thai = mapError({ code: 400, errorCode: code })
      expect(thai.message).toBe((th as Record<string, string>)[code])
    })
  })

  it('falls back to the unknown message and logs when the code is not recognized', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const { mapError } = useApiError()
    const error = { code: 400, errorCode: 'SOME_FUTURE_CODE' }

    const result = mapError(error)

    expect(result.message).toBe(en.unknown)
    expect(result.isKnown).toBe(false)
    expect(result.code).toBe('SOME_FUTURE_CODE')
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(String), error)
  })

  it('falls back to the unknown message for a network error with no response body', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const { mapError } = useApiError()
    const networkError = { isAxiosError: true, message: 'Network Error', response: undefined }

    const result = mapError(networkError)

    expect(result.message).toBe(en.unknown)
    expect(result.isKnown).toBe(false)
    expect(result.code).toBe('unknown')
    expect(consoleErrorSpy).toHaveBeenCalled()
  })

  it('falls back to the unknown message for a non-structured error (e.g. a 500 HTML page)', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const { mapError } = useApiError()

    const result = mapError(new Error('<html>Internal Server Error</html>'))

    expect(result.message).toBe(en.unknown)
    expect(result.isKnown).toBe(false)
  })

  it('reads a known code out of an AxiosError-shaped response body', () => {
    const { mapError } = useApiError()
    const axiosLikeError = {
      isAxiosError: true,
      response: { data: { code: 403, errorCode: EApiErrorCode.ENTRANTS_STILL_INSIDE } }
    }

    const result = mapError(axiosLikeError)

    expect(result.message).toBe(en.ENTRANTS_STILL_INSIDE)
    expect(result.isKnown).toBe(true)
  })

  // A 404, an ownership 403 and a validation 400 are real backend bodies that carry no errorCode
  // at all — that absence is normal, not an anomaly.
  it('falls back for a structured body that carries no errorCode', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const { mapError } = useApiError()

    const result = mapError({ code: 404, message: 'Permit not found' })

    expect(result.message).toBe(en.unknown)
    expect(result.isKnown).toBe(false)
    expect(result.status).toBe(404)
  })

  it('never renders the backend-supplied message string directly', () => {
    const { mapError } = useApiError()

    const result = mapError({ code: 403, errorCode: EApiErrorCode.CERT_EXPIRED, message: 'raw backend string' })

    expect(result.message).not.toBe('raw backend string')
    expect(result.message).toBe(en.CERT_EXPIRED)
  })

  it('localizes to Thai when the active locale is th', () => {
    setLocale('th')
    const { mapError } = useApiError()

    const result = mapError({ code: 403, errorCode: EApiErrorCode.FIRE_WATCH_NOT_ELAPSED })

    expect(result.message).not.toBe(en.FIRE_WATCH_NOT_ELAPSED)
    expect(result.isKnown).toBe(true)
  })
})
