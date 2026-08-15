import { describe, expect, it } from 'vitest'
import type { IPermitListItem } from '@/models/response/permit/PermitRes.model'
import PermitProvider, { type IPermitProvider } from '@/resources/provider/permit/Permit.provider'

/**
 * Exercises the stub branch of Permit.provider.ts (USE_STUB_DATA = true — see the file
 * header). Once the real backend is wired up and the flag flips to false, these tests
 * document the contract the live endpoint must keep satisfying: filter-chip status
 * grouping, and every method resolving the response shape the models declare.
 */
describe('PermitProvider (stub mode)', () => {
  const PermitService: IPermitProvider = new PermitProvider()

  it('list() with no status returns every stub permit (the "All" filter chip)', async () => {
    const response = await PermitService.list({ page: 1, limit: 50 })
    expect(response.data.length).toBeGreaterThan(0)
    expect(response.count).toBe(response.data.length)
  })

  it('list() with status ["ACTIVE", "FIRE_MONITOR"] matches the "Active" filter chip', async () => {
    const response = await PermitService.list({ page: 1, limit: 50, status: ['ACTIVE', 'FIRE_MONITOR'] })
    expect(response.data.length).toBeGreaterThan(0)
    expect(response.data.every((p: IPermitListItem): boolean => p.status === 'ACTIVE' || p.status === 'FIRE_MONITOR')).toBe(true)
  })

  it('list() with status ["CLOSED", "REJECTED"] matches the "Closed" filter chip', async () => {
    const response = await PermitService.list({ page: 1, limit: 50, status: ['CLOSED', 'REJECTED'] })
    expect(response.data.length).toBeGreaterThan(0)
    expect(response.data.every((p: IPermitListItem): boolean => p.status === 'CLOSED' || p.status === 'REJECTED')).toBe(true)
  })

  it('list() with status "PENDING" matches the "Pending" filter chip', async () => {
    const response = await PermitService.list({ page: 1, limit: 50, status: 'PENDING' })
    expect(response.data.length).toBeGreaterThan(0)
    expect(response.data.every((p: IPermitListItem): boolean => p.status === 'PENDING')).toBe(true)
  })

  it('list() excludes DRAFT/EXPIRED permits from every named filter, only "All" includes them', async () => {
    const all = await PermitService.list({ page: 1, limit: 50 })
    const active = await PermitService.list({ page: 1, limit: 50, status: ['ACTIVE', 'FIRE_MONITOR'] })
    const pending = await PermitService.list({ page: 1, limit: 50, status: 'PENDING' })
    const closed = await PermitService.list({ page: 1, limit: 50, status: ['CLOSED', 'REJECTED'] })

    expect(all.data.some((p: IPermitListItem): boolean => p.status === 'DRAFT' || p.status === 'EXPIRED')).toBe(true)
    for (const bucket of [active, pending, closed]) {
      expect(bucket.data.some((p: IPermitListItem): boolean => p.status === 'DRAFT' || p.status === 'EXPIRED')).toBe(false)
    }
  })

  it('confined-space ACTIVE stub permits carry entrantsInside for the "N inside" indicator', async () => {
    const response = await PermitService.list({ page: 1, limit: 50, status: 'ACTIVE' })
    const confined = response.data.filter((p: IPermitListItem): boolean => p.type === 'confined')
    expect(confined.some((p: IPermitListItem): boolean => (p.entrantsInside ?? 0) > 0)).toBe(true)
  })

  it('detail() resolves a permit by id with the extra detail-only fields present', async () => {
    const list = await PermitService.list({ page: 1, limit: 1 })
    const id = list.data[0].id
    const response = await PermitService.detail(id)
    expect(response.data.id).toBe(id)
    expect(response.data.jsaSteps).toEqual([])
    expect(response.data.workers).toEqual([])
  })

  it('create()/submit()/markComplete()/close() resolve the requested status transition', async () => {
    const created = await PermitService.create({
      type: 'hot',
      project: 'Test',
      foreman: 'Test',
      workDate: '2026-01-01',
      workTimeStart: '08:00',
      workTimeEnd: '12:00',
      workDescription: 'Test',
      location: 'Test',
      outdoorWork: false
    })
    expect(created.data.status).toBe('DRAFT')

    const submitted = await PermitService.submit(created.data.id)
    expect(submitted.data.status).toBe('PENDING')

    const completed = await PermitService.markComplete(created.data.id)
    expect(completed.data.status).toBe('FIRE_MONITOR')

    const closed = await PermitService.close(created.data.id, {
      checklistAnswers: [],
      signature: 'test',
      signedAt: '2026-01-01T00:00:00Z'
    })
    expect(closed.data.status).toBe('CLOSED')
  })

  it('qr() and audit() resolve without throwing', async () => {
    const qr = await PermitService.qr('WP-STUB-1')
    expect(qr.data.permitId).toBe('WP-STUB-1')

    const audit = await PermitService.audit('WP-STUB-1')
    expect(audit.data).toEqual([])
  })
})
