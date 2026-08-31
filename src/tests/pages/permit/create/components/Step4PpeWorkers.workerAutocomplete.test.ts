import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import CertificateProvider from '@/resources/provider/certificate/Certificate.provider'
import Step4PpeWorkers from '@/pages/permit/pages/create/components/steps/Step4PpeWorkers.vue'
import AutoComplete from '@/volt/AutoComplete.vue'
import { EMPTY_SUBMIT_FAILURES } from '@/pages/permit/pages/create/constants/SubmitErrorRouting'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import type { IPermitWorker } from '@/models/modules/permit/Permit.model'
import type { IUpdatePermitDraftPayload } from '@/models/request/permit/PermitReq.model'
import type { IWizardStepProps } from '@/pages/permit/pages/create/wizard/WizardSteps'

/**
 * wayfinder ticket 004 — the worker-name AutoComplete on step 4 (PPE & Workers), sourced from
 * the certificate list. Covers the ticket's four required cases: suggestions rendering,
 * selecting one, an expired certificate marked, and free text with no match still accepted.
 * (The "marked" rendering itself is unit-tested directly in
 * WorkerCertificateSuggestionOption.test.ts — this file covers the data flow around it.)
 */
vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

/** PrimeVue's DatePicker (in the inline CreateCertificateModal) calls window.matchMedia. */
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

function certificate (overrides: Partial<ICertificate> = {}): ICertificate {
  return {
    id: 1,
    workerName: 'Somchai',
    role: 'Operator',
    certType: 'Hot Work',
    issuedDate: '2026-01-01',
    expiryDate: '2027-01-01',
    expired: false,
    ...overrides
  }
}

function baseFormData (): IUpdatePermitDraftPayload {
  return {
    type: 'hot',
    workers: [{ workerName: '', roleOnPermit: 'Operator' } as IPermitWorker]
  }
}

function mountStep (): ReturnType<typeof mount> {
  return mount(Step4PpeWorkers, {
    global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] },
    props: {
      title: 'PPE & Workers',
      formData: baseFormData(),
      checklistAnswers: {},
      submitFailures: EMPTY_SUBMIT_FAILURES,
      certificateState: 'idle',
      certificateProblems: [],
      positionState: 'none',
      activePlan: null
    } satisfies IWizardStepProps
  })
}

describe('Step4PpeWorkers — worker-name AutoComplete (wayfinder ticket 004)', () => {
  beforeEach((): void => {
    stubMatchMedia()
    setLocale('en')
  })

  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('populates suggestions from the certificate list, filtered by the typed query', async () => {
    vi.spyOn(CertificateProvider.prototype, 'list').mockResolvedValue({
      message: 'ok',
      data: [certificate({ workerName: 'Somchai' }), certificate({ id: 2, workerName: 'Malee' })],
      count: 2,
      totalPage: 1
    } as never)

    const wrapper = mountStep()
    await flushPromises()

    const autoComplete = wrapper.findComponent(AutoComplete)
    autoComplete.vm.$emit('complete', { query: 'som' })
    await flushPromises()

    // Volt's AutoComplete forwards `suggestions` straight through to PrimeVue's real
    // AutoComplete via attribute fallthrough rather than a declared prop of its own (`Props
    // extends AutoCompleteProps` uses `@vue-ignore`, so `.props()` on either wrapper sees
    // nothing) — read the step's own reactive suggestion state instead, which is what is
    // actually bound to `:suggestions` in the template.
    const suggestions = (wrapper.vm as unknown as { workerSuggestions: ICertificate[] }).workerSuggestions
    expect(suggestions.map((c: ICertificate): string => c.workerName)).toEqual(['Somchai'])
  })

  it('selecting a suggestion writes its workerName onto the worker row', async () => {
    vi.spyOn(CertificateProvider.prototype, 'list').mockResolvedValue({
      message: 'ok', data: [certificate({ workerName: 'Somchai' })], count: 1, totalPage: 1
    } as never)
    vi.spyOn(CertificateProvider.prototype, 'byWorker').mockResolvedValue({ message: 'ok', data: null } as never)

    const wrapper = mountStep()
    await flushPromises()

    const autoComplete = wrapper.findComponent(AutoComplete)
    autoComplete.vm.$emit('update:modelValue', certificate({ workerName: 'Somchai' }))
    await flushPromises()

    const emitted = wrapper.emitted('update:formData')
    expect(emitted).toBeTruthy()
    const lastPatch = emitted?.at(-1)?.[0] as Partial<IUpdatePermitDraftPayload>
    expect(lastPatch.workers?.[0]?.workerName).toBe('Somchai')
  })

  it('accepts free text that matches no certificate — the worker row is still updated', async () => {
    vi.spyOn(CertificateProvider.prototype, 'list').mockResolvedValue({
      message: 'ok', data: [certificate({ workerName: 'Somchai' })], count: 1, totalPage: 1
    } as never)
    vi.spyOn(CertificateProvider.prototype, 'byWorker').mockResolvedValue({ message: 'ok', data: null } as never)

    const wrapper = mountStep()
    await flushPromises()

    const autoComplete = wrapper.findComponent(AutoComplete)
    autoComplete.vm.$emit('update:modelValue', 'A Brand New Worker')
    await flushPromises()

    const emitted = wrapper.emitted('update:formData')
    const lastPatch = emitted?.at(-1)?.[0] as Partial<IUpdatePermitDraftPayload>
    expect(lastPatch.workers?.[0]?.workerName).toBe('A Brand New Worker')
  })

  it('a certificate created from the wizard is added to the suggestion cache and rechecks certificates', async () => {
    vi.spyOn(CertificateProvider.prototype, 'list').mockResolvedValue({
      message: 'ok', data: [], count: 0, totalPage: 1
    } as never)
    vi.spyOn(CertificateProvider.prototype, 'byWorker').mockResolvedValue({ message: 'ok', data: null } as never)

    const wrapper = mountStep()
    await flushPromises()

    // Simulate CreateCertificateModal emitting `created` — exercised end-to-end at the modal
    // level would require driving @primevue/forms + the upload provider; this asserts the step
    // component's own contract with it, which is what actually feeds the AutoComplete.
    await (wrapper.vm as unknown as { onCertificateCreated: (c: ICertificate) => void })
      .onCertificateCreated(certificate({ workerName: 'Newly Created' }))
    await flushPromises()

    const autoComplete = wrapper.findComponent(AutoComplete)
    autoComplete.vm.$emit('complete', { query: 'newly' })
    await flushPromises()

    const suggestions = (wrapper.vm as unknown as { workerSuggestions: ICertificate[] }).workerSuggestions
    expect(suggestions.map((c: ICertificate): string => c.workerName)).toEqual(['Newly Created'])
    expect(wrapper.emitted('recheck-certificates')).toBeTruthy()
  })
})
