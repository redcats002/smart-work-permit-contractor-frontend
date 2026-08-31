import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { z } from 'zod'
import PermitProvider from '@/resources/provider/permit/Permit.provider'
import { useWizard } from '@/pages/permit/pages/create/composables/useWizard'
import type { IWizardStepDef } from '@/pages/permit/pages/create/wizard/WizardSteps'

/**
 * PMT-006 — the `safetyReading` append guard.
 *
 * `safetyReading` APPENDS a row on PATCH (it is a log, not a field — see
 * IUpdatePermitDraftPayload). `doPersist` sends the whole accumulated `formData`, so without a
 * guard every later edit — a title fix, a JSA row, a worker's BP — would append a duplicate
 * reading forever. These cases pin the guard, including the two subtleties that make it correct:
 * the snapshot is taken only AFTER the PATCH resolves, and SO2 is stripped because the wire has
 * no such field (docs/api/GAPS.md row K).
 */
const StubComponent = defineComponent({ template: '<div />' })

function makeSteps (): IWizardStepDef[] {
  return [
    { key: 'only', labelKey: 'permit.wizard.step.1', component: StubComponent, schema: z.object({}) }
  ]
}

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

interface IUpdateCall {
  safetyReading?: Record<string, unknown>
}

describe('useWizard — safetyReading append guard', () => {
  beforeEach((): void => {
    vi.useFakeTimers()
  })

  afterEach((): void => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  async function bootDraft (): Promise<{ wizard: ReturnType<typeof useWizard>, updateSpy: ReturnType<typeof vi.spyOn> }> {
    vi.spyOn(PermitProvider.prototype, 'create')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)

    const wizard = useWizard(makeSteps())
    wizard.updateFormData(creatableDraft())
    await vi.advanceTimersByTimeAsync(1600)
    return { wizard, updateSpy }
  }

  function readingsSent (updateSpy: ReturnType<typeof vi.spyOn>): Array<Record<string, unknown> | undefined> {
    return updateSpy.mock.calls.map((call: unknown[]): Record<string, unknown> | undefined =>
      (call[1] as IUpdateCall).safetyReading)
  }

  it('sends the reading once, then never re-sends it on an unrelated edit', async () => {
    const { wizard, updateSpy } = await bootDraft()

    wizard.updateFormData({ safetyReading: { lel: 0, o2: 20.9 } })
    await vi.advanceTimersByTimeAsync(1600)

    wizard.updateFormData({ title: 'Warehouse repaint — revised' })
    await vi.advanceTimersByTimeAsync(1600)

    const sent = readingsSent(updateSpy).filter(Boolean)
    expect(sent).toHaveLength(1)
    expect(sent[0]).toMatchObject({ lel: 0, o2: 20.9 })
  })

  it('appends again when the reading itself actually changes', async () => {
    const { wizard, updateSpy } = await bootDraft()

    wizard.updateFormData({ safetyReading: { lel: 0, o2: 20.9 } })
    await vi.advanceTimersByTimeAsync(1600)
    wizard.updateFormData({ safetyReading: { lel: 0, o2: 21.4 } })
    await vi.advanceTimersByTimeAsync(1600)

    expect(readingsSent(updateSpy).filter(Boolean)).toHaveLength(2)
  })

  it('strips SO2 — the PATCH safetyReading body has no such field (GAPS row K)', async () => {
    const { wizard, updateSpy } = await bootDraft()

    wizard.updateFormData({ safetyReading: { lel: 0, o2: 20.9, so2: 2 } })
    await vi.advanceTimersByTimeAsync(1600)

    const sent = readingsSent(updateSpy).filter(Boolean)[0] as Record<string, unknown>
    expect(sent).not.toHaveProperty('so2')
    expect(Object.keys(sent).sort()).toEqual(['co', 'height', 'lel', 'o2', 'wind'])
  })

  it('does not lose the reading when the PATCH fails — it is retried on the next write', async () => {
    vi.spyOn(PermitProvider.prototype, 'create')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
      .mockRejectedValueOnce(new Error('network down'))
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)

    const wizard = useWizard(makeSteps())
    wizard.updateFormData({ ...creatableDraft(), safetyReading: { lel: 0, o2: 20.9 } })
    await vi.advanceTimersByTimeAsync(1600) // create
    await vi.advanceTimersByTimeAsync(1600) // nothing pending yet

    wizard.updateFormData({ safetyReading: { lel: 0, o2: 20.9 } })
    await vi.advanceTimersByTimeAsync(1600) // first PATCH — rejects
    wizard.updateFormData({ title: 'retry trigger' })
    await vi.advanceTimersByTimeAsync(1600) // second PATCH — must still carry the reading

    expect(readingsSent(updateSpy).filter(Boolean).length).toBeGreaterThanOrEqual(1)
  })
})

describe('useWizard — step 3 checklist state', () => {
  it('keeps checklist answers out of formData entirely (no wire field — GAPS row J)', () => {
    const wizard = useWizard(makeSteps())

    wizard.updateChecklistAnswers({ 'hot-1': 'yes' })
    wizard.updateChecklistAnswers({ 'hot-2': 'na' })

    expect(wizard.checklistAnswers.value).toEqual({ 'hot-1': 'yes', 'hot-2': 'na' })
    expect(wizard.formData.value).not.toHaveProperty('checklistAnswers')
  })
})

/**
 * wayfinder ticket 001 (field report item 4). `PATCH /permits/:id` 400'd on `/jsaSteps/3/step`,
 * `/hazard`, `/control` with `Expected string length greater or equal to 1` — the offending row
 * was `{ phase: 'pre', step: '', hazard: '', control: '', sortOrder: 1 }`, an untouched "add row"
 * placeholder sent wholesale by `doPersist`. Covers both "Done when" bullets from the ticket, at
 * the composable level: an untouched empty row is dropped from what is actually PATCHed (formData
 * itself keeps it, so it is not lost from the UI), and a half-filled row never reaches the wire
 * either — the wizard mirrors the server's `minLength: 1`, it never gates beyond it.
 */
describe('useWizard — JSA row filtering at serialization (wayfinder ticket 001)', () => {
  beforeEach((): void => {
    vi.useFakeTimers()
  })

  afterEach((): void => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  async function bootDraft (): Promise<{ wizard: ReturnType<typeof useWizard>, updateSpy: ReturnType<typeof vi.spyOn> }> {
    vi.spyOn(PermitProvider.prototype, 'create')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)

    const wizard = useWizard(makeSteps())
    wizard.updateFormData(creatableDraft())
    await vi.advanceTimersByTimeAsync(1600) // POST /permits — jsaSteps has no home on create anyway
    return { wizard, updateSpy }
  }

  function jsaStepsSent (updateSpy: ReturnType<typeof vi.spyOn>): unknown {
    const lastCall = updateSpy.mock.calls.at(-1) as [string, { jsaSteps?: unknown }] | undefined
    return lastCall?.[1].jsaSteps
  }

  it('drops an untouched empty row from the PATCH — the field report payload exactly', async () => {
    const { wizard, updateSpy } = await bootDraft()

    wizard.updateFormData({
      jsaSteps: [
        { phase: 'pre', step: 'Isolate the line', hazard: 'Residual pressure', control: 'Lockout / tagout' },
        { phase: 'pre', step: '', hazard: '', control: '', sortOrder: 1 }
      ]
    })
    await vi.advanceTimersByTimeAsync(1600)

    expect(updateSpy).toHaveBeenCalled()
    expect(jsaStepsSent(updateSpy)).toEqual([
      { phase: 'pre', step: 'Isolate the line', hazard: 'Residual pressure', control: 'Lockout / tagout', sortOrder: 0 }
    ])
    // Not lost from the UI, only from the wire — the row is still there for the user to fill in.
    expect(wizard.formData.value.jsaSteps).toHaveLength(2)
  })

  it('omits jsaSteps from the PATCH entirely while a row is half-filled — never sends a shrunken array', async () => {
    const { wizard, updateSpy } = await bootDraft()

    wizard.updateFormData({
      jsaSteps: [{ phase: 'pre', step: 'Isolate the line', hazard: '', control: '' }]
    })
    await vi.advanceTimersByTimeAsync(1600)

    expect(updateSpy).toHaveBeenCalled()
    // NOT `[]` — jsaSteps is REPLACED WHOLESALE by this endpoint (AGENTS.md), so sending an array
    // with the partial row filtered out would still overwrite the permit's persisted jsaSteps.
    // The only safe move while a row is unfinished is to leave the key off the PATCH entirely.
    const lastCall = updateSpy.mock.calls.at(-1) as [string, Record<string, unknown>]
    expect(lastCall[1]).not.toHaveProperty('jsaSteps')
    // Still not lost — the partial row stays in formData so the user's typing survives.
    expect(wizard.formData.value.jsaSteps).toEqual([
      { phase: 'pre', step: 'Isolate the line', hazard: '', control: '' }
    ])
  })

  it('REGRESSION — a partial row left mid-edit must never wipe the permit\'s already-persisted JSA rows', async () => {
    const { wizard, updateSpy } = await bootDraft()

    // First PATCH: two complete rows land safely.
    wizard.updateFormData({
      jsaSteps: [
        { phase: 'pre', step: 'Isolate the line', hazard: 'Residual pressure', control: 'Lockout / tagout' },
        { phase: 'pre', step: 'Ventilate', hazard: 'Fumes', control: 'Fan running' }
      ]
    })
    await vi.advanceTimersByTimeAsync(1600)
    expect(jsaStepsSent(updateSpy)).toHaveLength(2)

    // User clears `hazard` on the first row to retype it — that row is now partial mid-edit, and
    // the debounced autosave fires while it is still empty (e.g. they pause, or navigate away and
    // onUnmounted flushes it). This PATCH must NOT tell the server "jsaSteps is now this shorter
    // array" — on a wholesale-replace endpoint that deletes the second, still-complete row too.
    wizard.updateFormData({
      jsaSteps: [
        { phase: 'pre', step: 'Isolate the line', hazard: '', control: 'Lockout / tagout' },
        { phase: 'pre', step: 'Ventilate', hazard: 'Fumes', control: 'Fan running' }
      ]
    })
    await vi.advanceTimersByTimeAsync(1600)

    const lastCall = updateSpy.mock.calls.at(-1) as [string, Record<string, unknown>]
    expect(lastCall[1]).not.toHaveProperty('jsaSteps')
  })

  it('recomputes sortOrder with no gaps once a mid-list row is dropped', async () => {
    const { wizard, updateSpy } = await bootDraft()

    wizard.updateFormData({
      jsaSteps: [
        { phase: 'pre', step: 'First', hazard: 'H1', control: 'C1', sortOrder: 0 },
        { phase: 'pre', step: '', hazard: '', control: '', sortOrder: 1 },
        { phase: 'pre', step: 'Third', hazard: 'H3', control: 'C3', sortOrder: 2 }
      ]
    })
    await vi.advanceTimersByTimeAsync(1600)

    expect(jsaStepsSent(updateSpy)).toEqual([
      { phase: 'pre', step: 'First', hazard: 'H1', control: 'C1', sortOrder: 0 },
      { phase: 'pre', step: 'Third', hazard: 'H3', control: 'C3', sortOrder: 1 }
    ])
  })
})
