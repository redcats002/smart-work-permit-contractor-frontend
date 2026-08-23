import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { z } from 'zod'
import PermitProvider from '@/resources/provider/permit/Permit.provider'
import { useWizard } from '@/pages/permit/pages/create/composables/useWizard'
import type { IWizardStepDef } from '@/pages/permit/pages/create/wizard/WizardSteps'

/**
 * Exercises the wizard shell's navigation + persistence logic in isolation
 * from the real permit domain — the real WIZARD_STEPS registry ships
 * placeholder schemas that always pass (see wizard/WizardSteps.ts), which is
 * correct for PMT-004 but useless for proving "Next is blocked while the
 * current step's schema fails". This file injects a small fake registry with
 * one deliberately failing schema instead, exactly as useWizard's own doc
 * comment says tests should.
 */

const StubComponent = defineComponent({ template: '<div />' })

function makeSteps (): IWizardStepDef[] {
  return [
    { key: 'first', labelKey: 'permit.wizard.step.1', component: StubComponent, schema: z.object({}) },
    {
      key: 'second',
      labelKey: 'permit.wizard.step.2',
      component: StubComponent,
      schema: z.object({ title: z.string().min(1) })
    },
    { key: 'last', labelKey: 'permit.wizard.step.3', component: StubComponent, schema: z.object({}) }
  ]
}

async function flushMicrotasks (): Promise<void> {
  for (let i = 0; i < 20; i++) {
    await Promise.resolve()
  }
}

describe('useWizard — navigation', () => {
  it('blocks next while the current step schema fails, unblocks once formData satisfies it', () => {
    const wizard = useWizard(makeSteps())

    wizard.next() // step 1's schema always passes -> advances to step 2
    expect(wizard.currentStepIndex.value).toBe(1)
    expect(wizard.isNextBlocked.value).toBe(true) // step 2 requires `project`, formData is still empty

    wizard.next() // blocked -> no-op
    expect(wizard.currentStepIndex.value).toBe(1)

    wizard.updateFormData({ title: 'Warehouse repaint' })
    expect(wizard.isNextBlocked.value).toBe(false)

    wizard.next()
    expect(wizard.currentStepIndex.value).toBe(2)
  })

  it('back never validates — it succeeds even while the current step is blocked', () => {
    const wizard = useWizard(makeSteps())

    wizard.next() // -> step 2, blocked (no project yet)
    expect(wizard.isNextBlocked.value).toBe(true)

    wizard.back()
    expect(wizard.currentStepIndex.value).toBe(0)
  })

  it('back is a no-op on the first step', () => {
    const wizard = useWizard(makeSteps())
    wizard.back()
    expect(wizard.currentStepIndex.value).toBe(0)
  })

  it('flags the last step (isLastStep) so the shell swaps Next for Submit, and gates Submit', () => {
    const wizard = useWizard(makeSteps())
    expect(wizard.isLastStep.value).toBe(false)

    wizard.updateFormData({ title: 'Warehouse repaint' })
    wizard.next() // -> step 2
    wizard.next() // -> step 3 (last)

    expect(wizard.isLastStep.value).toBe(true)
    // No permit `type` was ever set, so no draft was ever created — Submit must
    // stay disabled even though the last step's own placeholder schema passes.
    expect(wizard.draftId.value).toBeUndefined()
    expect(wizard.canSubmit.value).toBe(false)
  })

  it('goToStep refuses to jump past the furthest step unlocked via next() (no deep-linking to a locked step)', () => {
    const wizard = useWizard(makeSteps())

    wizard.goToStep(2) // nothing unlocked yet beyond step 1
    expect(wizard.currentStepIndex.value).toBe(0)

    wizard.updateFormData({ title: 'Warehouse repaint' })
    wizard.next() // unlocks + moves to index 1
    expect(wizard.maxUnlockedStepIndex.value).toBe(1)

    wizard.goToStep(2) // still locked (max is 1)
    expect(wizard.currentStepIndex.value).toBe(1)

    wizard.goToStep(0) // revisiting an already-unlocked step is fine
    expect(wizard.currentStepIndex.value).toBe(0)
  })

  it('goToStep also refuses the jump if an earlier unlocked step has since become invalid', () => {
    const wizard = useWizard(makeSteps())

    wizard.updateFormData({ title: 'Warehouse repaint' })
    wizard.next() // step 2 now unlocked+current (index 1)
    wizard.next() // step 3 now unlocked+current (index 2)
    expect(wizard.maxUnlockedStepIndex.value).toBe(2)

    wizard.goToStep(0) // revisit step 1 to edit it
    // Clearing `project` makes step 2 (index 1) invalid again, even though it was
    // already unlocked — maxUnlockedStepIndex alone would still allow jumping to 2.
    wizard.updateFormData({ title: '' })

    wizard.goToStep(2)
    expect(wizard.currentStepIndex.value).toBe(0) // refused — step 2 no longer validates

    wizard.updateFormData({ title: 'Warehouse repaint (fixed)' })
    wizard.goToStep(2)
    expect(wizard.currentStepIndex.value).toBe(2) // allowed again once step 2 re-validates
  })

  it('is page-scoped, not shared state — a fresh call starts clean regardless of a prior instance', () => {
    const first = useWizard(makeSteps())
    first.updateFormData({ title: 'first visit' })
    first.next()
    expect(first.currentStepIndex.value).toBe(1)

    const second = useWizard(makeSteps())
    expect(second.currentStepIndex.value).toBe(0)
    expect(second.maxUnlockedStepIndex.value).toBe(0)
    expect(second.formData.value).toEqual({})
    expect(second.draftId.value).toBeUndefined()
  })
})

describe('useWizard — draft persistence', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // POST /permits requires type, title, location, foreman, workDate, workTimeStart and
  // workTimeEnd together, all non-empty (API-005). Firing a create before that is a guaranteed
  // 400 — the reason `hasCreatableDraft` gates persistence.
  /** The minimum payload the backend will accept for a draft. */
  function creatableDraft (): Record<string, unknown> {
    return {
      type: 'hot',
      title: 'Warehouse repaint',
      location: 'Zone 3',
      foreman: 'Somchai',
      workDate: '2026-08-20',
      workTimeStart: '2026-08-20T01:00:00.000Z',
      workTimeEnd: '2026-08-20T09:00:00.000Z'
    }
  }

  it('creates no draft until every field POST /permits requires is present', async () => {
    const createSpy = vi.spyOn(PermitProvider.prototype, 'create')
    const wizard = useWizard(makeSteps())

    wizard.updateFormData({ title: 'no type chosen yet' })
    await vi.advanceTimersByTimeAsync(2000)
    expect(createSpy).not.toHaveBeenCalled()

    // Type alone is still not enough — the old "first meaningful input" rule would have posted here.
    wizard.updateFormData({ type: 'hot' })
    await vi.advanceTimersByTimeAsync(2000)
    expect(createSpy).not.toHaveBeenCalled()
    expect(wizard.draftId.value).toBeUndefined()
  })

  it('creates exactly one draft when two writes race ahead of the first POST resolving, then PATCHes', async () => {
    let resolveCreate: (value: unknown) => void = (): void => undefined
    const createDeferred = new Promise((resolve: (value: unknown) => void): void => {
      resolveCreate = resolve
    })
    const createSpy = vi.spyOn(PermitProvider.prototype, 'create').mockReturnValue(createDeferred as never)
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'ok', data: { id: 'WP-TEST-1' } } as never)

    const wizard = useWizard(makeSteps())

    wizard.updateFormData(creatableDraft())
    await vi.advanceTimersByTimeAsync(1500) // first debounce fires -> create() called, still pending

    expect(createSpy).toHaveBeenCalledTimes(1)
    expect(wizard.draftId.value).toBeUndefined()

    wizard.updateFormData({ title: 'Warehouse repaint' })
    await vi.advanceTimersByTimeAsync(1500) // second debounce fires while the first POST is still unresolved

    // The second write is chained behind the first in-flight one, not fired
    // independently — this is what prevents a duplicate draft.
    expect(createSpy).toHaveBeenCalledTimes(1)
    expect(updateSpy).not.toHaveBeenCalled()

    resolveCreate({ message: 'stub: draft created', data: { id: 'WP-TEST-1' } })
    await flushMicrotasks()

    expect(wizard.draftId.value).toBe('WP-TEST-1')
    expect(updateSpy).toHaveBeenCalledTimes(1)
    expect(updateSpy).toHaveBeenCalledWith('WP-TEST-1', expect.objectContaining({ type: 'hot', title: 'Warehouse repaint' }))
  })
})
