import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { z } from 'zod'
import { EPpeItem } from '@/enums/modules/permit/PpeItem.enum'
import PermitProvider from '@/resources/provider/permit/Permit.provider'
import { useWizard } from '@/pages/permit/pages/create/composables/useWizard'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import type { IWizardStepDef } from '@/pages/permit/pages/create/wizard/WizardSteps'

// `toast` wraps PrimeVue's ToastService, unavailable to a bare `useWizard()` call.
vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

/**
 * Wayfinder 097. `ppeDeclared`/`ppeNote` are plain optional fields on `IUpdatePermitDraftPayload`
 * (whole-value replace, like `location`/`title` — not a collection), so this pins them going
 * through both the CREATE leg (`buildCreatePayload`) and the PATCH leg (the plain-field spread in
 * `doPersist`) exactly as `EPpeItem` string values, and being restored on `hydrate`.
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
    ppeDeclared: [],
    ppeNote: null,
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
    jsaSteps: [],
    workers: [],
    photos: [],
    latestSafetyReading: null,
    ...overrides
  }
}

describe('useWizard — PPE payload (wayfinder 097)', () => {
  beforeEach((): void => {
    vi.useFakeTimers()
  })

  afterEach((): void => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('sends the declared items as exact EPpeItem strings on the first CREATE', async () => {
    const createSpy = vi.spyOn(PermitProvider.prototype, 'create')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)
    vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)

    const wizard = useWizard(makeSteps())
    wizard.updateFormData({
      ...creatableDraft(),
      ppeDeclared: [EPpeItem.HARDHAT, EPpeItem.SAFETY_GLASSES],
      ppeNote: 'Confined space entry crew'
    })
    await vi.advanceTimersByTimeAsync(1600)

    expect(createSpy).toHaveBeenCalled()
    const body = createSpy.mock.calls[0][0] as unknown as Record<string, unknown>
    expect(body.ppeDeclared).toEqual(['Hardhat', 'Safety Glasses'])
    expect(body.ppeNote).toBe('Confined space entry crew')
  })

  it('sends the declared items as exact EPpeItem strings on a later PATCH', async () => {
    vi.spyOn(PermitProvider.prototype, 'create')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)
    const updateSpy = vi.spyOn(PermitProvider.prototype, 'update')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)

    const wizard = useWizard(makeSteps())
    wizard.updateFormData(creatableDraft())
    await vi.advanceTimersByTimeAsync(1600) // POST /permits

    wizard.updateFormData({ ppeDeclared: [EPpeItem.GLOVES, EPpeItem.PROTECTIVE_BOOTS], ppeNote: 'Wet surfaces today' })
    await vi.advanceTimersByTimeAsync(1600) // PATCH /permits/:id

    expect(updateSpy).toHaveBeenCalled()
    const body = updateSpy.mock.calls.at(-1)?.[1] as Record<string, unknown>
    expect(body.ppeDeclared).toEqual(['Gloves', 'Protective Boots'])
    expect(body.ppeNote).toBe('Wet surfaces today')
  })

  it('restores ppeDeclared/ppeNote from a fetched draft into formData on hydrate', () => {
    vi.spyOn(PermitProvider.prototype, 'create')
      .mockResolvedValue({ message: 'success', data: { id: 'WP-TEST-1' } } as never)

    const wizard = useWizard()
    wizard.hydrate(hydratedPermit({
      ppeDeclared: [EPpeItem.EARMUFFS, EPpeItem.CONSTRUCTION_VEST],
      ppeNote: 'Noisy area — hearing protection mandatory'
    }))

    expect(wizard.formData.value.ppeDeclared).toEqual(['Earmuffs', 'Construction Vest'])
    expect(wizard.formData.value.ppeNote).toBe('Noisy area — hearing protection mandatory')
  })

  it('restores an empty declaration/no note as [] / undefined, never a stray truthy default', () => {
    const wizard = useWizard()
    wizard.hydrate(hydratedPermit({ ppeDeclared: [], ppeNote: null }))

    expect(wizard.formData.value.ppeDeclared).toEqual([])
    expect(wizard.formData.value.ppeNote).toBeUndefined()
  })
})
