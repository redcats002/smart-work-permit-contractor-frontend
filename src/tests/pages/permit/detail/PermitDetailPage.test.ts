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
import type { IPermitAuditEntry } from '@/models/modules/permit/Permit.model'
import type {
  IPermitDetail, TGetPermitAuditResponse, TGetPermitDetailResponse, TGetPermitQrResponse
} from '@/models/response/permit/PermitRes.model'

vi.mock('@/plugins/toast', () => ({
  toast: { success: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() }
}))

const PERMIT_ID = 'WP-HOT-20260810-001'

function buildPermit (overrides: Partial<IPermitDetail> = {}): IPermitDetail {
  return {
    id: PERMIT_ID,
    type: 'hot' as TPermitType,
    status: 'DRAFT' as TPermitStatus,
    title: 'Weld the pipe rack',
    foreman: 'Somchai P.',
    location: 'Zone A — Pipe rack 3',
    startDate: '2026-08-10T00:00:00.000Z',
    endDate: '2026-08-10T00:00:00.000Z',
    dailyStart: '2026-08-10T01:00:00.000Z',
    dailyEnd: '2026-08-10T10:00:00.000Z',
    scheduleNote: null,
    latitude: null,
    longitude: null,
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

function buildAuditEntry (action: string, overrides: Partial<IPermitAuditEntry> = {}): IPermitAuditEntry {
  return {
    id: 1,
    permitId: PERMIT_ID,
    actorId: 'u-9',
    actor: { id: 'u-9', email: 'jp@example.com', firstName: 'Pornchai', lastName: 'S.' },
    action,
    hash: 'abc',
    prevHash: null,
    createdAt: '2026-08-09T02:00:00.000Z',
    ...overrides
  }
}

function detailResponse (permit: IPermitDetail): TGetPermitDetailResponse {
  return { message: 'success', data: permit }
}

function auditResponse (entries: IPermitAuditEntry[]): TGetPermitAuditResponse {
  return { message: 'success', data: entries }
}

function qrResponse (token: string): TGetPermitQrResponse {
  return { message: 'success', data: { token } }
}

function buildRouter (): Router {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/permits', name: 'PermitListPage', component: { template: '<div />' } },
      { path: '/permits/create', name: 'PermitCreatePage', component: { template: '<div />' } },
      { path: '/getting-started', name: 'GettingStartedPage', component: { template: '<div />' } },
      { path: '/permits/:id/edit', name: 'PermitEditPage', component: { template: '<div />' } },
      { path: '/permits/:id/duplicate', name: 'PermitDuplicatePage', component: { template: '<div />' } },
      { path: '/permits/:id', name: 'PermitDetailPage', component: PermitDetailPage }
    ]
  })
}

async function mountPage (path: string = `/permits/${PERMIT_ID}`): Promise<VueWrapper> {
  const router = buildRouter()
  await router.push(path)
  await router.isReady()

  const wrapper = mount(PermitDetailPage, {
    global: {
      plugins: [i18n, router, [PrimeVue, { unstyled: true }]]
    }
  })
  await flushPromises()
  return wrapper
}

/**
 * PMT-010 — the real detail screen. This file replaced the placeholder-contract tests that used to
 * pin "fetches nothing"; that case is now inverted, and it is the assertion that proves the screen
 * is wired to the API rather than to a stub.
 */
describe('PermitDetailPage (PMT-010)', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setLocale('en')
  })

  afterEach(() => {
    setLocale('th')
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('fetches the permit and its audit trail, and renders the permit id and info card', async () => {
    const detailSpy = vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(buildPermit()))
    const auditSpy = vi.spyOn(PermitProvider.prototype, 'audit')
      .mockResolvedValue(auditResponse([buildAuditEntry('PERMIT_SUBMITTED')]))

    const wrapper = await mountPage()

    expect(detailSpy).toHaveBeenCalledWith(PERMIT_ID)
    expect(auditSpy).toHaveBeenCalledWith(PERMIT_ID)
    // wayfinder 113 — the sections are tabbed now; this assertion is what keeps the test below
    // from passing vacuously whether or not tabs exist at all.
    expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
    expect(wrapper.text()).toContain(PERMIT_ID)
    expect(wrapper.text()).toContain('Weld the pipe rack')
    expect(wrapper.text()).toContain('Zone A — Pipe rack 3')
    expect(wrapper.text()).toContain('Somchai P.')
  })

  it('renders the DRAFT banner with a working "Edit Permit" CTA to the resume route (PMT-014)', async () => {
    vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(buildPermit({ status: 'DRAFT' })))
    vi.spyOn(PermitProvider.prototype, 'audit').mockResolvedValue(auditResponse([]))

    const wrapper = await mountPage()

    const banner = wrapper.find('[data-test="banner-draft"]')
    expect(banner.exists()).toBe(true)
    expect(banner.text()).toContain('Draft Permit')
    const action = banner.find('button')
    expect(action.attributes('disabled')).toBeUndefined()
    expect(action.text()).toContain('Edit Permit')
  })

  it('gates a PENDING permit\'s edit action behind a warning shown BEFORE the resume route opens (wayfinder 012)', async () => {
    vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(buildPermit({ status: 'PENDING' })))
    vi.spyOn(PermitProvider.prototype, 'audit').mockResolvedValue(auditResponse([]))

    const router = buildRouter()
    await router.push(`/permits/${PERMIT_ID}`)
    await router.isReady()

    const wrapper = mount(PermitDetailPage, {
      global: {
        plugins: [i18n, router, [PrimeVue, { unstyled: true }]],
        // PrimeVue's Dialog teleports its container to <body>; stubbing Teleport keeps the modal
        // body inside the wrapper so it can be queried at all.
        stubs: { teleport: true }
      }
    })
    await flushPromises()

    const banner = wrapper.find('[data-test="banner-pending"]')
    expect(banner.exists()).toBe(true)
    expect(banner.text()).toContain('Pending Review')

    // Clicking the banner's edit action must NOT navigate yet — the warning has to land first.
    await banner.find('button').trigger('click')
    expect(router.currentRoute.value.name).toBe('PermitDetailPage')
    expect(wrapper.find('[data-test="pending-edit-warning-body"]').text())
      .toContain('withdraws it from review')

    // Cancelling stays put.
    await wrapper.find('[data-test="pending-edit-cancel"]').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('PermitDetailPage')

    // Re-open and confirm — only now does the resume route open.
    await wrapper.find('[data-test="banner-pending"] button').trigger('click')
    await wrapper.find('[data-test="pending-edit-confirm"]').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.name).toBe('PermitEditPage')
    expect(router.currentRoute.value.params.id).toBe(PERMIT_ID)
  })

  it('renders the REJECTED banner with the reason and the rejecting officer from the audit trail', async () => {
    vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(buildPermit({
      status: 'REJECTED',
      rejectedReason: 'Gas reading missing for the confined area',
      rejectedAt: '2026-08-09T03:00:00.000Z'
    })))
    vi.spyOn(PermitProvider.prototype, 'audit').mockResolvedValue(auditResponse([buildAuditEntry('PERMIT_REJECTED')]))

    const wrapper = await mountPage()

    // Reachable with zero interaction — the rejection reason lives in the status banner, above
    // the tab strip, never behind a click.
    expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
    const banner = wrapper.find('[data-test="banner-rejected"]')
    expect(banner.exists()).toBe(true)
    expect(banner.text()).toContain('Gas reading missing for the confined area')
    expect(banner.text()).toContain('Pornchai S.')
    expect(banner.text()).toContain('Immutable')
    const action = banner.find('button')
    expect(action.attributes('disabled')).toBeUndefined()
    expect(action.text()).toContain('Duplicate & Edit')
  })

  it('shows the just-submitted success banner only when the ?submitted=1 hint is present', async () => {
    vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(buildPermit({ status: 'PENDING' })))
    vi.spyOn(PermitProvider.prototype, 'audit').mockResolvedValue(auditResponse([]))

    const plain = await mountPage()
    expect(plain.find('[data-test="banner-submitted"]').exists()).toBe(false)

    const submitted = await mountPage(`/permits/${PERMIT_ID}?submitted=1`)
    expect(submitted.find('[data-test="banner-submitted"]').exists()).toBe(true)
    expect(submitted.text()).toContain('Permit submitted successfully')
  })

  it('renders the ACTIVE and CLOSED banners off the wire status', async () => {
    vi.spyOn(PermitProvider.prototype, 'audit').mockResolvedValue(auditResponse([]))
    vi.spyOn(PermitProvider.prototype, 'qr').mockResolvedValue(qrResponse('tok'))

    // Confined / heights get the green ACTIVE strip; Hot Work gets the orange one (PMT-012).
    vi.spyOn(PermitProvider.prototype, 'detail')
      .mockResolvedValue(detailResponse(buildPermit({ status: 'ACTIVE', type: 'confined' })))
    const active = await mountPage()
    expect(active.find('[data-test="banner-active"]').exists()).toBe(true)

    vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(buildPermit({
      status: 'CLOSED',
      closedAt: '2026-08-10T11:00:00.000Z'
    })))
    const closed = await mountPage()
    expect(closed.find('[data-test="banner-closed"]').exists()).toBe(true)
  })

  it('requests a QR token only for ACTIVE / FIRE_MONITOR and renders the QR panel', async () => {
    vi.spyOn(PermitProvider.prototype, 'audit').mockResolvedValue(auditResponse([]))
    const qrSpy = vi.spyOn(PermitProvider.prototype, 'qr').mockResolvedValue(qrResponse('signed-token'))

    vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(buildPermit({ status: 'DRAFT' })))
    const draft = await mountPage()
    // GET /permits/:id/qr answers 403 PERMIT_NOT_ACTIVE for a draft — asking would be a guaranteed error.
    expect(qrSpy).not.toHaveBeenCalled()
    expect(draft.find('[data-test="qr-pending"]').exists()).toBe(true)
    expect(draft.find('[data-test="qr-code"]').exists()).toBe(false)

    vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(buildPermit({ status: 'ACTIVE' })))
    const active = await mountPage()
    expect(qrSpy).toHaveBeenCalledWith(PERMIT_ID)
    expect(active.find('[data-test="qr-code"]').exists()).toBe(true)
    expect(active.find('[data-test="qr-code"] svg rect').exists()).toBe(true)
    expect(active.text()).toContain('Linked to live permit status')
  })

  it('renders the audit timeline read-only — no edit or delete affordance anywhere', async () => {
    vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(buildPermit({ status: 'CLOSED' })))
    vi.spyOn(PermitProvider.prototype, 'audit').mockResolvedValue(auditResponse([
      buildAuditEntry('PERMIT_SUBMITTED', { id: 1 }),
      buildAuditEntry('PERMIT_APPROVED', { id: 2 }),
      buildAuditEntry('PERMIT_CLOSED', { id: 3 })
    ]))

    const wrapper = await mountPage()

    // wayfinder 113 — the audit trail is the LAST of the six tabs. This assertion is only
    // meaningful because the strip below proves tabs exist at all: on a lazily-mounted primitive
    // (the dead src/components/base/BaseTabWindow.vue) this would find nothing until the audit
    // tab is clicked, and the count assertion would fail rather than pass vacuously.
    expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
    expect(wrapper.findAll('ol li')).toHaveLength(3)
    expect(wrapper.text()).toContain('Permit approved')
    expect(wrapper.text()).toContain('append-only')

    const controls = wrapper.findAll('button, a')
      .map((node: { text: () => string }): string => node.text().toLowerCase())
    expect(controls.some((label: string): boolean => label.includes('edit') || label.includes('delete'))).toBe(false)
  })

  it('pins a close-request notice above the tabs, reachable with zero interaction, when Safety has not acted yet (wayfinder 113 / ruling 11)', async () => {
    vi.spyOn(PermitProvider.prototype, 'audit').mockResolvedValue(auditResponse([]))
    vi.spyOn(PermitProvider.prototype, 'qr').mockResolvedValue(qrResponse('tok'))
    vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(buildPermit({
      status: 'ACTIVE',
      closeRequestedAt: '2026-08-10T05:00:00.000Z',
      closeRequestedRole: 'inspector',
      closeRequestReason: 'Work finished early, area is cold'
    })))

    const wrapper = await mountPage()

    const strip = wrapper.find('[data-test="urgent-close-requested"]')
    expect(strip.exists()).toBe(true)
    expect(strip.text()).toContain('the inspector')
    expect(strip.text()).toContain('Work finished early, area is cold')
    // Above the tabs, not inside a panel — no tab click needed to see it.
    expect(wrapper.find('[role="tablist"]').exists()).toBe(true)
  })

  it('renders no close-request strip at all — not merely a hidden one — when nothing is awaiting Safety', async () => {
    vi.spyOn(PermitProvider.prototype, 'audit').mockResolvedValue(auditResponse([]))
    vi.spyOn(PermitProvider.prototype, 'qr').mockResolvedValue(qrResponse('tok'))
    vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(buildPermit({ status: 'ACTIVE' })))

    const wrapper = await mountPage()

    expect(wrapper.find('[data-test="urgent-close-requested"]').exists()).toBe(false)
  })

  it('drops the close-request notice once the permit is actually CLOSED — the flag is never cleared, so the gate is the status', async () => {
    vi.spyOn(PermitProvider.prototype, 'audit').mockResolvedValue(auditResponse([]))
    vi.spyOn(PermitProvider.prototype, 'detail').mockResolvedValue(detailResponse(buildPermit({
      status: 'CLOSED',
      closedAt: '2026-08-10T06:00:00.000Z',
      closeRequestedAt: '2026-08-10T05:00:00.000Z',
      closeRequestedRole: 'contractor'
    })))

    const wrapper = await mountPage()

    expect(wrapper.find('[data-test="urgent-close-requested"]').exists()).toBe(false)
  })

  it('never renders the backend message on a failed load — the localized string is shown instead', async () => {
    vi.spyOn(PermitProvider.prototype, 'detail').mockRejectedValue({
      code: 403,
      message: 'Forbidden: permit belongs to another contractor',
      errorCode: 'FORBIDDEN_ROLE'
    })
    const auditSpy = vi.spyOn(PermitProvider.prototype, 'audit')

    const wrapper = await mountPage()

    expect(wrapper.find('[data-test="detail-error"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('Forbidden: permit belongs to another contractor')
    expect(wrapper.text()).toContain('This permit is not available')
    // The audit call is only made once the permit itself resolved — a failed detail short-circuits it.
    expect(auditSpy).not.toHaveBeenCalled()
  })
})
