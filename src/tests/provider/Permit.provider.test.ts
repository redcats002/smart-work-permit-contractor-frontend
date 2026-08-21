import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IPermitProvider } from '@/resources/provider/permit/Permit.provider'
import PermitProvider from '@/resources/provider/permit/Permit.provider'

/**
 * The stub this provider used to resolve from is gone (API-006) — it described a shape the
 * backend never sends. What is worth pinning now is the wire contract: the exact path and verb of
 * every call, and the payload semantics that destroy data when they drift.
 */
interface IAxiosSpies {
  get: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
  patch: ReturnType<typeof vi.fn>
}

type TAxiosMethod = (...args: unknown[]) => Promise<unknown>

function spyOnTransport (service: IPermitProvider): IAxiosSpies {
  const instance = (service as unknown as { axiosInstance: Record<string, TAxiosMethod> }).axiosInstance
  const envelope = { message: 'success', data: {} }
  const spy = (method: string): IAxiosSpies['get'] =>
    vi.spyOn(instance, method).mockResolvedValue(envelope) as unknown as IAxiosSpies['get']

  return { get: spy('get'), post: spy('post'), patch: spy('patch') }
}

describe('PermitProvider — wire contract (API-006)', () => {
  let service: IPermitProvider
  let spies: IAxiosSpies

  beforeEach(() => {
    vi.restoreAllMocks()
    service = new PermitProvider()
    spies = spyOnTransport(service)
  })

  it('create posts to /api/v1/permits', async () => {
    await service.create({
      type: 'hot',
      title: 'Weld repair',
      location: 'Zone 3',
      foreman: 'Somchai',
      workDate: '2026-08-18',
      workTimeStart: '2026-08-18T01:00:00.000Z',
      workTimeEnd: '2026-08-18T09:00:00.000Z'
    })

    expect(spies.post).toHaveBeenCalledWith('/api/v1/permits', expect.objectContaining({ title: 'Weld repair' }), undefined)
  })

  it('update PATCHes the permit and sends safetyReading in the singular — it appends a row', async () => {
    await service.update('WP-HOT-20260818-001', { safetyReading: { lel: 0, o2: 20.9 } })

    expect(spies.patch).toHaveBeenCalledWith(
      '/api/v1/permits/WP-HOT-20260818-001', { safetyReading: { lel: 0, o2: 20.9 } }, undefined
    )
  })

  it('submit posts to the submit route', async () => {
    await service.submit('WP-HOT-20260818-001')

    expect(spies.post).toHaveBeenCalledWith('/api/v1/permits/WP-HOT-20260818-001/submit', undefined, undefined)
  })

  it('list sends one status, never an array — the endpoint takes a single value', async () => {
    await service.list({ page: 1, limit: 10, status: 'ACTIVE' })

    expect(spies.get).toHaveBeenCalledWith('/api/v1/permits', { params: { page: 1, limit: 10, status: 'ACTIVE' } })
  })

  it('detail, qr and audit are all path-scoped GETs', async () => {
    await service.detail('WP-1')
    await service.qr('WP-1')
    await service.audit('WP-1')

    expect(spies.get).toHaveBeenCalledWith('/api/v1/permits/WP-1', { params: undefined })
    expect(spies.get).toHaveBeenCalledWith('/api/v1/permits/WP-1/qr', { params: undefined })
    expect(spies.get).toHaveBeenCalledWith('/api/v1/permits/WP-1/audit', { params: undefined })
  })

  it('markComplete posts to the hot-work route', async () => {
    await service.markComplete('WP-1')

    expect(spies.post).toHaveBeenCalledWith('/api/v1/permits/WP-1/mark-complete', undefined, undefined)
  })

  it('close posts the checklist and signature verbatim — the keys inside checklist are user data', async () => {
    await service.close('WP-1', { checklist: { entrantsExited: 'yes', worksiteRestored: 'no' }, signature: 'Somchai P.' })

    const body = { checklist: { entrantsExited: 'yes', worksiteRestored: 'no' }, signature: 'Somchai P.' }
    expect(spies.post).toHaveBeenCalledWith('/api/v1/permits/WP-1/close', body, undefined)
  })

  it('exposes no approve/reject — those are safety_officer actions with no contractor-facing flow', () => {
    const surface = service as unknown as Record<string, unknown>

    expect(surface.approve).toBeUndefined()
    expect(surface.reject).toBeUndefined()
    // `close` IS present on purpose: the closure flow must attempt the call and render the
    // server's verdict rather than pre-empt it, even though the route is officer-guarded today
    // (docs/api/GAPS.md row H).
    expect(typeof surface.close).toBe('function')
  })
})
