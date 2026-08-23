import { describe, expect, it } from 'vitest'
import { setLocale } from '@/plugins/I18n.plugin'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import { useWizard } from '@/pages/permit/pages/create/composables/useWizard'

/**
 * PMT-014 — useWizard.hydrate().
 *
 * Covers acceptance bullets 2 and 3: hydrate seeds `formData` (including `safetyReading`,
 * `workers`, `jsaSteps`, `photos`) and `draftId` so the first edit PATCHes rather than creating a
 * second draft, and lands the user on the first step that does not validate rather than always
 * step 1, unlocking every earlier step on the way.
 */
function basePermit (overrides: Partial<IPermitDetail> = {}): IPermitDetail {
  return {
    id: 'WP-HT-20260820-001',
    type: 'heights',
    status: 'DRAFT',
    title: 'Roof repair',
    foreman: 'Somchai',
    location: 'Zone 3',
    // Full ISO timestamp, exactly what GET /permits/:id returns — hydrate must convert this to
    // YYYY-MM-DD, never round-trip it as-is.
    workDate: '2026-08-20T00:00:00.000Z',
    workTimeStart: '2026-08-20T01:00:00.000Z',
    workTimeEnd: '2026-08-20T09:00:00.000Z',
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
    jsaSteps: [],
    workers: [],
    photos: [],
    latestSafetyReading: { wind: 10 },
    ...overrides
  }
}

describe('useWizard.hydrate', () => {
  it('seeds formData/draftId and lands on the first step that does not validate', () => {
    setLocale('en')
    const wizard = useWizard()

    // Steps 4 (workers) and 5 (JSA) have no minimum-row requirement (PMT-007/PMT-008), so an
    // empty table on either does not block — the deterministic first failure here is step 2's
    // basic info (index 1), forced by an empty `title`.
    const permit = basePermit({ title: '' })

    wizard.hydrate(permit)

    expect(wizard.draftId.value).toBe('WP-HT-20260820-001')
    expect(wizard.formData.value.workDate).toBe('2026-08-20')
    expect(wizard.formData.value.safetyReading).toEqual({ wind: 10 })
    expect(wizard.formData.value.workers).toEqual([])
    expect(wizard.formData.value.jsaSteps).toEqual([])
    expect(wizard.formData.value.photos).toEqual([])

    expect(wizard.currentStepIndex.value).toBe(1)
    expect(wizard.maxUnlockedStepIndex.value).toBe(1)
  })

  it('lands on the last step (Review) when every step already validates', () => {
    setLocale('en')
    const wizard = useWizard()

    const permit = basePermit({
      workers: [{ workerName: 'Somchai', roleOnPermit: 'Worker' }],
      jsaSteps: [{ phase: 'pre', step: 'Inspect harness', hazard: 'Fall', control: 'Wear harness', sortOrder: 0 }]
    })

    wizard.hydrate(permit)

    expect(wizard.currentStepIndex.value).toBe(wizard.steps.length - 1)
    expect(wizard.maxUnlockedStepIndex.value).toBe(wizard.steps.length - 1)
  })

  it('drops a worker\'s null health fields but keeps a real one (bloodPressure/alcoholReading are string-only on the wire)', () => {
    setLocale('en')
    const wizard = useWizard()

    const permit = basePermit({
      workers: [
        { workerName: 'Somchai', roleOnPermit: 'Worker', bloodPressure: null, alcoholReading: null },
        { workerName: 'Anan', roleOnPermit: 'Worker', bloodPressure: '120/80', alcoholReading: '0.00' }
      ]
    })

    wizard.hydrate(permit)

    expect(wizard.formData.value.workers).toEqual([
      { workerName: 'Somchai', roleOnPermit: 'Worker' },
      { workerName: 'Anan', roleOnPermit: 'Worker', bloodPressure: '120/80', alcoholReading: '0.00' }
    ])
  })

  it('primes lastPersistedReading so the copied/unchanged reading is never resent as a new row', async () => {
    setLocale('en')
    const PermitProvider = (await import('@/resources/provider/permit/Permit.provider')).default
    const { vi } = await import('vitest')
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-HT-20260820-001' } } as never)

    vi.useFakeTimers()
    const wizard = useWizard()
    const permit = basePermit({
      workers: [{ workerName: 'Somchai', roleOnPermit: 'Worker' }],
      jsaSteps: [{ phase: 'pre', step: 'Inspect harness', hazard: 'Fall', control: 'Wear harness', sortOrder: 0 }]
    })
    wizard.hydrate(permit)

    // An unrelated edit — the reading itself is untouched — must not carry safetyReading at all.
    wizard.updateFormData({ location: 'Zone 4' })
    await vi.advanceTimersByTimeAsync(1600)
    await Promise.resolve()

    expect(updateSpy).toHaveBeenCalled()
    const lastCall = updateSpy.mock.calls.at(-1)?.[1] as Record<string, unknown>
    expect(lastCall.safetyReading).toBeUndefined()

    vi.useRealTimers()
    vi.restoreAllMocks()
  })
})
