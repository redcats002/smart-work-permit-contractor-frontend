import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import { toast } from '@/plugins/toast'
import PermitProvider from '@/resources/provider/permit/Permit.provider'
import ClosureChecklistModal from '@/pages/permit/pages/detail/components/ClosureChecklistModal.vue'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IPermitDetail, TClosePermitResponse } from '@/models/response/permit/PermitRes.model'

vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

const PERMIT_ID = 'WP-CONF-20260810-002'

function buildPermit (type: TPermitType = 'confined', overrides: Partial<IPermitDetail> = {}): IPermitDetail {
  return {
    id: PERMIT_ID,
    type,
    status: 'ACTIVE' as TPermitStatus,
    title: 'Clean tank T-102',
    foreman: 'Somchai P.',
    location: 'Tank farm',
    startDate: '2026-08-10T00:00:00.000Z',
    endDate: '2026-08-10T00:00:00.000Z',
    dailyStart: '2026-08-10T01:00:00.000Z',
    dailyEnd: '2026-08-10T10:00:00.000Z',
    scheduleNote: null,
    outdoorWork: false,
    ppeDeclared: [],
    ppeNote: null,
    createdById: 'u-1',
    createdBy: null,
    createdAt: '2026-08-09T01:00:00.000Z',
    updatedAt: '2026-08-09T01:00:00.000Z',
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

function mountModal (permit: IPermitDetail = buildPermit(), fireWatchRemaining: string = ''): VueWrapper {
  return mount(ClosureChecklistModal, {
    props: { modelValue: true, permit, fireWatchRemaining },
    global: {
      plugins: [i18n, [PrimeVue, { unstyled: true }]],
      // PrimeVue's Dialog teleports its container to <body>; stubbing Teleport keeps the modal
      // body inside the wrapper so it can be queried at all.
      stubs: { teleport: true }
    }
  })
}

/** Answers every checklist row "yes" and taps the signature pad. */
async function completeChecklist (wrapper: VueWrapper): Promise<void> {
  // The Dialog body is only in the DOM after the first flush — without this the query below
  // finds nothing and every later step silently no-ops.
  await flushPromises()
  const yesButtons = wrapper.findAll('[data-test^="closure-yes-"]')
  for (const button of yesButtons) await button.trigger('click')
  await flushPromises()
  await wrapper.find('[data-test="closure-signature"] button').trigger('click')
  await flushPromises()
}

/**
 * PMT-011 — the closure checklist modal. Its central invariant: the client NEVER pre-empts the
 * backend. Every confirm attempts POST /permits/:id/close and renders the verdict that comes back,
 * localized off `errorCode` — the backend's own `message` never reaches the DOM.
 */
describe('ClosureChecklistModal (PMT-011)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setLocale('en')
  })

  afterEach(() => {
    setLocale('th')
    vi.restoreAllMocks()
  })

  it('renders the checklist for the permit type and keeps Confirm disabled until every row is answered', async () => {
    const wrapper = mountModal(buildPermit('confined'))
    await flushPromises()

    // Confined Space has five rows (design lines 588-596).
    expect(wrapper.findAll('[data-test^="closure-yes-"]')).toHaveLength(5)
    expect(wrapper.find('[data-test="closure-confirm"]').attributes('disabled')).toBeDefined()

    await wrapper.find('[data-test="closure-yes-entrantsExited"]').trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-test="closure-confirm"]').attributes('disabled')).toBeDefined()
  })

  it('reveals the e-signature pad only once the checklist is complete and stamps a timestamp', async () => {
    const wrapper = mountModal(buildPermit('heights'))
    await flushPromises()

    expect(wrapper.find('[data-test="closure-signature"]').exists()).toBe(false)

    for (const button of wrapper.findAll('[data-test^="closure-yes-"]')) await button.trigger('click')
    await flushPromises()

    const pad = wrapper.find('[data-test="closure-signature"]')
    expect(pad.exists()).toBe(true)
    // Signing is still required — a complete checklist alone does not enable Confirm.
    expect(wrapper.find('[data-test="closure-confirm"]').attributes('disabled')).toBeDefined()

    await pad.find('button').trigger('click')
    await flushPromises()
    expect(pad.text()).toContain('Somchai P.')
    expect(wrapper.find('[data-test="closure-confirm"]').attributes('disabled')).toBeUndefined()
  })

  it('always attempts POST /permits/:id/close and emits the closed permit on success', async () => {
    const closed = buildPermit('confined', { status: 'CLOSED', closedAt: '2026-08-10T11:00:00.000Z' })
    const closeSpy = vi.spyOn(PermitProvider.prototype, 'close')
      .mockResolvedValue({ message: 'success', data: closed } as TClosePermitResponse)

    const wrapper = mountModal(buildPermit('confined'))
    await completeChecklist(wrapper)
    await wrapper.find('[data-test="closure-confirm"]').trigger('click')
    await flushPromises()

    expect(closeSpy).toHaveBeenCalledTimes(1)
    const [id, payload] = closeSpy.mock.calls[0]
    expect(id).toBe(PERMIT_ID)
    expect(payload.checklist.entrantsExited).toBe('yes')
    expect(payload.signature).toContain('Somchai P.')
    expect(wrapper.emitted('closed')?.[0]?.[0]).toEqual(closed)
  })

  it('toasts a success confirmation on close — wayfinder ticket 008', async () => {
    const closed = buildPermit('confined', { status: 'CLOSED', closedAt: '2026-08-10T11:00:00.000Z' })
    vi.spyOn(PermitProvider.prototype, 'close')
      .mockResolvedValue({ message: 'success', data: closed } as TClosePermitResponse)

    const wrapper = mountModal(buildPermit('confined'))
    await completeChecklist(wrapper)
    await wrapper.find('[data-test="closure-confirm"]').trigger('click')
    await flushPromises()

    expect(toast.success).toHaveBeenCalledWith(i18n.global.t('permit.toast.closed'))
  })

  it('renders ENTRANTS_STILL_INSIDE as a localized block banner — never the backend message', async () => {
    vi.spyOn(PermitProvider.prototype, 'close').mockRejectedValue({
      code: 403,
      message: 'Cannot close: 2 entrant(s) still checked in (Anan, Wichai)',
      errorCode: 'ENTRANTS_STILL_INSIDE'
    })

    // The COUNT comes from the payload's server-computed `entrantCount`, not from parsing the
    // backend's English message (docs/api/GAPS.md row A, closed 2026-08-21).
    const wrapper = mountModal(buildPermit('confined', { entrantCount: 2 }))
    await completeChecklist(wrapper)
    await wrapper.find('[data-test="closure-confirm"]').trigger('click')
    await flushPromises()

    const banner = wrapper.find('[data-test="closure-block"]')
    expect(banner.exists()).toBe(true)
    expect(banner.text()).toContain('2 entrant(s) still inside')
    expect(banner.text()).toContain('Inspector app')
    expect(wrapper.text()).not.toContain('Cannot close: 2 entrant(s) still checked in')
  })

  it('renders FIRE_WATCH_NOT_ELAPSED with the remaining time', async () => {
    vi.spyOn(PermitProvider.prototype, 'close').mockRejectedValue({
      code: 403,
      message: 'Fire Watch countdown has not yet elapsed',
      errorCode: 'FIRE_WATCH_NOT_ELAPSED'
    })

    const wrapper = mountModal(buildPermit('hot', { status: 'FIRE_MONITOR' }), '07:31')
    await completeChecklist(wrapper)
    await wrapper.find('[data-test="closure-confirm"]').trigger('click')
    await flushPromises()

    const banner = wrapper.find('[data-test="closure-block"]')
    expect(banner.text()).toContain('Fire Watch still running')
    expect(banner.text()).toContain('07:31')
    expect(wrapper.text()).not.toContain('Fire Watch countdown has not yet elapsed')
  })

  it('surfaces any other refusal instead of swallowing it — a contractor 403 is still rendered', async () => {
    vi.spyOn(PermitProvider.prototype, 'close').mockRejectedValue({
      code: 403,
      message: 'Forbidden role',
      errorCode: 'FORBIDDEN_ROLE'
    })

    const wrapper = mountModal(buildPermit('heights'))
    await completeChecklist(wrapper)
    await wrapper.find('[data-test="closure-confirm"]').trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-test="closure-block"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Forbidden role')
    expect(wrapper.emitted('closed')).toBeUndefined()
  })
})
