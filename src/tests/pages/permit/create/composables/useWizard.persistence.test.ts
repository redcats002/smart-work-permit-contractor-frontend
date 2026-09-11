import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { z } from 'zod'
import { toast } from '@/plugins/toast'
import PermitProvider from '@/resources/provider/permit/Permit.provider'
import { useWizard } from '@/pages/permit/pages/create/composables/useWizard'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import type { IWizardStepDef } from '@/pages/permit/pages/create/wizard/WizardSteps'

// `toast` wraps PrimeVue's ToastService, unavailable to a bare `useWizard()` call — mocking it
// also lets the autosave test below assert silence, not just a lack of a crash.
vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

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
    startDate: '2026-08-20',
    endDate: '2026-08-20',
    dailyStart: '2026-08-20T01:00:00.000Z',
    dailyEnd: '2026-08-20T09:00:00.000Z'
  }
}

/**
 * wayfinder tickets 045/107 — a permit as `GET /permits/:id` returns it, for the hydrate path.
 * Only `areaId`/`pinId` vary across the cases below; everything else is a valid, complete draft so
 * `hydrate`'s own conversions (workDate, workers) have real input to work on.
 */
function hydratedPermit (overrides: Partial<IPermitDetail> = {}): IPermitDetail {
  return {
    id: 'WP-TEST-1',
    type: 'heights',
    status: 'DRAFT',
    title: 'Roof repair',
    foreman: 'Somchai',
    location: 'Zone 3',
    startDate: '2026-08-20T00:00:00.000Z',
    endDate: '2026-08-20T00:00:00.000Z',
    dailyStart: '2026-08-20T01:00:00.000Z',
    dailyEnd: '2026-08-20T09:00:00.000Z',
    scheduleNote: null,
    outdoorWork: false,
    createdById: 'u1',
    createdBy: null,
    createdAt: '2026-08-19T00:00:00.000Z',
    updatedAt: '2026-08-19T00:00:00.000Z',
    submittedAt: null,
    approvedById: null,
    approvedBy: null,
    approvedAt: null,
    rejectedReason: null,
    rejectedAt: null,
    closedById: null,
    closedBy: null,
    closedAt: null,
    fireMonitorStartedAt: null,
    qrIssuedAt: null,
    entrantCount: 0,
    fireWatch: null,
    pinId: null,
    areaId: null,
    jsaSteps: [],
    workers: [],
    photos: [],
    latestSafetyReading: null,
    ...overrides
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

  /**
   * wayfinder ticket 008: the autosave PATCH (and its first-call POST leg) must never toast on
   * SUCCESS — that is the exact "stream of notifications" the ruling forbids. This covers the
   * happy path only. A FAILED autosave still toasts (see `persist()` in useWizard.ts) — that is
   * deliberate, not an oversight: a silently-failed autosave is invisible data loss with no other
   * channel telling the user their edit was not saved. Do not "fix" that error toast away.
   */
  it('NEVER toasts on a successful autosave — both the create and the update leg', async () => {
    vi.mocked(toast.success).mockClear()
    vi.mocked(toast.error).mockClear()

    const { wizard } = await bootDraft() // fires the create leg (POST /permits)

    wizard.updateFormData({ title: 'Warehouse repaint — revised' })
    await vi.advanceTimersByTimeAsync(1600) // fires the update leg (PATCH /permits/:id)

    expect(toast.success).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
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

/**
 * wayfinder ticket 044 (building on 037) — "a permit that already references an area must never
 * become unsaveable because a visibility flag was switched on."
 *
 * Once the deployment sets `AREA_VISIBILITY_SCOPED=TRUE`, `GET /v1/areas` stops listing areas this
 * contractor neither proposed nor was granted. `AreaPicker` answers by emitting
 * `{ areaId: undefined }`, and `updateFormData`'s spread copies that key rather than removing it —
 * so `doPersist` is the only place that can guarantee it never reaches the wire. The server's
 * `AREA_NOT_APPROVED` guard fires on the key's PRESENCE, so one leaked key would 400 every
 * autosave for the rest of the session; `null`, meanwhile, is a real destructive clear and must
 * still get through when a human actually asked for it. Both spellings are pinned here.
 */
describe('useWizard — areaId omission on autosave (wayfinder tickets 037 + 044 + 045)', () => {
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
    await vi.advanceTimersByTimeAsync(1600) // POST /permits
    return { wizard, updateSpy }
  }

  function lastPatchBody (updateSpy: ReturnType<typeof vi.spyOn>): Record<string, unknown> {
    return (updateSpy.mock.calls.at(-1) as [string, Record<string, unknown>])[1]
  }

  it('HEADLINE — a permit whose area is scoped out of the list still autosaves, with no areaId key at all', async () => {
    vi.mocked(toast.error).mockClear()
    const { wizard, updateSpy } = await bootDraft()

    // The permit was hydrated against area 77; AreaPicker could not find 77 in the scoped list and
    // stripped it. `undefined`, deliberately — see AreaPicker.resolveStaleArea.
    wizard.updateFormData({ areaId: 77 })
    wizard.updateFormData({ areaId: undefined })
    await vi.advanceTimersByTimeAsync(1600)

    // The permit is still saveable: a PATCH really went out...
    expect(updateSpy).toHaveBeenCalled()
    // ...and it carries no `areaId` key whatsoever. `toEqual`/`toMatchObject` would pass here even
    // if the key were present holding `undefined`, so assert on the key itself — that presence is
    // exactly what the server's guard tests.
    expect(Object.keys(lastPatchBody(updateSpy))).not.toContain('areaId')
    expect(lastPatchBody(updateSpy)).not.toHaveProperty('areaId')
    expect(toast.error).not.toHaveBeenCalled()

    // Every later autosave stays clean too — the strip is not a one-shot that a subsequent edit
    // re-dirties.
    wizard.updateFormData({ title: 'Warehouse repaint — revised' })
    await vi.advanceTimersByTimeAsync(1600)
    expect(Object.keys(lastPatchBody(updateSpy))).not.toContain('areaId')
  })

  it('still sends areaId: null for a user’s deliberate clear — the strip must not swallow that', async () => {
    const { wizard, updateSpy } = await bootDraft()

    wizard.updateFormData({ areaId: 5 })
    await vi.advanceTimersByTimeAsync(1600)
    wizard.updateFormData({ areaId: null })
    await vi.advanceTimersByTimeAsync(1600)

    expect(lastPatchBody(updateSpy)).toHaveProperty('areaId', null)
  })

  it('sends a real areaId untouched — an approved area the contractor CAN see still saves', async () => {
    const { wizard, updateSpy } = await bootDraft()

    wizard.updateFormData({ areaId: 12 })
    await vi.advanceTimersByTimeAsync(1600)

    expect(lastPatchBody(updateSpy)).toHaveProperty('areaId', 12)
  })

  /**
   * wayfinder ticket 045 — the hole 044's fix left. Its strip only ran when `AreaPicker` emitted
   * `areaId: undefined`, which needs `AreaPicker` to MOUNT. It lives inside `Step7Position`, and
   * `steps` filters that step out entirely when no facility plan is active — which is production
   * today (ticket 014: no plan version was ever activated).
   *
   * So a hydrated permit whose `areaId` names a genuinely non-APPROVED area re-sent that id on
   * every autosave, the server's presence-based `AREA_NOT_APPROVED` guard 400'd every one, and no
   * UI existed that could clear it. This is that permit, saving with no picker anywhere: the
   * wizard is built on a single-step registry, so `Step7Position` provably never mounts.
   */
  it('HEADLINE 045 — a hydrated areaId is never echoed back, even with no AreaPicker in the wizard', async () => {
    vi.mocked(toast.error).mockClear()
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)
    const createSpy = vi.spyOn(PermitProvider.prototype, 'create')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)

    const wizard = useWizard(makeSteps())
    wizard.hydrate(hydratedPermit({ areaId: 77 }))

    // Seeded for display — the picker, when it exists, needs it to resolve and show the area.
    expect(wizard.formData.value.areaId).toBe(77)

    // An ordinary edit somewhere else in the wizard triggers the autosave.
    wizard.updateFormData({ title: 'Roof repair — revised' })
    await vi.advanceTimersByTimeAsync(1600)

    expect(createSpy).not.toHaveBeenCalled()
    expect(updateSpy).toHaveBeenCalled()
    // Assert on the KEY LIST. `toEqual` and `toMatchObject` both ignore undefined-valued
    // properties, so either would pass whether or not the key was stripped — 044 hit exactly
    // that trap, and the server's guard tests presence, not value.
    expect(Object.keys(lastPatchBody(updateSpy))).not.toContain('areaId')
    expect(toast.error).not.toHaveBeenCalled()

    // Still clean on every later autosave, not just the first.
    wizard.updateFormData({ foreman: 'Wichai' })
    await vi.advanceTimersByTimeAsync(1600)
    expect(Object.keys(lastPatchBody(updateSpy))).not.toContain('areaId')
  })

  it('sends a user’s pick made AFTER a hydrate — seeding is not choosing, but choosing is', async () => {
    vi.spyOn(PermitProvider.prototype, 'create')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)

    const wizard = useWizard(makeSteps())
    wizard.hydrate(hydratedPermit({ areaId: 77 }))

    wizard.updateFormData({ areaId: 91 })
    await vi.advanceTimersByTimeAsync(1600)
    expect(lastPatchBody(updateSpy)).toHaveProperty('areaId', 91)

    // …and a deliberate clear after a hydrate still reaches the server as a real `null`, which is
    // the case a blanket "always delete areaId" fix would silently destroy.
    wizard.updateFormData({ areaId: null })
    await vi.advanceTimersByTimeAsync(1600)
    expect(lastPatchBody(updateSpy)).toHaveProperty('areaId', null)
  })
})

/**
 * wayfinder ticket 107 — `pinId` inherits ticket 045's `areaId` invariant exactly, same three
 * spellings, same reasoning: a reference reaches the wire only when a human set it this session.
 * `PinPicker` mirrors `AreaPicker.resolveStaleArea`'s `{ pinId: undefined }` emit for a broken
 * reference; `doPersist` is what actually guarantees a hydrated-but-untouched `pinId` never rides
 * an unrelated autosave, regardless of which wizard steps mounted.
 */
describe('useWizard — pinId omission on autosave (wayfinder ticket 107)', () => {
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
    await vi.advanceTimersByTimeAsync(1600) // POST /permits
    return { wizard, updateSpy }
  }

  function lastPatchBody (updateSpy: ReturnType<typeof vi.spyOn>): Record<string, unknown> {
    return (updateSpy.mock.calls.at(-1) as [string, Record<string, unknown>])[1]
  }

  it('HEADLINE — a permit whose pin could not be resolved still autosaves, with no pinId key at all', async () => {
    vi.mocked(toast.error).mockClear()
    const { wizard, updateSpy } = await bootDraft()

    // PinPicker resolved 77 as broken (deleted, or otherwise unreachable) and stripped it.
    // `undefined`, deliberately — see PinPicker.resolveReferencedPin's failure branch.
    wizard.updateFormData({ pinId: 77 })
    wizard.updateFormData({ pinId: undefined })
    await vi.advanceTimersByTimeAsync(1600)

    // The permit is still saveable: a PATCH really went out...
    expect(updateSpy).toHaveBeenCalled()
    // ...and it carries no `pinId` key whatsoever. `toEqual`/`toMatchObject` would pass here even
    // if the key were present holding `undefined`, so assert on the key itself.
    expect(Object.keys(lastPatchBody(updateSpy))).not.toContain('pinId')
    expect(lastPatchBody(updateSpy)).not.toHaveProperty('pinId')
    expect(toast.error).not.toHaveBeenCalled()

    // Every later autosave stays clean too — the strip is not a one-shot that a subsequent edit
    // re-dirties.
    wizard.updateFormData({ title: 'Warehouse repaint — revised' })
    await vi.advanceTimersByTimeAsync(1600)
    expect(Object.keys(lastPatchBody(updateSpy))).not.toContain('pinId')
  })

  it('still sends pinId: null for a user’s deliberate clear — the strip must not swallow that', async () => {
    const { wizard, updateSpy } = await bootDraft()

    wizard.updateFormData({ pinId: 5 })
    await vi.advanceTimersByTimeAsync(1600)
    wizard.updateFormData({ pinId: null })
    await vi.advanceTimersByTimeAsync(1600)

    expect(lastPatchBody(updateSpy)).toHaveProperty('pinId', null)
  })

  it('sends a real pinId untouched — an active pin the contractor picked still saves', async () => {
    const { wizard, updateSpy } = await bootDraft()

    wizard.updateFormData({ pinId: 12 })
    await vi.advanceTimersByTimeAsync(1600)

    expect(lastPatchBody(updateSpy)).toHaveProperty('pinId', 12)
  })

  /**
   * The headline case from the ticket itself: hydrate a permit carrying `pinId: 77` into a wizard
   * whose registry never mounts `PinPicker` (the single-step `makeSteps()` fixture), make an
   * unrelated edit, and assert the outgoing PATCH's key list does NOT contain `pinId` — not
   * `toEqual`/`toMatchObject`, which ignore undefined-valued keys and would pass either way.
   */
  it('HEADLINE 107 — a hydrated pinId is never echoed back, even with no PinPicker in the wizard', async () => {
    vi.mocked(toast.error).mockClear()
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)
    const createSpy = vi.spyOn(PermitProvider.prototype, 'create')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)

    const wizard = useWizard(makeSteps())
    wizard.hydrate(hydratedPermit({ pinId: 77 }))

    // Seeded for display — the picker, when it exists, needs it to resolve and show the pin.
    expect(wizard.formData.value.pinId).toBe(77)

    // An ordinary edit somewhere else in the wizard triggers the autosave.
    wizard.updateFormData({ title: 'Roof repair — revised' })
    await vi.advanceTimersByTimeAsync(1600)

    expect(createSpy).not.toHaveBeenCalled()
    expect(updateSpy).toHaveBeenCalled()
    // Assert on the KEY LIST — see the HEADLINE 045 test's own comment for why this matters.
    expect(Object.keys(lastPatchBody(updateSpy))).not.toContain('pinId')
    expect(toast.error).not.toHaveBeenCalled()

    // Still clean on every later autosave, not just the first.
    wizard.updateFormData({ foreman: 'Wichai' })
    await vi.advanceTimersByTimeAsync(1600)
    expect(Object.keys(lastPatchBody(updateSpy))).not.toContain('pinId')
  })

  it('sends a user’s pick made AFTER a hydrate — seeding is not choosing, but choosing is', async () => {
    vi.spyOn(PermitProvider.prototype, 'create')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)

    const wizard = useWizard(makeSteps())
    wizard.hydrate(hydratedPermit({ pinId: 77 }))

    wizard.updateFormData({ pinId: 91 })
    await vi.advanceTimersByTimeAsync(1600)
    expect(lastPatchBody(updateSpy)).toHaveProperty('pinId', 91)

    // …and a deliberate clear after a hydrate still reaches the server as a real `null`, which is
    // the case a blanket "always delete pinId" fix would silently destroy.
    wizard.updateFormData({ pinId: null })
    await vi.advanceTimersByTimeAsync(1600)
    expect(lastPatchBody(updateSpy)).toHaveProperty('pinId', null)
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

/**
 * wayfinder 107 — 070's "area drops the pin, pin rides in the same patch" describe block used to
 * live here. It tested the co-write of `Permit.position`, which 105 removed from the wire
 * entirely: area and pin are now fully independent fields (ticket 107 note 3) — picking an area
 * no longer touches `formData.pinId` at all (`Step3WhereWhen.onAreaChange` forwards only
 * `{ areaId }`, ignoring whatever `position` `AreaPicker` still computes for its own unrelated
 * default-position feature). There is nothing left here to race, so the block is gone rather than
 * rewritten to test a field that no longer exists.
 */

/**
 * wayfinder 067/070 — the multi-day work window. `dailyStart`/`dailyEnd` are `1970-01-01`-anchored
 * on the wire; only the UTC clock time survives a round trip. This proves a HYDRATED window comes
 * back out through `buildCreatePayload`/`doPersist` unchanged when nothing touched it — the "067
 * UTC trap" the ticket names: switching either leg of this round trip from local-time methods
 * (`getHours`/`setHours`) to UTC ones would shift every migrated permit by the deployment's
 * offset, silently, with no test failing UNLESS it asserts on the actual wire value like this one.
 */
describe('useWizard — multi-day window round-trips without a timezone shift (wayfinder 067)', () => {
  beforeEach((): void => {
    vi.useFakeTimers()
  })

  afterEach((): void => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('a hydrated multi-day window is unchanged after an unrelated autosave', async () => {
    vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)

    const wizard = useWizard(makeSteps())
    wizard.hydrate(hydratedPermit({
      startDate: '2026-08-20T00:00:00.000Z',
      endDate: '2026-08-22T00:00:00.000Z',
      dailyStart: '1970-01-01T01:00:00.000Z',
      dailyEnd: '1970-01-01T09:00:00.000Z',
      areaId: undefined
    }))

    expect(wizard.formData.value.startDate).toBe('2026-08-20')
    expect(wizard.formData.value.endDate).toBe('2026-08-22')

    // An unrelated edit forces an autosave that re-sends the whole accumulated formData, including
    // the untouched daily window — this is what would drift under the UTC trap.
    wizard.updateFormData({ title: 'Roof repair — revised' })
    await vi.advanceTimersByTimeAsync(1600)

    const updateSpy = vi.mocked(PermitProvider.prototype.update)
    const lastCall = updateSpy.mock.calls.at(-1) as [string, Record<string, unknown>]
    expect(lastCall[1].dailyStart).toBe('1970-01-01T01:00:00.000Z')
    expect(lastCall[1].dailyEnd).toBe('1970-01-01T09:00:00.000Z')
  })
})
