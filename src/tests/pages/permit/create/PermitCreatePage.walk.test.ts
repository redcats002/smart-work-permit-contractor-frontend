import type { Router } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import FacilityPlanProvider from '@/resources/provider/facility-plan/FacilityPlan.provider'
import PermitProvider from '@/resources/provider/permit/Permit.provider'
import PermitCreatePage from '@/pages/permit/pages/create/pages/PermitCreatePage.vue'
import WizardFooter from '@/pages/permit/pages/create/components/WizardFooter.vue'
import Step1Type from '@/pages/permit/pages/create/components/steps/Step1Type.vue'

/**
 * REGRESSION — "permit creation cannot be continued" (../PROMPT-LOG.md, session 2, item 3).
 *
 * Reproduced against the live backend on 2026-08-22 by driving /permits/create in headless
 * Chromium: steps 1-4 all unlocked Next, `POST /permits` and the step-3 `PATCH` both answered 200,
 * and then step 5 arrived with Next PERMANENTLY DISABLED. `jsaSteps` starts empty and nothing
 * seeds a row, so `Step5JsaSchema`'s old "at least one row" minimum failed on arrival and the
 * wizard dead-ended — a client-only rule blocking a draft the server would have accepted.
 *
 * This file walks the real page with a draft that has NO `jsaSteps` at all and asserts the wizard
 * reaches Review with Submit enabled. It fails on the pre-fix schema.
 */
vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

/** PrimeVue's DatePicker (step 2) calls window.matchMedia, which jsdom does not implement. */
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

/** Everything a Hot Work permit needs for steps 1-4, and deliberately nothing for step 5. */
function draftWithoutJsa (): Record<string, unknown> {
  return {
    type: 'hot',
    title: 'Warehouse repaint',
    location: 'Zone 3',
    foreman: 'Somchai',
    workDate: '2026-08-20',
    workTimeStart: '2026-08-20T01:00:00.000Z',
    workTimeEnd: '2026-08-20T09:00:00.000Z',
    safetyReading: { lel: 0, o2: 20.9 },
    workers: [{ workerName: 'Somchai', roleOnPermit: 'Operator' }]
  }
}

function buildRouter (): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/permits', name: 'PermitListPage', component: { template: '<div />' } },
      { path: '/permits/create', name: 'PermitCreatePage', component: PermitCreatePage },
      { path: '/permits/:id', name: 'PermitDetailPage', component: { template: '<div />' } }
    ]
  })
}

describe('PermitCreatePage — the wizard can always be continued', () => {
  beforeEach((): void => {
    vi.useFakeTimers()
    stubMatchMedia()
    setActivePinia(createPinia())
    setLocale('en')
    vi.spyOn(PermitProvider.prototype, 'create')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-HOT-20260820-001' } } as never)
    vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-HOT-20260820-001' } } as never)
    // feat-023. No facility plan mounted in this suite — useWizard now fetches
    // GET /facility-plans/active on mount.
    vi.spyOn(FacilityPlanProvider.prototype, 'getActive').mockResolvedValue({ message: 'success', data: null } as never)
    vi.spyOn(CertificateProvider.prototype, 'byWorker').mockResolvedValue({
      message: 'success',
      data: {
        id: 1,
        workerName: 'Somchai',
        role: 'Operator',
        certType: 'hot-work',
        issuedDate: '2026-01-01',
        expiryDate: '2027-01-01',
        expired: false
      }
    } as never)
  })

  afterEach((): void => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('walks every step to Review with an empty JSA and never disables Next on the way', async () => {
    const router = buildRouter()
    await router.push('/permits/create')
    await router.isReady()

    const wrapper = mount(PermitCreatePage, {
      global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
    })
    await flushPromises()

    wrapper.findComponent(Step1Type).vm.$emit('update:formData', draftWithoutJsa())
    // useWizard debounces its autosave by 1500ms; without advancing past it POST /permits never
    // fires and `draftId` stays undefined, which alone would keep Submit disabled.
    await vi.advanceTimersByTimeAsync(1600)
    await flushPromises()

    const footer = wrapper.findComponent(WizardFooter)
    for (let step = 1; step <= 5; step += 1) {
      expect(footer.props('nextBlocked'), `step ${step} blocked Next`).toBe(false)
      footer.vm.$emit('next')
      await flushPromises()
    }

    expect(footer.props('isLastStep')).toBe(true)
    expect(footer.props('canSubmit')).toBe(true)
  })
})
