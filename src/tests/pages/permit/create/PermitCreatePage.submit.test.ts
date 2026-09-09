import type { VueWrapper } from '@vue/test-utils'
import type { Router } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import { toast } from '@/plugins/toast'
import { EApiErrorCode } from '@/enums/modules/error/ApiErrorCode.enum'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import FacilityPlanProvider from '@/resources/provider/facility-plan/FacilityPlan.provider'
import PermitProvider from '@/resources/provider/permit/Permit.provider'
import PermitCreatePage from '@/pages/permit/pages/create/pages/PermitCreatePage.vue'
import WizardFooter from '@/pages/permit/pages/create/components/WizardFooter.vue'
import Step1Type from '@/pages/permit/pages/create/components/steps/Step1Type.vue'
import Step3SafetyChecks from '@/pages/permit/pages/create/components/steps/Step3SafetyChecks.vue'

/**
 * PMT-009 — the submit path end to end through the real page.
 *
 * The invariant this file exists to pin: the backend's own `message` NEVER reaches the user. A
 * rejected submit answers 400 with a `message` that joins every failure with '; ' in
 * backend-authored English (docs/api/GAPS.md row E); the client must render only the string
 * localized from `errorCode`, and must return the user to the step that can fix it.
 */
vi.mock('@/plugins/toast', () => ({
  toast: {
    success: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}))

/**
 * PrimeVue's DatePicker (step 2) calls window.matchMedia in its mounted hook; jsdom does not
 * implement it, and the resulting unhandled rejection tears the mount down mid-walk.
 */
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

const BACKEND_MESSAGE = 'LEL must be 0%; O2 must be between 19.5 and 23.5'

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
    workers: [{ workerId: 761, workerName: 'Somchai', roleOnPermit: 'Operator' }],
    jsaSteps: [{ phase: 'pre', step: 'Isolate', hazard: 'Pressure', control: 'LOTO' }]
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

async function mountAtReview (): Promise<{ wrapper: VueWrapper, router: Router }> {
  const router = buildRouter()
  await router.push('/permits/create')
  await router.isReady()

  const wrapper = mount(PermitCreatePage, {
    global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
  })
  await flushPromises()

  // Fill the whole draft in one patch through the step contract, then walk to Review.
  wrapper.findComponent(Step1Type).vm.$emit('update:formData', completeDraft())
  // useWizard debounces its autosave by 1500ms; without advancing past it POST /permits never
  // fires, `draftId` stays undefined and Submit is correctly disabled — so the wizard would never
  // reach the state this file is about.
  await vi.advanceTimersByTimeAsync(1600)
  await flushPromises()

  const footer = wrapper.findComponent(WizardFooter)
  for (let step = 0; step < 5; step++) {
    footer.vm.$emit('next')
    await flushPromises()
  }
  return { wrapper, router }
}

describe('PermitCreatePage — submit (PMT-009)', () => {
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
    vi.spyOn(CertificateProvider.prototype, 'byWorker')
      .mockResolvedValue({ message: 'success', data: { id: 1, workerName: 'Somchai', role: 'Operator', certType: 'hot-work', issuedDate: '2026-01-01', expiryDate: '2027-01-01', expired: false } } as never)
  })

  afterEach((): void => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('reaches the review step and enables Submit once every prior step validates', async () => {
    const { wrapper } = await mountAtReview()
    const footer = wrapper.findComponent(WizardFooter)
    expect(footer.props('isLastStep')).toBe(true)
    expect(footer.props('canSubmit')).toBe(true)
  })

  it('submits and navigates to the permit detail page on success', async () => {
    const submitSpy = vi.spyOn(PermitProvider.prototype, 'submit')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-HOT-20260820-001' } } as never)

    const { wrapper, router } = await mountAtReview()
    wrapper.findComponent(WizardFooter).vm.$emit('submit')
    await flushPromises()

    expect(submitSpy).toHaveBeenCalledWith('WP-HOT-20260820-001')
    expect(router.currentRoute.value.name).toBe('PermitDetailPage')
    expect(router.currentRoute.value.params.id).toBe('WP-HOT-20260820-001')
    // The detail page's one-shot "submitted" success banner is driven off this query param and
    // nothing else sets it (PermitStatusBanner.vue, PMT-010).
    expect(router.currentRoute.value.query.submitted).toBe('1')
  })

  it('toasts a success confirmation on submit — wayfinder ticket 008', async () => {
    vi.spyOn(PermitProvider.prototype, 'submit')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-HOT-20260820-001' } } as never)

    const { wrapper } = await mountAtReview()
    wrapper.findComponent(WizardFooter).vm.$emit('submit')
    await flushPromises()

    expect(toast.success).toHaveBeenCalledWith(i18n.global.t('permit.toast.submitted'))
  })

  it('returns the user to Safety Checks on GAS_OUT_OF_RANGE and never renders the backend message', async () => {
    vi.spyOn(PermitProvider.prototype, 'submit').mockRejectedValue({
      code: 400,
      message: BACKEND_MESSAGE,
      errorCode: EApiErrorCode.GAS_OUT_OF_RANGE
    })

    const { wrapper, router } = await mountAtReview()
    wrapper.findComponent(WizardFooter).vm.$emit('submit')
    await flushPromises()

    // The server verdict wins even though every client-side gate passed.
    expect(router.currentRoute.value.name).toBe('PermitCreatePage')
    expect(wrapper.findComponent(WizardFooter).props('isLastStep')).toBe(false)

    const localized = i18n.global.t(`error.${EApiErrorCode.GAS_OUT_OF_RANGE}`)
    expect(toast.error).toHaveBeenCalledWith(localized)
    expect(toast.error).not.toHaveBeenCalledWith(BACKEND_MESSAGE)
    expect(wrapper.text()).toContain(localized)
    expect(wrapper.text()).not.toContain(BACKEND_MESSAGE)
  })

  it('returns the user to PPE & Workers on CERT_EXPIRED', async () => {
    vi.spyOn(PermitProvider.prototype, 'submit').mockRejectedValue({
      code: 400,
      message: 'certificate expired for Somchai',
      errorCode: EApiErrorCode.CERT_EXPIRED
    })

    const { wrapper } = await mountAtReview()
    wrapper.findComponent(WizardFooter).vm.$emit('submit')
    await flushPromises()

    expect(wrapper.text()).toContain(i18n.global.t(`error.${EApiErrorCode.CERT_EXPIRED}`))
    expect(wrapper.text()).not.toContain('certificate expired for Somchai')
  })

  it('highlights EVERY reading the server rejected, not just the envelope code', async () => {
    vi.spyOn(PermitProvider.prototype, 'submit').mockRejectedValue({
      code: 400,
      message: BACKEND_MESSAGE,
      errorCode: EApiErrorCode.GAS_OUT_OF_RANGE,
      failures: [
        { field: 'lel', errorCode: 'GAS_OUT_OF_RANGE', message: 'LEL must be 0%' },
        { field: 'o2', errorCode: 'O2_MISSING', message: 'O2 reading is missing' }
      ]
    })

    const { wrapper } = await mountAtReview()
    wrapper.findComponent(WizardFooter).vm.$emit('submit')
    await flushPromises()

    const text = wrapper.text()
    expect(text).toContain(i18n.global.t('permit.create.steps.safetyChecks.serverRejected.title'))
    expect(text).toContain(i18n.global.t('permit.create.steps.safetyChecks.reading.lel'))
    expect(text).toContain(i18n.global.t('permit.create.steps.safetyChecks.reading.o2'))
    expect(text).toContain(i18n.global.t('error.O2_MISSING'))
    // Neither the envelope message nor any per-item backend message reaches the DOM.
    expect(text).not.toContain(BACKEND_MESSAGE)
    expect(text).not.toContain('LEL must be 0%')
    expect(text).not.toContain('O2 reading is missing')
  })

  it('names every worker the server refused a certificate for', async () => {
    vi.spyOn(PermitProvider.prototype, 'submit').mockRejectedValue({
      code: 400,
      message: 'certificate expired for Somchai; certificate missing for Krit',
      errorCode: EApiErrorCode.CERT_EXPIRED,
      certificateFailures: [
        { workerName: 'Somchai', errorCode: 'CERT_EXPIRED', message: 'certificate expired for Somchai' },
        { workerName: 'Krit', errorCode: 'CERT_MISSING', message: 'certificate missing for Krit' }
      ]
    })

    const { wrapper } = await mountAtReview()
    wrapper.findComponent(WizardFooter).vm.$emit('submit')
    await flushPromises()

    const text = wrapper.text()
    expect(text).toContain(i18n.global.t('permit.create.steps.ppeWorkers.serverRejected.title'))
    expect(text).toContain('Somchai')
    expect(text).toContain('Krit')
    expect(text).toContain(i18n.global.t('error.CERT_MISSING'))
    expect(text).not.toContain('certificate expired for Somchai')
  })

  it('drops the server verdict as soon as the user edits — no stuck red card', async () => {
    vi.spyOn(PermitProvider.prototype, 'submit').mockRejectedValue({
      code: 400,
      message: BACKEND_MESSAGE,
      errorCode: EApiErrorCode.GAS_OUT_OF_RANGE,
      failures: [{ field: 'lel', errorCode: 'GAS_OUT_OF_RANGE', message: 'LEL must be 0%' }]
    })

    const { wrapper } = await mountAtReview()
    wrapper.findComponent(WizardFooter).vm.$emit('submit')
    await flushPromises()

    const rejectedTitle = i18n.global.t('permit.create.steps.safetyChecks.serverRejected.title')
    expect(wrapper.text()).toContain(rejectedTitle)

    // The user corrects the reading the server complained about.
    wrapper.findComponent(Step3SafetyChecks).vm.$emit('update:formData', {
      safetyReading: { lel: 0, o2: 20.9 }
    })
    await flushPromises()

    expect(wrapper.text()).not.toContain(rejectedTitle)
    expect(wrapper.text()).not.toContain(i18n.global.t(`error.${EApiErrorCode.GAS_OUT_OF_RANGE}`))
  })

  it('stays on Review for a code no earlier step can fix, still localized', async () => {
    vi.spyOn(PermitProvider.prototype, 'submit').mockRejectedValue({
      code: 403,
      message: 'permit is not submittable',
      errorCode: EApiErrorCode.PERMIT_NOT_SUBMITTABLE
    })

    const { wrapper } = await mountAtReview()
    wrapper.findComponent(WizardFooter).vm.$emit('submit')
    await flushPromises()

    expect(wrapper.findComponent(WizardFooter).props('isLastStep')).toBe(true)
    expect(wrapper.text()).toContain(i18n.global.t(`error.${EApiErrorCode.PERMIT_NOT_SUBMITTABLE}`))
  })
})
