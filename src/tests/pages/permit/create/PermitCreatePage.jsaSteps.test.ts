import type { VueWrapper } from '@vue/test-utils'
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
import Step5Jsa from '@/pages/permit/pages/create/components/steps/Step5Jsa.vue'

/**
 * wayfinder ticket 001 (field report item 4). `PATCH /permits/:id` 400'd on a row the "add row"
 * button had left blank — `{ phase: 'pre', step: '', hazard: '', control: '', sortOrder: 1 }` —
 * because the wizard sent `jsaSteps` wholesale, blank rows included.
 *
 * Covers the ticket's "Done when" bullets end to end through the real page: an untouched empty
 * row does not stop the draft from saving, and a half-filled row blocks the wizard with an inline
 * error and never reaches `POST /permits/:id/submit`.
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

function completeDraft (): Record<string, unknown> {
  return {
    type: 'hot',
    title: 'Warehouse repaint',
    location: 'Zone 3',
    foreman: 'Somchai',
    workDate: '2026-08-20',
    workTimeStart: '2026-08-20T01:00:00.000Z',
    workTimeEnd: '2026-08-20T09:00:00.000Z',
    safetyReading: { lel: 0, o2: 20.9 },
    workers: [{ workerId: 761, workerName: 'Somchai', roleOnPermit: 'Operator' }]
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

async function mountToJsaStep (): Promise<{ wrapper: VueWrapper, router: Router }> {
  const router = buildRouter()
  await router.push('/permits/create')
  await router.isReady()

  const wrapper = mount(PermitCreatePage, {
    global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
  })
  await flushPromises()

  wrapper.findComponent(Step1Type).vm.$emit('update:formData', completeDraft())
  await vi.advanceTimersByTimeAsync(1600)
  await flushPromises()

  const footer = wrapper.findComponent(WizardFooter)
  for (let step = 0; step < 4; step++) {
    footer.vm.$emit('next')
    await flushPromises()
  }
  return { wrapper, router }
}

describe('PermitCreatePage — JSA rows (wayfinder ticket 001)', () => {
  beforeEach((): void => {
    vi.useFakeTimers()
    stubMatchMedia()
    setActivePinia(createPinia())
    setLocale('en')
    vi.spyOn(PermitProvider.prototype, 'create')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-HOT-20260820-001' } } as never)
    // feat-023. No facility plan mounted in this suite — useWizard now fetches
    // GET /facility-plans/active on mount.
    vi.spyOn(FacilityPlanProvider.prototype, 'getActive').mockResolvedValue({ message: 'success', data: null } as never)
    vi.spyOn(CertificateProvider.prototype, 'byWorker')
      .mockResolvedValue({ message: 'success', data: { id: 1, workerName: 'Somchai', role: 'Operator', certType: 'hot-work', issuedDate: '2026-01-01', expiryDate: '2027-01-01', expired: false } } as never)
  })

  afterEach((): void => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('saves fine with an untouched empty row — dropped from the PATCH, Next stays enabled', async () => {
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-HOT-20260820-001' } } as never)

    const { wrapper } = await mountToJsaStep()
    expect(wrapper.findComponent(Step5Jsa).exists()).toBe(true)

    const jsa = wrapper.findComponent(Step5Jsa)
    jsa.vm.$emit('update:formData', {
      jsaSteps: [
        { phase: 'pre', step: 'Isolate the line', hazard: 'Residual pressure', control: 'Lockout / tagout' },
        { phase: 'pre', step: '', hazard: '', control: '' }
      ]
    })
    await vi.advanceTimersByTimeAsync(1600)
    await flushPromises()

    const footer = wrapper.findComponent(WizardFooter)
    expect(footer.props('nextBlocked')).toBe(false)

    expect(updateSpy).toHaveBeenCalled()
    const lastCall = updateSpy.mock.calls.at(-1) as [string, { jsaSteps?: unknown[] }]
    expect(lastCall[1].jsaSteps).toEqual([
      { phase: 'pre', step: 'Isolate the line', hazard: 'Residual pressure', control: 'Lockout / tagout', sortOrder: 0 }
    ])
  })

  it('blocks a half-filled row with an inline error and never calls submit', async () => {
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-HOT-20260820-001' } } as never)
    const submitSpy = vi.spyOn(PermitProvider.prototype, 'submit')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-HOT-20260820-001' } } as never)

    const { wrapper } = await mountToJsaStep()
    const jsa = wrapper.findComponent(Step5Jsa)
    jsa.vm.$emit('update:formData', {
      jsaSteps: [{ phase: 'pre', step: 'Isolate the line', hazard: '', control: '' }]
    })
    await vi.advanceTimersByTimeAsync(1600)
    await flushPromises()

    const footer = wrapper.findComponent(WizardFooter)
    expect(footer.props('nextBlocked')).toBe(true)
    expect(wrapper.text()).toContain(i18n.global.t('permit.create.steps.jsa.validation.incompleteRow'))

    // Next is a no-op while blocked — the wizard never reaches Review, so Submit is never called.
    footer.vm.$emit('next')
    await flushPromises()
    expect(footer.props('isLastStep')).toBe(false)
    expect(submitSpy).not.toHaveBeenCalled()

    // The autosave that DID fire never sent the half-filled row over the wire — jsaSteps is
    // replaced wholesale on this endpoint, so the key is left off the PATCH entirely rather than
    // sending a shrunken array (see useWizard.persistence.test.ts for the wipe scenario this avoids).
    expect(updateSpy).toHaveBeenCalled()
    const lastCall = updateSpy.mock.calls.at(-1) as [string, Record<string, unknown>]
    expect(lastCall[1]).not.toHaveProperty('jsaSteps')
  })
})
