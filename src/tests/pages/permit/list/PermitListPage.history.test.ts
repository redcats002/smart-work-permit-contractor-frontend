import type { VueWrapper } from '@vue/test-utils'
import type { Router } from 'vue-router'
import { flushPromises, mount, type DOMWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import PrimeVue from 'primevue/config'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import { downloadCsv } from '@/utils/Csv'
import PermitProvider from '@/resources/provider/permit/Permit.provider'
import PermitListPage from '@/pages/permit/pages/list/pages/PermitListPage.vue'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { IPermitListItem } from '@/models/response/permit/PermitRes.model'
import type { TGetPermitListResponse } from '@/models/response/permit/PermitRes.model'

vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

// `downloadCsv` builds a Blob and clicks an <a download>, neither of which jsdom can complete.
// Stubbing only that export keeps the real `toCsv` serializer in the loop, so the assertion below
// inspects the actual file body the user would have received.
vi.mock('@/utils/Csv', async (importOriginal: () => Promise<Record<string, unknown>>) => ({
  ...(await importOriginal()),
  downloadCsv: vi.fn()
}))

// Paginate.vue reads window.matchMedia, which jsdom does not implement.
function mockMatchMedia (): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn()
    }))
  })
}

function buildPermit (id: string, status: TPermitStatus): IPermitListItem {
  return {
    id,
    type: 'hot',
    status,
    title: `Permit ${id}`,
    foreman: 'Somchai',
    location: 'Zone A',
    startDate: '2026-08-10T00:00:00.000Z',
    endDate: '2026-08-10T00:00:00.000Z',
    dailyStart: '1970-01-01T08:00:00.000Z',
    dailyEnd: '1970-01-01T17:00:00.000Z',
    scheduleNote: null,
    latitude: null,
    longitude: null,
    outdoorWork: false,
    createdById: 'u-1',
    createdBy: null,
    createdAt: '2026-08-10T01:00:00.000Z',
    updatedAt: '2026-08-10T01:00:00.000Z',
    submittedAt: null,
    approvedById: null,
    approvedBy: null,
    approvedAt: null,
    rejectedReason: null,
    rejectedAt: null,
    closedById: null,
    closedBy: null,
    closedAt: status === 'CLOSED' ? '2026-08-10T10:00:00.000Z' : null,
    fireMonitorStartedAt: null,
    qrIssuedAt: null,
    // Added to IPermitListItem when PMT-010 picked up the backend's 2026-08-21 fields
    // (docs/api/GAPS.md row A). This screen does not read them yet.
    entrantCount: 0,
    fireWatch: null,
    planId: null,
    planX: null,
    planY: null,
    areaId: null
  }
}

function paginated (rows: IPermitListItem[]): TGetPermitListResponse {
  return { message: 'success', data: rows, count: rows.length, page: 1, limit: 10, totalPage: 1 }
}

/**
 * The archive set the table shows, mixed with the live statuses the API returns when no `status`
 * is sent. `GET /permits` takes a single status (docs/api/GAPS.md row B), so "All" fetches
 * unfiltered and the client narrows — which is exactly the narrowing the CSV export used to skip.
 */
function mixedStatusPage (): IPermitListItem[] {
  return [
    buildPermit('WP-HOT-20260810-001', 'CLOSED'),
    buildPermit('WP-HOT-20260810-002', 'EXPIRED'),
    buildPermit('WP-HOT-20260810-003', 'ACTIVE'),
    buildPermit('WP-HOT-20260810-004', 'DRAFT'),
    buildPermit('WP-HOT-20260810-005', 'PENDING')
  ]
}

function buildRouter (): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/permits', name: 'PermitListPage', component: PermitListPage },
      { path: '/permits/create', name: 'PermitCreatePage', component: { template: '<div />' } },
      { path: '/permits/:id', name: 'PermitDetailPage', component: { template: '<div />' } }
    ]
  })
}

/**
 * wayfinder 110 — "History" was cut as its own route; this is the "History" view mode on
 * `PermitListPage` now, reached the same way the old `/history` deep link redirects (a
 * `?view=history` query param — see `History.router.ts`).
 */
async function mountPage (): Promise<VueWrapper> {
  const router = buildRouter()
  await router.push('/permits?view=history')
  await router.isReady()

  const wrapper = mount(PermitListPage, {
    global: {
      plugins: [i18n, router, [PrimeVue, { unstyled: true }]]
    }
  })
  await flushPromises()
  return wrapper
}

/** The one control in the History tab's toolbar — "Export CSV". */
async function clickExport (wrapper: VueWrapper): Promise<void> {
  const button = wrapper.findAll('button').find((candidate: DOMWrapper<HTMLButtonElement>): boolean => candidate.text().includes('Export CSV'))
  expect(button).toBeDefined()
  await button?.trigger('click')
  await flushPromises()
}

describe('PermitListPage — History view mode (wayfinder 110, was HistoryListPage HST-002/HST-003)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setLocale('en')
    mockMatchMedia()
  })

  afterEach(() => {
    setLocale('th')
    localStorage.clear()
    vi.mocked(downloadCsv).mockClear()
    vi.restoreAllMocks()
  })

  it('opens on the History tab when the route carries ?view=history', async () => {
    vi.spyOn(PermitProvider.prototype, 'list').mockResolvedValue(paginated([]))

    const wrapper = await mountPage()

    const permitsTab = wrapper.findAll('button').find((candidate: DOMWrapper<HTMLButtonElement>): boolean => candidate.text() === 'Permits')
    const historyTab = wrapper.findAll('button').find((candidate: DOMWrapper<HTMLButtonElement>): boolean => candidate.text() === 'History')
    expect(historyTab?.classes()).toContain('text-text-primary')
    expect(permitsTab?.classes()).not.toContain('text-text-primary')
  })

  it('renders only the archive statuses when the status filter is "All"', async () => {
    vi.spyOn(PermitProvider.prototype, 'list').mockResolvedValue(paginated(mixedStatusPage()))

    const wrapper = await mountPage()

    expect(wrapper.text()).toContain('WP-HOT-20260810-001')
    expect(wrapper.text()).toContain('WP-HOT-20260810-002')
    expect(wrapper.text()).not.toContain('WP-HOT-20260810-003')
    expect(wrapper.text()).not.toContain('WP-HOT-20260810-004')
    expect(wrapper.text()).not.toContain('WP-HOT-20260810-005')
  })

  // CT-HISTORY-009 step 5, and PRE-RUN-FINDINGS.md finding 5. The export re-queries every page
  // (limit 9999) rather than exporting the visible page — but it must still run the result
  // through the same archive narrowing the table applies, or the user downloads rows the screen
  // deliberately hid.
  it('exports exactly the rows the table shows — never a status the table hid (CT-HISTORY-009)', async () => {
    vi.spyOn(PermitProvider.prototype, 'list').mockResolvedValue(paginated(mixedStatusPage()))

    const wrapper = await mountPage()
    await clickExport(wrapper)

    expect(downloadCsv).toHaveBeenCalledOnce()
    const [filename, csv] = vi.mocked(downloadCsv).mock.calls[0] as [string, string]

    expect(filename).toMatch(/^history-\d{8}-\d{6}\.csv$/)
    expect(csv).toContain('WP-HOT-20260810-001')
    expect(csv).toContain('WP-HOT-20260810-002')
    expect(csv).not.toContain('WP-HOT-20260810-003')
    expect(csv).not.toContain('WP-HOT-20260810-004')
    expect(csv).not.toContain('WP-HOT-20260810-005')
    // Header row + the two archive rows the table showed, and nothing else.
    expect(csv.split('\r\n')).toHaveLength(3)
  })

  it('exports every page of the filtered set, not just the visible one', async () => {
    const listSpy = vi.spyOn(PermitProvider.prototype, 'list').mockResolvedValue(paginated(mixedStatusPage()))

    const wrapper = await mountPage()
    listSpy.mockClear()
    await clickExport(wrapper)

    expect(listSpy).toHaveBeenCalledWith(expect.objectContaining({ page: 1, limit: 9999 }))
  })

  it('shows the empty state when nothing in the page survives the archive narrowing', async () => {
    vi.spyOn(PermitProvider.prototype, 'list')
      .mockResolvedValue(paginated([buildPermit('WP-HOT-20260810-003', 'ACTIVE')]))

    const wrapper = await mountPage()

    expect(wrapper.text()).toContain('No permits match your filters')
  })

  it('surfaces localized copy — never the backend message — when the fetch fails', async () => {
    const { toast } = await import('@/plugins/toast')
    const backendMessage = 'Permit is not in a closable state'
    vi.spyOn(PermitProvider.prototype, 'list')
      .mockRejectedValue({ code: 403, errorCode: 'PERMIT_NOT_CLOSABLE', message: backendMessage })

    await mountPage()

    expect(toast.error).toHaveBeenCalledWith('This permit cannot be closed in its current state.')
    expect(toast.error).not.toHaveBeenCalledWith(backendMessage)
  })
})
