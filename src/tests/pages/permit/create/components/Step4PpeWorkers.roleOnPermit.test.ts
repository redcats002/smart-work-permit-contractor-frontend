import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import WorkerProvider from '@/resources/provider/worker/Worker.provider'
import Step4PpeWorkers from '@/pages/permit/pages/create/components/steps/Step4PpeWorkers.vue'
import { EMPTY_SUBMIT_FAILURES } from '@/pages/permit/pages/create/constants/SubmitErrorRouting'
import type { IPermitWorker } from '@/models/modules/permit/Permit.model'
import type { IUpdatePermitDraftPayload } from '@/models/request/permit/PermitReq.model'
import type { IWizardStepProps } from '@/pages/permit/pages/create/wizard/WizardSteps'

/**
 * wayfinder 103 — "a worker is a name; the role belongs to the job". `roleOnPermit` is free text
 * on the wire (`minLength: 1`, no enum) with `EWorkerRole` surviving only as a permit-type-filtered
 * TEMPLATE list of suggestions, never a closed set. This replaces the old fixed chip-button
 * control (one button per `WORKER_ROLES_BY_TYPE` value, which could only ever emit exactly one of
 * those strings) with an editable AutoComplete: pick a template suggestion, or type anything.
 *
 * The role field is targeted by its placeholder text via the real `<input>` — PrimeVue's
 * AutoComplete (typeahead, non-multiple) writes every keystroke straight to `modelValue` via its
 * own `onInput`, so `setValue` on that input is a real user-typing simulation, not a synthetic
 * component-instance `$emit` (the row also renders a SECOND AutoComplete, `WorkerPicker`'s own
 * name field, so a component-type lookup alone cannot tell the two apart).
 */
const ROLE_PLACEHOLDER = 'Choose from the list or type a role'

function baseFormData (): IUpdatePermitDraftPayload {
  return {
    type: 'hot',
    workers: [{ workerId: 761, workerName: 'Somchai', roleOnPermit: 'Operator' } as unknown as IPermitWorker]
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
      positionState: 'none'
    } satisfies IWizardStepProps
  })
}

describe('Step4PpeWorkers — roleOnPermit is an editable AutoComplete, template + free text (wayfinder 103)', () => {
  beforeEach((): void => {
    setLocale('en')
    vi.spyOn(WorkerProvider.prototype, 'list').mockResolvedValue({
      message: 'ok', data: [], count: 0, totalPage: 1
    } as never)
  })

  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('picking a template EWorkerRole value reaches formData.workers[].roleOnPermit', async () => {
    const wrapper = mountStep()
    await flushPromises()

    await wrapper.find(`input[placeholder="${ROLE_PLACEHOLDER}"]`).setValue('Fire Watcher')
    await flushPromises()

    const emitted = wrapper.emitted('update:formData')
    expect(emitted).toBeTruthy()
    const lastPatch = emitted?.at(-1)?.[0] as Partial<IUpdatePermitDraftPayload>
    expect(lastPatch.workers?.[0]?.roleOnPermit).toBe('Fire Watcher')
  })

  it('typing free text (no matching template value) still reaches formData.workers[].roleOnPermit', async () => {
    const wrapper = mountStep()
    await flushPromises()

    // A role the wizard's own EWorkerRole template list does not offer for a hot-work permit —
    // free entry is legal per wayfinder 103, and must reach the payload exactly as typed.
    await wrapper.find(`input[placeholder="${ROLE_PLACEHOLDER}"]`).setValue('Riser Watchman')
    await flushPromises()

    const emitted = wrapper.emitted('update:formData')
    expect(emitted).toBeTruthy()
    const lastPatch = emitted?.at(-1)?.[0] as Partial<IUpdatePermitDraftPayload>
    expect(lastPatch.workers?.[0]?.roleOnPermit).toBe('Riser Watchman')
  })
})
