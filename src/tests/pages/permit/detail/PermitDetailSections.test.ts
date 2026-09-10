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
import type { TWorkerRole } from '@/enums/modules/permit/WorkerRole.enum'
import type {
  IPermitDetail, TGetPermitAuditResponse, TGetPermitDetailResponse
} from '@/models/response/permit/PermitRes.model'

vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

const PERMIT_ID = 'WP-CONF-20260810-002'

function buildPermit (overrides: Partial<IPermitDetail> = {}): IPermitDetail {
  return {
    id: PERMIT_ID,
    type: 'confined' as TPermitType,
    status: 'DRAFT' as TPermitStatus,
    title: 'Clean tank T-101',
    foreman: 'Somchai P.',
    location: 'Zone C — Tank farm',
    startDate: '2026-08-10T00:00:00.000Z',
    endDate: '2026-08-10T00:00:00.000Z',
    dailyStart: '2026-08-10T01:00:00.000Z',
    dailyEnd: '2026-08-10T10:00:00.000Z',
    scheduleNote: null,
    latitude: null,
    longitude: null,
    outdoorWork: false,
    createdById: 'u-1',
    createdBy: { id: 'u-1', email: 'foreman@example.com', firstName: 'Somchai', lastName: 'P.' },
    createdAt: '2026-08-09T01:00:00.000Z',
    updatedAt: '2026-08-09T02:00:00.000Z',
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

async function mountPage (permit: IPermitDetail): Promise<VueWrapper> {
  vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(permit))
  vi.spyOn(PermitProvider.prototype, 'audit').mockResolvedValue(auditResponse())

  const router = buildRouter()
  await router.push(`/permits/${PERMIT_ID}`)
  await router.isReady()

  const wrapper = mount(PermitDetailPage, {
    global: { plugins: [i18n, router, [PrimeVue, { unstyled: true }]] }
  })
  await flushPromises()
  return wrapper
}

/**
 * PMT-013 — the six detail sections of docs/main/dev-handoff/05-permit-detail-sections.md §2.
 * These tests pin the contract itself: the order, the empty states, and the three rules that are
 * easy to break silently (server verdict is rendered not recomputed, `so2` is never displayed,
 * a required-but-missing photo slot stays visible).
 */
describe('PermitDetailPage sections (PMT-013)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setLocale('en')
  })

  afterEach(() => {
    setLocale('th')
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('renders all six sections in contract order', async () => {
    const wrapper = await mountPage(buildPermit())

    const order = wrapper.findAll('[data-test^="section-"]')
      .map((node: { attributes: (name: string) => string | undefined }): string => node.attributes('data-test') ?? '')
      .filter((name: string): boolean => !name.endsWith('-empty'))

    expect(order).toEqual([
      'section-overview',
      'section-safety',
      'section-workers',
      'section-jsa',
      'section-closure',
      'section-audit'
    ])
  })

  it('renders an explicit empty state instead of hiding an empty section', async () => {
    const wrapper = await mountPage(buildPermit())

    expect(wrapper.find('[data-test="section-jsa-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="safety-no-reading"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="workers-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="closure-empty"]').exists()).toBe(true)
  })

  it('renders the server validation verdict localized off errorCode, never the backend message', async () => {
    const wrapper = await mountPage(buildPermit({
      latestSafetyReading: { lel: 0, o2: 24.9, co: 3, recordedAt: '2026-08-09T03:00:00.000Z' },
      validationSummary: {
        scope: 'safety_readings',
        passed: false,
        failures: [{ field: 'o2', errorCode: 'GAS_OUT_OF_RANGE', message: 'o2 24.9 outside 19.5-23.5' }]
      }
    }))

    const verdict = wrapper.find('[data-test="safety-verdict"]')
    expect(verdict.exists()).toBe(true)
    expect(verdict.text()).toContain('Server verdict: safety readings failed')
    expect(verdict.text()).toContain('A gas reading is outside the safe range')
    expect(wrapper.text()).not.toContain('o2 24.9 outside 19.5-23.5')
    // The scope is readings only — certificates are checked at submit and are not in this summary.
    expect(verdict.text()).toContain('Worker certificates are checked separately at submit')
  })

  it('never displays so2 — it is collected by the wizard but is not on the wire (GAPS row K)', async () => {
    const wrapper = await mountPage(buildPermit({
      latestSafetyReading: { lel: 0, o2: 20.9, co: 2, so2: 7, recordedAt: '2026-08-09T03:00:00.000Z' }
    }))

    expect(wrapper.find('[data-test="safety-reading-lel"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="safety-reading-co"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="safety-reading-so2"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="section-safety"]').text()).not.toContain('SO₂')
  })

  it('groups JSA steps by phase, orders them by sortOrder, and shows the per-phase count', async () => {
    const wrapper = await mountPage(buildPermit({
      jsaSteps: [
        { id: 2, phase: 'pre', step: 'Second pre step', hazard: 'Trip', control: 'Clear route', sortOrder: 2 },
        { id: 1, phase: 'pre', step: 'First pre step', hazard: 'Fall', control: 'Harness', sortOrder: 1 },
        { id: 3, phase: 'post', step: 'Restore area', hazard: 'Debris', control: 'Sweep', sortOrder: 1 }
      ]
    }))

    const pre = wrapper.find('[data-test="jsa-phase-pre"]')
    expect(pre.text()).toContain('2 step(s)')
    const steps = pre.findAll('tbody tr').map((row: { text: () => string }): string => row.text())
    expect(steps[0]).toContain('First pre step')
    expect(steps[1]).toContain('Second pre step')

    // A phase with no rows keeps its heading and shows an empty state.
    expect(wrapper.find('[data-test="jsa-phase-process-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="jsa-phase-post"]').text()).toContain('Restore area')
  })

  it('shows the Confined Space worker health badge and lists why a worker failed', async () => {
    const wrapper = await mountPage(buildPermit({
      workers: [
        { id: 1, workerId: 1, workerName: 'Anan K.', roleOnPermit: 'Entrant' as TWorkerRole, bloodPressure: '120/80', alcoholReading: '0' },
        { id: 2, workerId: 2, workerName: 'Wichai T.', roleOnPermit: 'Attendant' as TWorkerRole, bloodPressure: '170/110', alcoholReading: '0' }
      ]
    }))

    expect(wrapper.find('[data-test="worker-health-0"]').text()).toContain('Pass')
    const failed = wrapper.find('[data-test="worker-health-1"]')
    expect(failed.text()).toContain('Fail')
    expect(wrapper.find('[data-test="worker-row-1"]').text()).toContain('Blood pressure outside the safe range')
  })

  it('renders photos by slotKey and marks a required slot that was never filled', async () => {
    const wrapper = await mountPage(buildPermit({
      photos: [
        { slotKey: 'worksite', fileRef: 'permits/worksite.jpg', originalName: 'worksite.jpg' },
        { slotKey: 'instrument-lel', fileRef: 'permits/lel.jpg', originalName: 'lel.jpg' }
      ]
    }))

    expect(wrapper.find('[data-test="photo-slot-worksite"]').text()).toContain('worksite.jpg')
    // Required for Confined Space, never attached — shown as explicitly missing, not omitted.
    expect(wrapper.find('[data-test="photo-slot-entry-point"]').text()).toContain('Required — not attached')
    // An instrument photo is outside the evidence grid but is still rendered rather than dropped.
    expect(wrapper.find('[data-test="photo-slot-instrument-lel"]').exists()).toBe(true)
  })

  it('renders the stored closure checklist, the entrant count and the Fire Watch state', async () => {
    const wrapper = await mountPage(buildPermit({
      status: 'CLOSED' as TPermitStatus,
      entrantCount: 0,
      closedBy: { id: 'u-2', email: 'foreman@example.com', firstName: 'Somchai', lastName: 'P.' },
      closedAt: '2026-08-10T11:00:00.000Z',
      closureChecklist: { entrantsExited: 'yes', worksiteRestored: 'no' }
    }))

    const closure = wrapper.find('[data-test="section-closure"]')
    expect(closure.find('[data-test="closure-item-entrantsExited"]').text()).toContain('All entrants safely exited')
    expect(closure.find('[data-test="closure-item-worksiteRestored"]').text()).toContain('No')
    expect(closure.text()).toContain('Somchai P.')
    // wayfinder ticket 047 — this fixture is a CONFINED permit, which can never hold a Fire
    // Watch, so the block is absent entirely rather than showing an always-empty "none" state.
    // Presence on a hot-work permit is covered in PermitClosureFireWatch.test.ts.
    expect(closure.find('[data-test="closure-fire-watch"]').exists()).toBe(false)
    // Entrant names are not readable by a contractor (GAPS row I) — only the count is.
    expect(closure.text()).toContain('only the count is exposed')
  })

  it('renders the overview lifecycle timestamps and the outdoor-work bypass note', async () => {
    const wrapper = await mountPage(buildPermit({ outdoorWork: true, submittedAt: '2026-08-09T04:00:00.000Z' }))

    expect(wrapper.find('[data-test="overview-environment"]').text()).toContain('Outdoor')
    expect(wrapper.find('[data-test="overview-lifecycle"]').text()).toContain('Created by')
    expect(wrapper.find('[data-test="overview-lifecycle"]').text()).toContain('Somchai P.')
    expect(wrapper.find('[data-test="safety-outdoor-bypass"]').exists()).toBe(true)
  })
})
