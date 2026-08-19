import { describe, expect, it, vi } from 'vitest'
import type { AxiosError, AxiosResponse } from 'axios'
import { onResponse, onResponseError } from '@/resources/Interceptors'

const asResponse = (data: unknown, headers: Record<string, string> = {}): AxiosResponse =>
  ({ data, headers } as unknown as AxiosResponse)

const asError = (status: number, data: unknown, url: string): AxiosError =>
  ({ response: { status, data }, config: { url }, status } as unknown as AxiosError)

describe('onResponse — transport (API-002)', () => {
  it('passes the success envelope through whole, so providers keep their IBaseSuccessResponse typing', async () => {
    const body = { message: 'success', data: { id: 'WP-HOT-20260817-001' } }
    await expect(onResponse(asResponse(body))).resolves.toEqual(body)
  })

  it('keeps pagination meta alongside data', async () => {
    const body = { message: 'success', data: [], count: 0, page: 1, limit: 10, totalPage: 0 }
    await expect(onResponse(asResponse(body))).resolves.toEqual(body)
  })

  it('does not rewrite free-form keys — a closure checklist must survive verbatim', async () => {
    const body = { message: 'success', data: { closureChecklist: { 'gas_test_done': true, 'area-clear': true } } }
    await expect(onResponse(asResponse(body))).resolves.toEqual(body)
  })
})

describe('onResponseError — error envelope (API-002)', () => {
  it('rejects with the backend body { code, message, errorCode } untouched', async () => {
    const body = { code: 403, message: 'Fire watch has not elapsed', errorCode: 'FIRE_WATCH_NOT_ELAPSED' }

    await expect(onResponseError(asError(403, body, '/api/v1/permits/X/close'))).rejects.toEqual(body)
  })

  it('does not log out on a 401 from an auth endpoint — that is a failed sign-in, not an expired session', async () => {
    const body = { code: 401, message: 'Unauthorized', errorCode: 'UNAUTHENTICATED' }
    vi.stubGlobal('location', { pathname: '/', origin: 'http://localhost:8080', href: '' })

    await expect(
      onResponseError(asError(401, body, '/api/v1/auth/user/public/login'))
    ).rejects.toEqual(body)

    vi.unstubAllGlobals()
  })
})
