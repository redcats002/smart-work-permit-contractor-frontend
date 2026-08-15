import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setLocale } from '@/plugins/I18n.plugin'
import { EApiErrorCode } from '@/enums/modules/error/ApiErrorCode.enum'
import { useApiError } from '@/composables/useApiError'
import en from '@/locales/en/error'

describe('useApiError', () => {
  beforeEach(() => {
    setLocale('en')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('maps a known code to its localized message and marks it known', () => {
    const { mapError } = useApiError()

    const result = mapError({ code: EApiErrorCode.GAS_OUT_OF_RANGE })

    expect(result.message).toBe(en.GAS_OUT_OF_RANGE)
    expect(result.code).toBe(EApiErrorCode.GAS_OUT_OF_RANGE)
    expect(result.isKnown).toBe(true)
  })

  it('passes through the detail payload for a known code', () => {
    const { mapError } = useApiError()
    const details = { failedReadings: ['lel', 'o2'] }

    const result = mapError({ code: EApiErrorCode.GAS_OUT_OF_RANGE, details })

    expect(result.details).toEqual(details)
  })

  it('falls back to the unknown message and logs when the code is not recognized', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    const { mapError } = useApiError()
    const error = { code: 'SOME_FUTURE_CODE' }

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
      response: { data: { code: EApiErrorCode.ENTRANTS_STILL_INSIDE, details: { count: 2 } } }
    }

    const result = mapError(axiosLikeError)

    expect(result.message).toBe(en.ENTRANTS_STILL_INSIDE)
    expect(result.isKnown).toBe(true)
    expect(result.details).toEqual({ count: 2 })
  })

  it('never renders the backend-supplied message string directly', () => {
    const { mapError } = useApiError()

    const result = mapError({ code: EApiErrorCode.CERT_EXPIRED, message: 'raw backend string' })

    expect(result.message).not.toBe('raw backend string')
    expect(result.message).toBe(en.CERT_EXPIRED)
  })

  it('localizes to Thai when the active locale is th', () => {
    setLocale('th')
    const { mapError } = useApiError()

    const result = mapError({ code: EApiErrorCode.FIRE_WATCH_NOT_ELAPSED })

    expect(result.message).not.toBe(en.FIRE_WATCH_NOT_ELAPSED)
    expect(result.isKnown).toBe(true)
  })
})
