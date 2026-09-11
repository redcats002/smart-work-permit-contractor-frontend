import { flushPromises, mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import WorkerProvider from '@/resources/provider/worker/Worker.provider'
import Step4PpeWorkers from '@/pages/permit/pages/create/components/steps/Step4PpeWorkers.vue'
import WorkerPicker from '@/components/worker/WorkerPicker.vue'
import { EMPTY_SUBMIT_FAILURES } from '@/pages/permit/pages/create/constants/SubmitErrorRouting'
import type { IWorker } from '@/models/modules/worker/Worker.model'
import type { IPermitWorker } from '@/models/modules/permit/Permit.model'
import type { IUpdatePermitDraftPayload } from '@/models/request/permit/PermitReq.model'
import type { IWizardStepProps } from '@/pages/permit/pages/create/wizard/WizardSteps'

/**
 * wayfinder ticket 063 — the worker field binds a Worker ENTITY (`WorkerPicker`), not a plain
 * name string, and this is the regression test for the two traps 061 recorded a cycle each:
 *
 *  - the picker must actually write `workerId` onto the row (not just display a name), and
 *  - the value that lands on the wire (via `update:formData` → `formData.workers`, which is what
 *    `useWizard.doPersist` reads and PATCHes) must carry that `workerId` — not `undefined`.
 *
 * This file replaces `Step4PpeWorkers.workerAutocomplete.test.ts` (deleted) wholesale rather than
 * adjusting it: that file tested the free-text AutoComplete-over-certificates control this ticket
 * removes entirely, not just its one "accepts free text" case the ticket names explicitly. 048's
 * acceptance criterion 4 ("free text stays legal") is void per 059 ruling 11 / 063's own text.
 */
function worker (overrides: Partial<IWorker> = {}): IWorker {
  return { id: 761, name: 'Somchai', role: 'Operator', ...overrides }
}

function baseFormData (): IUpdatePermitDraftPayload {
  return {
    type: 'hot',
    workers: [{ workerId: undefined, workerName: '', roleOnPermit: 'Operator' } as unknown as IPermitWorker]
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

describe('Step4PpeWorkers — binds a Worker via WorkerPicker (wayfinder 063)', () => {
  beforeEach((): void => {
    setLocale('en')
  })

  afterEach((): void => {
    vi.restoreAllMocks()
  })

  it('selecting a worker patches BOTH workerId and workerName onto the row', async () => {
    vi.spyOn(WorkerProvider.prototype, 'list').mockResolvedValue({
      message: 'ok', data: [worker()], count: 1, totalPage: 1
    } as never)

    const wrapper = mountStep()
    await flushPromises()

    const picker = wrapper.findComponent(WorkerPicker)
    picker.vm.$emit('worker-selected', worker())
    await flushPromises()

    const emitted = wrapper.emitted('update:formData')
    expect(emitted).toBeTruthy()
    const lastPatch = emitted?.at(-1)?.[0] as Partial<IUpdatePermitDraftPayload>
    // The silent no-op trap: without this write-through, `workerId` reaches the wire as
    // `undefined` and `POST/PATCH /permits/:id` 422s on `workers[].workerId` — loud, but only at
    // submit, long after the picker looked like it worked.
    expect(lastPatch.workers?.[0]?.workerId).toBe(761)
    expect(lastPatch.workers?.[0]?.workerName).toBe('Somchai')
  })

  it('clearing a selection (typing over it) clears workerId, never leaving a stale id behind a new name', async () => {
    vi.spyOn(WorkerProvider.prototype, 'list').mockResolvedValue({
      message: 'ok', data: [worker()], count: 1, totalPage: 1
    } as never)

    const wrapper = mountStep()
    await flushPromises()

    const picker = wrapper.findComponent(WorkerPicker)
    picker.vm.$emit('worker-selected', worker())
    await flushPromises()
    picker.vm.$emit('worker-selected', undefined)
    await flushPromises()

    const emitted = wrapper.emitted('update:formData')
    const lastPatch = emitted?.at(-1)?.[0] as Partial<IUpdatePermitDraftPayload>
    expect(lastPatch.workers?.[0]?.workerId).toBeUndefined()
    expect(lastPatch.workers?.[0]?.workerName).toBe('')
  })

  it('a worker selection triggers the certificate pre-flight recheck', async () => {
    vi.spyOn(WorkerProvider.prototype, 'list').mockResolvedValue({
      message: 'ok', data: [worker()], count: 1, totalPage: 1
    } as never)

    const wrapper = mountStep()
    await flushPromises()

    const picker = wrapper.findComponent(WorkerPicker)
    picker.vm.$emit('worker-selected', worker())
    await flushPromises()

    expect(wrapper.emitted('recheck-certificates')).toBeTruthy()
  })

  /**
   * wayfinder ticket 048 readability fixes must still hold once the AutoComplete inside
   * `WorkerPicker` replaces the old direct one — the min-width is now on `WorkerPicker`'s root.
   */
  it('keeps the worker column wide enough to read (wayfinder 048)', async () => {
    vi.spyOn(WorkerProvider.prototype, 'list').mockResolvedValue({
      message: 'ok', data: [], count: 0, totalPage: 1
    } as never)

    const wrapper = mountStep()
    await flushPromises()

    expect(wrapper.findComponent(WorkerPicker).classes()).toContain('min-w-[13.75rem]')
  })
})
