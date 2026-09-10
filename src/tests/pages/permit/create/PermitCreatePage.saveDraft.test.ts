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
import SaveDraftConfirmModal from '@/pages/permit/pages/create/components/SaveDraftConfirmModal.vue'
import Step1Type from '@/pages/permit/pages/create/components/steps/Step1Type.vue'
import WizardFooter from '@/pages/permit/pages/create/components/WizardFooter.vue'

/**
 * wayfinder ticket 033 — "confirm before saving as draft".
 *
 * There is no explicit "save as draft" action anywhere in this repo before this ticket: the
 * wizard only ever autosaves via a 1500ms-debounced `persist()` (`useWizard.ts`'s
 * `debouncedPersist`), which fires on every `updateFormData` call. Attaching a confirmation to
 * THAT would fire on every keystroke's settle — the ticket explicitly forbids it. This suite pins
 * the new explicit action (the wizard footer's "Save as Draft" button) instead: confirm flushes
 * the pending autosave and navigates away; cancel is a true no-op; autosave itself never prompts.
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

function creatableDraft (): Record<string, unknown> {
  return {
    type: 'hot',
    title: 'Warehouse repaint',
    location: 'Zone 3',
    foreman: 'Somchai',
    startDate: '2026-08-20',
    endDate: '2026-08-20',
    dailyStart: '2026-08-20T01:00:00.000Z',
    dailyEnd: '2026-08-20T09:00:00.000Z'
  }
}

function buildRouter (): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/permits', name: 'PermitListPage', component: { template: '<div />' } },
      { path: '/permits/create', name: 'PermitCreatePage', component: PermitCreatePage },
      { path: '/getting-started', name: 'GettingStartedPage', component: { template: '<div />' } },
      { path: '/permits/:id', name: 'PermitDetailPage', component: { template: '<div />' } }
    ]
  })
}

describe('PermitCreatePage — save as draft confirmation', () => {
  beforeEach((): void => {
    vi.useFakeTimers()
    stubMatchMedia()
    setActivePinia(createPinia())
    setLocale('en')
    vi.spyOn(PermitProvider.prototype, 'create')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-HOT-20260820-001' } } as never)
    vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-HOT-20260820-001' } } as never)
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

  async function mountAtStep1 (router: Router): Promise<ReturnType<typeof mount>> {
    await router.push('/permits/create')
    await router.isReady()
    const wrapper = mount(PermitCreatePage, {
      global: {
        plugins: [i18n, router, [PrimeVue, { unstyled: true }]],
        // The confirm dialog teleports to <body> by default; stubbing keeps it inside the
        // wrapper so it can be queried at all (mirrors PermitDetailPage.test.ts).
        stubs: { teleport: true }
      }
    })
    await flushPromises()
    wrapper.findComponent(Step1Type).vm.$emit('update:formData', creatableDraft())
    // The draft is scheduled but not yet flushed — deliberately NOT advancing the 1500ms timer
    // here, so the create-page tests below observe the explicit action, not the autosave firing
    // on its own schedule.
    await flushPromises()
    return wrapper
  }

  it('opens a confirm dialog and does not persist or navigate until confirmed', async () => {
    const router = buildRouter()
    const createSpy = vi.spyOn(PermitProvider.prototype, 'create')
    const wrapper = await mountAtStep1(router)
    const pushSpy = vi.spyOn(router, 'push')

    wrapper.findComponent(WizardFooter).find('[data-test="wizard-save-draft"]').trigger('click')
    await flushPromises()

    const modal = wrapper.findComponent(SaveDraftConfirmModal)
    expect(modal.props('modelValue')).toBe(true)
    // Merely opening the dialog must not have flushed the debounced autosave.
    expect(createSpy).not.toHaveBeenCalled()
    expect(pushSpy).not.toHaveBeenCalled()
  })

  it('cancel is a true no-op: no persist, no navigation, dialog closes', async () => {
    const router = buildRouter()
    const createSpy = vi.spyOn(PermitProvider.prototype, 'create')
    const wrapper = await mountAtStep1(router)
    const pushSpy = vi.spyOn(router, 'push')

    wrapper.findComponent(WizardFooter).find('[data-test="wizard-save-draft"]').trigger('click')
    await flushPromises()
    wrapper.find('[data-test="save-draft-cancel"]').trigger('click')
    await flushPromises()

    expect(wrapper.findComponent(SaveDraftConfirmModal).props('modelValue')).toBe(false)
    expect(createSpy).not.toHaveBeenCalled()
    expect(pushSpy).not.toHaveBeenCalled()
  })

  it('confirm flushes the pending draft write and navigates to My Permits', async () => {
    const router = buildRouter()
    const createSpy = vi.spyOn(PermitProvider.prototype, 'create')
    const wrapper = await mountAtStep1(router)

    wrapper.findComponent(WizardFooter).find('[data-test="wizard-save-draft"]').trigger('click')
    await flushPromises()
    wrapper.find('[data-test="save-draft-confirm"]').trigger('click')
    await flushPromises()

    expect(createSpy).toHaveBeenCalledTimes(1)
    expect(router.currentRoute.value.name).toBe('PermitListPage')
  })

  it('autosave settling on its own timer never opens the confirm dialog', async () => {
    const router = buildRouter()
    const wrapper = await mountAtStep1(router)

    // This is the autosave path (debouncedPersist), not the explicit action under test.
    await vi.advanceTimersByTimeAsync(1600)
    await flushPromises()

    expect(wrapper.findComponent(SaveDraftConfirmModal).props('modelValue')).toBe(false)
  })
})
