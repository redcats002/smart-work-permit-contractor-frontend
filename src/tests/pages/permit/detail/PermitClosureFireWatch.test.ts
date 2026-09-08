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
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IPermitFireWatch } from '@/models/modules/permit/Permit.model'
import type {
  IPermitDetail, TGetPermitAuditResponse, TGetPermitDetailResponse, TGetPermitQrResponse
} from '@/models/response/permit/PermitRes.model'

vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

const PERMIT_ID = 'WP-HOT-20260810-001'
const FIRE_WATCH_SELECTOR = '[data-test="closure-fire-watch"]'

function buildPermit (overrides: Partial<IPermitDetail> = {}): IPermitDetail {
  return {
    id: PERMIT_ID,
    type: 'hot' as TPermitType,
    status: 'DRAFT' as TPermitStatus,
    title: 'Weld the pipe rack',
    foreman: 'Somchai P.',
    location: 'Zone A — Pipe rack 3',
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
    planId: null,
    planX: null,
    planY: null,
    areaId: null,
    jsaSteps: [],
    workers: [],
    photos: [],
    latestSafetyReading: null,
    ...overrides
  }
}

function fireWatch (overrides: Partial<IPermitFireWatch> = {}): IPermitFireWatch {
  return {
    startedAt: '2026-08-10T09:00:00.000Z',
    elapsedSeconds: 600,
    remainingSeconds: 1200,
    elapsed: false,
    ...overrides
  }
}

function detailResponse (permit: IPermitDetail): TGetPermitDetailResponse {
  return { message: 'success', data: permit }
}

function auditResponse (): TGetPermitAuditResponse {
  return { message: 'success', data: [] }
}

function qrResponse (): TGetPermitQrResponse {
  return { message: 'success', data: { token: 'tok' } }
}

function buildRouter (): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/permits', name: 'PermitListPage', component: { template: '<div />' } },
      { path: '/permits/create', name: 'PermitCreatePage', component: { template: '<div />' } },
      { path: '/permits/:id/edit', name: 'PermitEditPage', component: { template: '<div />' } },
      { path: '/permits/:id/duplicate', name: 'PermitDuplicatePage', component: { template: '<div />' } },
      { path: '/permits/:id', name: 'PermitDetailPage', component: PermitDetailPage }
    ]
  })
}

async function mountPage (permit: IPermitDetail): Promise<VueWrapper> {
  vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(permit))
  vi.spyOn(PermitProvider.prototype, 'audit').mockResolvedValue(auditResponse())
  vi.spyOn(PermitProvider.prototype, 'qr').mockResolvedValue(qrResponse())

  const router = buildRouter()
  await router.push(`/permits/${PERMIT_ID}`)
  await router.isReady()

  const wrapper = mount(PermitDetailPage, {
    global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
  })
  await flushPromises()
  return wrapper
}

/** §5's heading as it is actually rendered by `PermitDetailSection`. */
function closureHeading (wrapper: VueWrapper): string {
  return wrapper.find('[data-test="section-closure"] h2').text()
}

/**
 * wayfinder ticket 047 — Fire Watch is a hot-work-only leg of the status machine (`FIRE_MONITOR`
 * is unreachable for `confined`/`heights`), so §5 renders no Fire Watch block at all on the other
 * two types, and its heading drops the "& Fire Watch" half with it.
 *
 * Presence/absence is asserted per permit type on purpose: an always-empty region sitting beside
 * the Close action is what the field report objected to, and a later refactor must not quietly
 * restore it.
 */
describe('PermitDetailPage §5 Fire Watch gating (wayfinder 047)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setLocale('en')
  })

  afterEach(() => {
    setLocale('th')
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('renders no Fire Watch block and drops "& Fire Watch" from the heading for a heights permit', async () => {
    const wrapper = await mountPage(buildPermit({ type: 'heights', status: 'ACTIVE' }))

    expect(wrapper.find(FIRE_WATCH_SELECTOR).exists()).toBe(false)
    expect(wrapper.text()).not.toContain('No Fire Watch has been started')
    expect(closureHeading(wrapper)).toContain('5. Closure')
    expect(closureHeading(wrapper)).not.toContain('Fire Watch')
  })

  it('renders no Fire Watch block and drops "& Fire Watch" from the heading for a confined-space permit', async () => {
    const wrapper = await mountPage(buildPermit({ type: 'confined', status: 'ACTIVE' }))

    expect(wrapper.find(FIRE_WATCH_SELECTOR).exists()).toBe(false)
    expect(wrapper.text()).not.toContain('No Fire Watch has been started')
    expect(closureHeading(wrapper)).toContain('5. Closure')
    expect(closureHeading(wrapper)).not.toContain('Fire Watch')
  })

  it('keeps the empty Fire Watch state on a hot-work permit that has not started one yet', async () => {
    const wrapper = await mountPage(buildPermit({ type: 'hot', status: 'ACTIVE' }))

    const block = wrapper.find(FIRE_WATCH_SELECTOR)
    expect(block.exists()).toBe(true)
    expect(block.text()).toContain('No Fire Watch has been started')
    expect(closureHeading(wrapper)).toContain('5. Closure & Fire Watch')
  })

  it('keeps the running Fire Watch countdown on a hot-work permit in FIRE_MONITOR', async () => {
    const wrapper = await mountPage(buildPermit({
      type: 'hot',
      status: 'FIRE_MONITOR',
      fireMonitorStartedAt: '2026-08-10T09:00:00.000Z',
      fireWatch: fireWatch()
    }))

    const block = wrapper.find(FIRE_WATCH_SELECTOR)
    expect(block.exists()).toBe(true)
    expect(block.text()).toContain('Fire Watch started')
    expect(block.text()).not.toContain('No Fire Watch has been started')
  })

  it('keeps the elapsed Fire Watch result on a closed hot-work permit', async () => {
    const wrapper = await mountPage(buildPermit({
      type: 'hot',
      status: 'CLOSED',
      closedAt: '2026-08-10T10:00:00.000Z',
      fireMonitorStartedAt: '2026-08-10T09:00:00.000Z',
      fireWatch: fireWatch({ elapsedSeconds: 1800, remainingSeconds: 0, elapsed: true })
    }))

    const block = wrapper.find(FIRE_WATCH_SELECTOR)
    expect(block.exists()).toBe(true)
    expect(block.text()).toContain('Fire Watch complete')
  })

  it('leaves the rest of §5 intact on a non-hot permit — only the Fire Watch block is gated', async () => {
    const wrapper = await mountPage(buildPermit({ type: 'confined', status: 'ACTIVE', entrantCount: 2 }))

    expect(wrapper.find('[data-test="closure-entrants"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="closure-record"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="closure-empty"]').exists()).toBe(true)
  })
})
