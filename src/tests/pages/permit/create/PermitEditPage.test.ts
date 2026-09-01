import type { Router } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import FacilityPlanProvider from '@/resources/provider/facility-plan/FacilityPlan.provider'
import PermitProvider from '@/resources/provider/permit/Permit.provider'
import PermitEditPage from '@/pages/permit/pages/create/pages/PermitEditPage.vue'
import StepperHeader from '@/pages/permit/pages/create/components/StepperHeader.vue'

/**
 * PMT-014 — resume route. Updated for wayfinder ticket 022: `PermitEditPage` used to confirm
 * editability with a real (empty-body) `PATCH /permits/:id`, which — since wayfinder 012 made
 * `PATCH` withdraw a PENDING permit back to DRAFT — silently withdrew a PENDING permit from review
 * on mere mount (deep link, bookmark, refresh, back-button return). It now confirms editability
 * with a plain `GET /permits/:id` (`useResumePermit`) and decides off `status` client-side, mirroring
 * `update.service.ts`'s own DRAFT/REJECTED gate — never a client rule stricter or looser than the
 * server's (../../PROMPT-LOG.md standing ruling: no client rule pre-empts the server; the wizard's
 * own save still round-trips a real PATCH and that response stays authoritative).
 */
vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

function stubMatchMedia (): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: (): void => undefined,
      removeListener: (): void => undefined,
      addEventListener: (): void => undefined,
      removeEventListener: (): void => undefined,
      dispatchEvent: (): boolean => false
    } as unknown as MediaQueryList)
  })
}

function draftPermit (): Record<string, unknown> {
  return {
    id: 'WP-HT-20260820-001',
    type: 'heights',
    status: 'DRAFT',
    title: 'Roof repair',
    foreman: 'Somchai',
    location: 'Zone 3',
    workDate: '2026-08-20T00:00:00.000Z',
    workTimeStart: '2026-08-20T01:00:00.000Z',
    workTimeEnd: '2026-08-20T09:00:00.000Z',
    outdoorWork: false,
    createdById: 'u1',
    createdBy: null,
    createdAt: '2026-08-19T00:00:00.000Z',
    updatedAt: '2026-08-19T00:00:00.000Z',
    submittedAt: null,
    approvedById: null,
    approvedBy: null,
    approvedAt: null,
    rejectedReason: null,
    rejectedAt: null,
    closedById: null,
    closedBy: null,
    closedAt: null,
    fireMonitorStartedAt: null,
    qrIssuedAt: null,
    entrantCount: 0,
    fireWatch: null,
    areaId: null,
    // title/foreman/location/date/times all present, but the worker table is empty and workers
    // have no minimum count — so the deterministic first-invalid step is step 3 (safety checks,
    // index 2): heights requires a wind reading and none was ever recorded.
    latestSafetyReading: null,
    jsaSteps: [],
    workers: [],
    photos: []
  }
}

function buildRouter (): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/permits/:id', name: 'PermitDetailPage', component: { template: '<div />' } },
      { path: '/permits/:id/edit', name: 'PermitEditPage', component: PermitEditPage }
    ]
  })
}

describe('PermitEditPage', () => {
  beforeEach((): void => {
    stubMatchMedia()
    setActivePinia(createPinia())
    setLocale('en')
    // feat-023. No facility plan mounted in this suite — every wizard mount now fetches
    // GET /facility-plans/active on mount (useWizard), and this repo's convention is to mock
    // every provider a mounted page touches rather than let it hit a live/absent server.
    vi.spyOn(FacilityPlanProvider.prototype, 'getActive').mockResolvedValue({ message: 'success', data: null } as never)
  })

  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('hydrates the wizard and lands on the first step that does not validate, not step 1', async () => {
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
    vi.spyOn(PermitProvider.prototype, 'detail')
      .mockResolvedValue({ message: 'success', data: draftPermit() } as never)

    const router = buildRouter()
    await router.push('/permits/WP-HT-20260820-001/edit')
    await router.isReady()

    const wrapper = mount(PermitEditPage, {
      global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
    })
    await flushPromises()

    expect(wrapper.find('[data-test="edit-not-editable"]').exists()).toBe(false)
    const stepper = wrapper.findComponent(StepperHeader)
    // Step 3 (index 2) — safety checks — is the first to fail: no reading was ever recorded.
    expect(stepper.props('currentStepIndex')).toBe(2)
    expect(stepper.props('maxUnlockedStepIndex')).toBe(2)
    // wayfinder 022 — mounting the edit page must perform no write of any kind.
    expect(updateSpy).not.toHaveBeenCalled()
  })

  it('mounting the edit page for a PENDING permit performs no write of any kind (wayfinder 022)', async () => {
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
    vi.spyOn(PermitProvider.prototype, 'detail')
      .mockResolvedValue({ message: 'success', data: { ...draftPermit(), status: 'PENDING' } } as never)

    const router = buildRouter()
    await router.push('/permits/WP-HT-20260820-001/edit')
    await router.isReady()

    mount(PermitEditPage, {
      global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
    })
    await flushPromises()

    // A PENDING permit is editable (same edit route DRAFT uses, wayfinder 012's contractor half),
    // so the read alone must not have withdrawn it: no PATCH fired just from opening the page.
    expect(updateSpy).not.toHaveBeenCalled()
  })

  it('resuming a withdrawn PENDING permit (now DRAFT) re-includes the Position step once an active plan exists (wayfinder 012)', async () => {
    // The backend performs the PENDING -> DRAFT withdrawal atomically the moment the contractor's
    // FIRST real edit round-trips through `PATCH /permits/:id` (wayfinder 012). This test mounts
    // AFTER that has already happened — `GET /permits/:id` (wayfinder 022's `useResumePermit`)
    // simply reads back a permit that is already DRAFT, with no position set — the exact
    // server-side state the ticket calls out ("position becomes editable again").
    vi.spyOn(FacilityPlanProvider.prototype, 'getActive').mockResolvedValue({
      message: 'success',
      data: {
        id: 7,
        fileRef: 'facility-plans/v1.png',
        uploadedById: 'u-9',
        uploadedBy: null,
        createdAt: '2026-08-01T00:00:00.000Z',
        activatedAt: '2026-08-01T00:00:00.000Z',
        active: true
      }
    } as never)
    vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue({
      message: 'success',
      data: { ...draftPermit(), status: 'DRAFT', planId: null, planX: null, planY: null }
    } as never)

    const router = buildRouter()
    await router.push('/permits/WP-HT-20260820-001/edit')
    await router.isReady()

    const wrapper = mount(PermitEditPage, {
      global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
    })
    await flushPromises()

    const stepper = wrapper.findComponent(StepperHeader)
    const stepKeys = (stepper.props('steps') as Array<{ key: string }>).map((step: { key: string }): string => step.key)
    expect(stepKeys).toContain('position')
  })

  it('renders the server verdict (ownership/404) instead of a broken wizard', async () => {
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
    vi.spyOn(PermitProvider.prototype, 'detail').mockRejectedValue({
      code: 403, message: 'backend english, never rendered'
    })

    const router = buildRouter()
    await router.push('/permits/WP-HT-20260820-001/edit')
    await router.isReady()

    const wrapper = mount(PermitEditPage, {
      global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
    })
    await flushPromises()

    const errorCard = wrapper.find('[data-test="edit-not-editable"]')
    expect(errorCard.exists()).toBe(true)
    expect(errorCard.text()).not.toContain('backend english, never rendered')
    expect(wrapper.findComponent(StepperHeader).exists()).toBe(false)
    expect(updateSpy).not.toHaveBeenCalled()
  })

  it('refuses a permit whose status is not DRAFT/REJECTED without ever calling update, mirroring PERMIT_NOT_EDITABLE', async () => {
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
    vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue({
      message: 'success', data: { ...draftPermit(), status: 'ACTIVE' }
    } as never)

    const router = buildRouter()
    await router.push('/permits/WP-HT-20260820-001/edit')
    await router.isReady()

    const wrapper = mount(PermitEditPage, {
      global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
    })
    await flushPromises()

    const errorCard = wrapper.find('[data-test="edit-not-editable"]')
    expect(errorCard.exists()).toBe(true)
    expect(errorCard.text()).toContain('This permit can no longer be edited')
    expect(wrapper.findComponent(StepperHeader).exists()).toBe(false)
    expect(updateSpy).not.toHaveBeenCalled()
  })
})
