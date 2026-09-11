import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import { toast } from '@/plugins/toast'
import PermitProvider from '@/resources/provider/permit/Permit.provider'
import RequestCloseModal from '@/pages/permit/pages/detail/components/RequestCloseModal.vue'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IPermitDetail, TRequestClosePermitResponse } from '@/models/response/permit/PermitRes.model'

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
    closeRequestedAt: null,
    closeRequestedBy: null,
    closeRequestedRole: null,
    closeRequestReason: null,
    jsaSteps: [],
    workers: [],
    photos: [],
    latestSafetyReading: null,
    ...overrides
  }
}

function mountModal (permit: IPermitDetail = buildPermit()): VueWrapper {
  return mount(RequestCloseModal, {
    props: { modelValue: true, permit },
    global: {
      plugins: [i18n, [PrimeVue, { unstyled: true }]],
      // PrimeVue's Dialog teleports its container to <body>; stubbing Teleport keeps the modal
      // body inside the wrapper so it can be queried at all.
      stubs: { teleport: true }
    }
  })
}

/**
 * wayfinder 098 (reopened 2026-09-11) — replaces `ClosureChecklistModal.test.ts`. The central
 * invariant carries over unchanged from that file: never pre-empt the server, never render its
 * raw `message`. What changed is the call itself — `POST /permits/:id/close-request`, never
 * `/close`, and the contractor's own reason is optional, not a gate.
 */
describe('RequestCloseModal (wayfinder 098)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setLocale('en')
  })

  afterEach(() => {
    setLocale('th')
    vi.restoreAllMocks()
  })

  it('sends reason to close-request and never touches /close', async () => {
    const requested = buildPermit('confined', {
      closeRequestedAt: '2026-08-10T05:00:00.000Z',
      closeRequestedRole: 'contractor',
      closeRequestReason: 'Work finished, area restored and cold'
    })
    const requestCloseSpy = vi.spyOn(PermitProvider.prototype, 'requestClose')
      .mockResolvedValue({ message: 'success', data: requested } as TRequestClosePermitResponse)

    const wrapper = mountModal(buildPermit('confined'))
    await flushPromises()

    await wrapper.find('textarea[name="reason"]').setValue('Work finished, area restored and cold')
    await wrapper.find('[data-test="request-close-confirm"]').trigger('click')
    await flushPromises()

    expect(requestCloseSpy).toHaveBeenCalledWith(PERMIT_ID, { reason: 'Work finished, area restored and cold' })
    // The provider has no `close()` method at all any more (Permit.provider.test.ts pins this);
    // nothing this modal does can reach `/close`.
    expect((PermitProvider.prototype as unknown as Record<string, unknown>).close).toBeUndefined()
    expect(wrapper.emitted('requested')?.[0]?.[0]).toEqual(requested)
    expect(toast.success).toHaveBeenCalledWith(i18n.global.t('permit.toast.closeRequested'))
  })

  it('submits with no reason at all — the field is optional, never a gate', async () => {
    const requested = buildPermit('heights', { closeRequestedAt: '2026-08-10T05:00:00.000Z', closeRequestedRole: 'contractor' })
    const requestCloseSpy = vi.spyOn(PermitProvider.prototype, 'requestClose')
      .mockResolvedValue({ message: 'success', data: requested } as TRequestClosePermitResponse)

    const wrapper = mountModal(buildPermit('heights'))
    await flushPromises()
    await wrapper.find('[data-test="request-close-confirm"]').trigger('click')
    await flushPromises()

    expect(requestCloseSpy).toHaveBeenCalledWith(PERMIT_ID, { reason: undefined })
  })

  it('pre-fills the existing reason and offers "Update Request" once a request is already awaiting Safety', async () => {
    const wrapper = mountModal(buildPermit('confined', {
      closeRequestedAt: '2026-08-10T05:00:00.000Z',
      closeRequestedRole: 'contractor',
      closeRequestReason: 'Work finished early'
    }))
    await flushPromises()

    expect(wrapper.find('[data-test="request-close-already"]').exists()).toBe(true)
    expect((wrapper.find('textarea[name="reason"]').element as HTMLTextAreaElement).value).toBe('Work finished early')
    expect(wrapper.find('[data-test="request-close-confirm"]').text()).toContain('Update Request')
  })

  it('renders PERMIT_NOT_ACTIVE as a localized block banner — never the backend message', async () => {
    vi.spyOn(PermitProvider.prototype, 'requestClose').mockRejectedValue({
      code: 403,
      message: 'A closure request can only be raised for an ACTIVE or FIRE_MONITOR permit',
      errorCode: 'PERMIT_NOT_ACTIVE'
    })

    const wrapper = mountModal(buildPermit('confined'))
    await flushPromises()
    await wrapper.find('[data-test="request-close-confirm"]').trigger('click')
    await flushPromises()

    const banner = wrapper.find('[data-test="request-close-block"]')
    expect(banner.exists()).toBe(true)
    expect(banner.text()).toContain('only available while the permit is active')
    expect(wrapper.text()).not.toContain('A closure request can only be raised')
    expect(wrapper.emitted('requested')).toBeUndefined()
  })
})
