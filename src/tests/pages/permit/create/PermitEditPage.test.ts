import type { Router } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import { EApiErrorCode } from '@/enums/modules/error/ApiErrorCode.enum'
import FacilityPlanProvider from '@/resources/provider/facility-plan/FacilityPlan.provider'
import PermitProvider from '@/resources/provider/permit/Permit.provider'
import PermitEditPage from '@/pages/permit/pages/create/pages/PermitEditPage.vue'
import StepperHeader from '@/pages/permit/pages/create/components/StepperHeader.vue'

/**
 * PMT-014 — resume route.
 *
 * `PermitEditPage` confirms editability with a real (empty-body) `PATCH /permits/:id` rather than
 * guessing off `status` client-side — a non-DRAFT id answers 403 `PERMIT_NOT_EDITABLE` and the
 * page must render that verdict, never a broken wizard (../../PROMPT-LOG.md standing ruling: no
 * client rule pre-empts the server).
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
    vi.spyOn(PermitProvider.prototype, 'update')
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
  })

  it('renders the server PERMIT_NOT_EDITABLE verdict instead of a broken wizard', async () => {
    vi.spyOn(PermitProvider.prototype, 'update').mockRejectedValue({
      code: 403, errorCode: EApiErrorCode.PERMIT_NOT_EDITABLE, message: 'backend english, never rendered'
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
  })
})
