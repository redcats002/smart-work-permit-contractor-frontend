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
    workerId: 1,
    workerName: 'Somchai',
    certType: 'Hot Work',
    issuedDate: '2026-01-01',
    expiryDate: '2027-01-01',
    filePath: null,
    expired: false,
    ...overrides
  }
}

function baseFormData (): IUpdatePermitDraftPayload {
  return {
    type: 'hot',
    workers: [{ workerId: 100, workerName: '', roleOnPermit: 'Operator' } as IPermitWorker]
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
    // Unconditional, NOT at the end of the one test that installs fake timers. A failing
    // assertion there would skip the restore and leak fake timers into the next test in this
    // file, which then fails for a reason that has nothing to do with it and passes on a rerun —
    // reported as a flake on 2026-09-01. Teardown that only runs on the happy path is not
    // teardown. Calling this when real timers are already active is a no-op.
    vi.useRealTimers()
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

  /**
   * REGRESSION (reported 2026-09-01): typing a worker name showed the suggestion list, then the
   * list vanished on its own. The pre-flight ran off a debounced watch on `formData.workers`, so
   * a half-typed name fired a lookup whose verdict mounted the `certificateProblems` banner below
   * the table — and PrimeVue's AutoComplete hides its overlay on any ancestor scroll or window
   * resize while it is open, so that reflow closed it mid-typing.
   *
   * The fix is a trigger change, and that is what these two cases pin: typing alone must ask for
   * NOTHING, and a mouse selection — whose blur, model write and option-select all arrive before
   * the parent's write-back — must settle into exactly one lookup, fired after the click.
   */
  it('typing does not trigger the certificate pre-flight — only committing the name does', async () => {
    vi.spyOn(CertificateProvider.prototype, 'list').mockResolvedValue({
      message: 'ok', data: [certificate({ workerName: 'Somchai' })], count: 1, totalPage: 1
    } as never)

    const wrapper = mountStep()
    await flushPromises()

    const autoComplete = wrapper.findComponent(AutoComplete)
    // Three keystrokes, exactly as PrimeVue emits them for free text.
    for (const typed of ['S', 'So', 'Som']) {
      autoComplete.vm.$emit('update:modelValue', typed)
      autoComplete.vm.$emit('complete', { query: typed })
      await flushPromises()
    }

    expect(wrapper.emitted('recheck-certificates')).toBeUndefined()
  })

  it('selecting a suggestion commits the name once, and the blur that comes with the click adds no second lookup', async () => {
    vi.spyOn(CertificateProvider.prototype, 'list').mockResolvedValue({
      message: 'ok', data: [certificate({ workerName: 'Somchai' })], count: 1, totalPage: 1
    } as never)
    // Plain fake timers, NOT `{ shouldAdvanceTime: true }`. With auto-advance the fake clock also
    // moves with real time, so `commitWorkerNames`'s deferred setTimeout(0) could fire on its own
    // before the explicit advance below — making "nothing yet" and the final count depend on
    // machine speed. It failed roughly 2 runs in 8. Only explicit advances may move time here.
    vi.useFakeTimers()

    const wrapper = mountStep()
    await flushPromises()

    const autoComplete = wrapper.findComponent(AutoComplete)
    // The real mouse sequence, in PrimeVue's order: mousedown blurs the input BEFORE the click
    // that selects the option, and `onOptionSelect` emits `update:modelValue` and `option-select`
    // in the same synchronous tick.
    autoComplete.vm.$emit('blur')
    autoComplete.vm.$emit('update:modelValue', certificate({ workerName: 'Somchai' }))
    autoComplete.vm.$emit('option-select', { value: certificate({ workerName: 'Somchai' }) })
    await flushPromises()

    // Nothing yet: both commits are deferred past the click, which is what stops the pre-flight
    // clearing the problems banner and hiding the overlay mid-selection.
    expect(wrapper.emitted('recheck-certificates')).toBeUndefined()

    // The parent's write-back lands before the deferred commit runs, so it hashes the settled
    // name — which is why the blur and the select collapse into a single lookup, not two.
    await wrapper.setProps({
      formData: { type: 'hot', workers: [{ workerId: 761, workerName: 'Somchai', roleOnPermit: 'Operator' }] }
    } as never)
    await vi.advanceTimersByTimeAsync(1)
    await flushPromises()

    expect(wrapper.emitted('recheck-certificates')).toHaveLength(1)

    // Leaving the same, unchanged row again asks for nothing.
    autoComplete.vm.$emit('blur')
    await vi.advanceTimersByTimeAsync(1)
    await flushPromises()
    expect(wrapper.emitted('recheck-certificates')).toHaveLength(1)
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

  /**
   * wayfinder ticket 048 — the field report's "the name box is too narrow to read".
   *
   * The width comes from Volt's PT class `p-fluid:w-full` on the inner <input>, a Tailwind
   * variant that only matches once PrimeVue stamps `data-p="fluid"` on the element — which it
   * does only when the `fluid` prop is set. Without it the `w-full` on the wrapper styles the
   * wrapper alone and the input renders at the UA default (~20ch) however wide the cell is.
   * Asserted on the rendered <input>, not on the prop, because it is the stamped attribute the
   * stylesheet actually selects on.
   */
  it('renders the worker-name input fluid, so Volt\'s p-fluid:w-full can size it (wayfinder 048)', async () => {
    vi.spyOn(CertificateProvider.prototype, 'list').mockResolvedValue({
      message: 'ok', data: [], count: 0, totalPage: 1
    } as never)

    const wrapper = mountStep()
    await flushPromises()

    const input = wrapper.findComponent(AutoComplete).find('input')
    expect(input.attributes('data-p')?.split(' ')).toContain('fluid')
    // And the cell it fills is wide enough to be worth filling — the table is `overflow-x-auto`,
    // so this column scrolls rather than squeezing the role/health columns beside it.
    expect(wrapper.findComponent(AutoComplete).classes()).toContain('min-w-[13.75rem]')
  })
})
