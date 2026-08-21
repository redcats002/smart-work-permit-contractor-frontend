import type { VueWrapper } from '@vue/test-utils'
import type { Router } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import PermitProvider from '@/resources/provider/permit/Permit.provider'
import PermitDetailPage from '@/pages/permit/pages/detail/pages/PermitDetailPage.vue'
import FireMonitorPanel from '@/pages/permit/pages/detail/components/FireMonitorPanel.vue'
import { FIRE_WATCH_DURATION_MINUTES, formatCountdown } from '@/pages/permit/pages/detail/composables/useFireWatch'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IPermitFireWatch } from '@/models/modules/permit/Permit.model'
import type {
  IPermitDetail, TGetPermitAuditResponse, TGetPermitDetailResponse, TMarkPermitCompleteResponse
} from '@/models/response/permit/PermitRes.model'

vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

const PERMIT_ID = 'WP-HOT-20260810-001'

function buildPermit (overrides: Partial<IPermitDetail> = {}): IPermitDetail {
  return {
    id: PERMIT_ID,
    type: 'hot' as TPermitType,
    status: 'ACTIVE' as TPermitStatus,
    title: 'Weld the pipe rack',
    foreman: 'Somchai P.',
    location: 'Zone A',
    workDate: '2026-08-10T00:00:00.000Z',
    workTimeStart: '2026-08-10T01:00:00.000Z',
    workTimeEnd: '2026-08-10T10:00:00.000Z',
    outdoorWork: false,
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
    jsaSteps: [],
    workers: [],
    photos: [],
    latestSafetyReading: null,
    ...overrides
  }
}

function fireWatch (remainingSeconds: number, startedAt: string = '2026-08-10T09:00:00.000Z'): IPermitFireWatch {
  return {
    startedAt,
    elapsedSeconds: FIRE_WATCH_DURATION_MINUTES * 60 - remainingSeconds,
    remainingSeconds,
    elapsed: remainingSeconds <= 0
  }
}

function detailResponse (permit: IPermitDetail): TGetPermitDetailResponse {
  return { message: 'success', data: permit }
}

function auditResponse (): TGetPermitAuditResponse {
  return { message: 'success', data: [] }
}

function buildRouter (): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/permits', name: 'PermitListPage', component: { template: '<div />' } },
      { path: '/permits/create', name: 'PermitCreatePage', component: { template: '<div />' } },
      { path: '/permits/:id', name: 'PermitDetailPage', component: PermitDetailPage }
    ]
  })
}

async function mountPage (): Promise<VueWrapper> {
  const router = buildRouter()
  await router.push(`/permits/${PERMIT_ID}`)
  await router.isReady()

  const wrapper = mount(PermitDetailPage, {
    global: {
      plugins: [i18n, router, [PrimeVue, { unstyled: true }]],
      stubs: { teleport: true }
    }
  })
  await flushPromises()
  await flushPromises()
  return wrapper
}

/**
 * PMT-012 — mark-complete plus the Fire Watch countdown.
 *
 * The GPS-tagged-photo verification the design walks after the countdown is NOT built: no endpoint
 * models it. Per the item's stated default the countdown alone unlocks closure — see progress.md.
 */
describe('Fire Watch (PMT-012)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setLocale('en')
    vi.spyOn(PermitProvider.prototype, 'audit').mockResolvedValue(auditResponse())
    vi.spyOn(PermitProvider.prototype, 'qr').mockResolvedValue({ message: 'success', data: { token: 'tok' } })
  })

  afterEach(() => {
    setLocale('th')
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('formats the countdown as zero-padded MM:SS and clamps at zero', () => {
    expect(formatCountdown(30 * 60 * 1000)).toBe('30:00')
    expect(formatCountdown(7 * 60 * 1000 + 31_000)).toBe('07:31')
    expect(formatCountdown(-5000)).toBe('00:00')
  })

  it('offers mark-complete on an ACTIVE hot-work permit, and the closure strip on a non-hot one', async () => {
    vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(buildPermit({ type: 'hot' })))
    const hot = await mountPage()
    expect(hot.find('[data-test="banner-activeHot"]').exists()).toBe(true)
    expect(hot.find('[data-test="start-mark-complete"]').exists()).toBe(true)
    expect(hot.find('[data-test="start-closure"]').exists()).toBe(false)

    vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(buildPermit({ type: 'confined' })))
    const confined = await mountPage()
    expect(confined.find('[data-test="start-closure"]').exists()).toBe(true)
    expect(confined.find('[data-test="start-mark-complete"]').exists()).toBe(false)
  })

  it('states the countdown is server-side and cannot be bypassed, then POSTs mark-complete', async () => {
    vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(buildPermit()))
    const monitoring = buildPermit({ status: 'FIRE_MONITOR', fireMonitorStartedAt: '2026-08-10T09:00:00.000Z', fireWatch: fireWatch(1800) })
    const markSpy = vi.spyOn(PermitProvider.prototype, 'markComplete')
      .mockResolvedValue({ message: 'success', data: monitoring } as TMarkPermitCompleteResponse)

    const wrapper = await mountPage()
    await wrapper.find('[data-test="start-mark-complete"]').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('server-side')
    expect(wrapper.text()).toContain('cannot be bypassed')

    await wrapper.find('[data-test="mark-complete-confirm"]').trigger('click')
    await flushPromises()

    expect(markSpy).toHaveBeenCalledWith(PERMIT_ID)
    expect(wrapper.find('[data-test="fire-monitor-panel"]').exists()).toBe(true)
  })

  it('locks the close button while the server says the watch is running', () => {
    const wrapper = mount(FireMonitorPanel, {
      props: { fireWatch: fireWatch(451) },
      global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] }
    })

    expect(wrapper.find('[data-test="fire-monitor-countdown"]').text()).toBe('07:31')
    expect(wrapper.find('[data-test="fire-monitor-locked"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="fire-monitor-locked"]').text()).toContain('07:31')
    expect(wrapper.find('[data-test="fire-monitor-close"]').exists()).toBe(false)
  })

  it('unlocks closure at zero and hands off to the closure modal', async () => {
    const wrapper = mount(FireMonitorPanel, {
      props: { fireWatch: fireWatch(0) },
      global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] }
    })

    expect(wrapper.find('[data-test="fire-monitor-countdown"]').text()).toBe('00:00')
    expect(wrapper.find('[data-test="fire-monitor-locked"]').exists()).toBe(false)

    await wrapper.find('[data-test="fire-monitor-close"]').trigger('click')
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('derives the countdown from the server, not from mount time — remounting does not reset it', async () => {
    // Same server payload, two independent mounts a simulated 10 minutes apart. A client-start
    // timestamp would show 30:00 both times; anchoring on the server remainder does not.
    const started = '2026-08-10T09:00:00.000Z'
    const first = mount(FireMonitorPanel, {
      props: { fireWatch: fireWatch(1800, started) },
      global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] }
    })
    expect(first.find('[data-test="fire-monitor-countdown"]').text()).toBe('30:00')

    const second = mount(FireMonitorPanel, {
      props: { fireWatch: fireWatch(1200, started) },
      global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] }
    })
    await flushPromises()
    expect(second.find('[data-test="fire-monitor-countdown"]').text()).toBe('20:00')
  })
})
