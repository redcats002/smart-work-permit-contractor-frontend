import type { Router } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import PermitProvider from '@/resources/provider/permit/Permit.provider'
import PermitDuplicatePage from '@/pages/permit/pages/create/pages/PermitDuplicatePage.vue'

/**
 * PMT-014 — "Duplicate & Edit".
 *
 * There is no clone endpoint on the wire (docs/api/openapi.json), so this is client-side:
 * `GET /permits/:sourceId` → `POST /permits` (only the fields that route accepts — never `id`,
 * `status`, `submittedAt`, `rejectedReason`/`rejectedAt`, or any approval/closure field) →
 * `PATCH` to copy `jsaSteps`/`workers`/`photos`/the latest `safetyReading` onto the NEW draft,
 * exactly once. Then it hands off to PermitEditPage for the new id.
 */
vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

function rejectedPermit (): Record<string, unknown> {
  return {
    id: 'WP-HT-20260810-002',
    type: 'heights',
    status: 'REJECTED',
    title: 'Roof repair',
    foreman: 'Somchai',
    location: 'Zone 3',
    workDate: '2026-08-10T00:00:00.000Z',
    workTimeStart: '2026-08-10T01:00:00.000Z',
    workTimeEnd: '2026-08-10T09:00:00.000Z',
    outdoorWork: false,
    createdById: 'u1',
    createdBy: null,
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
    submittedAt: '2026-08-09T02:00:00.000Z',
    approvedById: null,
    approvedBy: null,
    approvedAt: null,
    rejectedReason: 'Missing scaffold inspection',
    rejectedAt: '2026-08-09T03:00:00.000Z',
    closedById: null,
    closedBy: null,
    closedAt: null,
    fireMonitorStartedAt: null,
    qrIssuedAt: null,
    entrantCount: 0,
    fireWatch: null,
    latestSafetyReading: { lel: null, o2: null, co: null, so2: null, wind: 12, height: null, recordedAt: '2026-08-09T01:00:00.000Z' },
    jsaSteps: [{ id: 9, phase: 'pre', step: 'Inspect harness', hazard: 'Fall', control: 'Wear harness', sortOrder: 0 }],
    workers: [{ id: 5, workerName: 'Somchai', roleOnPermit: 'Worker', bloodPressure: null, alcoholReading: null }],
    photos: [{ slotKey: 'site', fileRef: 'uploads/site.jpg' }]
  }
}

function buildRouter (): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/permits/:id', name: 'PermitDetailPage', component: { template: '<div />' } },
      { path: '/permits/:id/duplicate', name: 'PermitDuplicatePage', component: PermitDuplicatePage },
      { path: '/permits/:id/edit', name: 'PermitEditPage', component: { template: '<div />' } }
    ]
  })
}

describe('PermitDuplicatePage', () => {
  beforeEach((): void => {
    setActivePinia(createPinia())
    setLocale('en')
  })

  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('creates a new draft, copies collections and the reading exactly once, then opens the new draft', async () => {
    vi.spyOn(PermitProvider.prototype, 'detail')
      .mockResolvedValue({ message: 'success', data: rejectedPermit() } as never)
    const createSpy = vi.spyOn(PermitProvider.prototype, 'create')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-HT-20260823-009' } } as never)
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-HT-20260823-009' } } as never)

    const router = buildRouter()
    await router.push('/permits/WP-HT-20260810-002/duplicate')
    await router.isReady()

    mount(PermitDuplicatePage, {
      global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
    })
    await flushPromises()

    expect(createSpy).toHaveBeenCalledTimes(1)
    const createPayload = createSpy.mock.calls[0][0] as unknown as Record<string, unknown>
    expect(createPayload).not.toHaveProperty('id')
    expect(createPayload).not.toHaveProperty('status')
    expect(createPayload).not.toHaveProperty('submittedAt')
    expect(createPayload).not.toHaveProperty('rejectedReason')
    expect(createPayload).not.toHaveProperty('rejectedAt')
    expect(createPayload).not.toHaveProperty('approvedAt')
    expect(createPayload).not.toHaveProperty('closedAt')
    expect(createPayload.workDate).toBe('2026-08-10')

    expect(updateSpy).toHaveBeenCalledTimes(1)
    const [updatedId, updatePayload] = updateSpy.mock.calls[0] as [string, Record<string, unknown>]
    expect(updatedId).toBe('WP-HT-20260823-009')
    expect(updatePayload.safetyReading).toEqual({ lel: null, o2: null, co: null, wind: 12, height: null })
    expect(updatePayload.jsaSteps).toEqual([{ phase: 'pre', step: 'Inspect harness', hazard: 'Fall', control: 'Wear harness', sortOrder: 0 }])
    // bloodPressure/alcoholReading are `string` on the wire, never `null` — the source worker's
    // null health fields (this fixture isn't Confined Space) must be omitted, not round-tripped.
    expect(updatePayload.workers).toEqual([{ workerName: 'Somchai', roleOnPermit: 'Worker' }])

    expect(router.currentRoute.value.name).toBe('PermitEditPage')
    expect(router.currentRoute.value.params.id).toBe('WP-HT-20260823-009')
  })
})
