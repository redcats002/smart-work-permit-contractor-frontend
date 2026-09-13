import type { VueWrapper } from '@vue/test-utils'
import { DOMWrapper, flushPromises, mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import EntrantProvider from '@/resources/provider/entrant/Entrant.provider'
import GasLogProvider from '@/resources/provider/gas-log/GasLog.provider'
import InspectorVisitProvider from '@/resources/provider/inspector-visit/InspectorVisit.provider'
import UserProvider from '@/resources/provider/user/User.provider'
import PermitPrintLayout from '@/pages/permit/pages/detail/components/PermitPrintLayout.vue'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IPermitAuditEntry } from '@/models/modules/permit/Permit.model'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import type { TGetEntrantListResponse } from '@/models/response/entrant/EntrantRes.model'
import type { IGetGasLogListResponse } from '@/models/response/gas-log/GasLogRes.model'
import type { TGetInspectorVisitListResponse } from '@/models/response/inspector-visit/InspectorVisitRes.model'

const PERMIT_ID = 'WP-CONF-20260810-001'

/**
 * 2026-09-12 owner-filed issue 2 — the full-permit print/export (PermitPrintLayout.vue). Mirrors
 * PermitReportSection.test.ts's fixture/mocking shape (same providers, same wire fixtures) since
 * this component fetches through the exact same `usePermitReport` composable.
 */
function buildPermit (overrides: Partial<IPermitDetail> = {}): IPermitDetail {
  return {
    id: PERMIT_ID,
    type: 'confined' as TPermitType,
    status: 'ACTIVE' as TPermitStatus,
    title: 'Tank inspection',
    foreman: 'Somchai P.',
    location: 'Zone B — Tank 4',
    startDate: '2026-08-10',
    endDate: '2026-08-11',
    dailyStart: '1970-01-01T01:00:00.000Z',
    dailyEnd: '1970-01-01T10:00:00.000Z',
    scheduleNote: null,
    outdoorWork: false,
    ppeDeclared: [],
    ppeNote: null,
    createdById: 'u-1',
    createdBy: { id: 'u-1', email: 'somchai@example.com', firstName: 'Somchai', lastName: 'P.' },
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
    preWorkChecklist: [{ itemKey: 'confined-1', answer: 'yes' }, { itemKey: 'confined-2', answer: 'no' }],
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
    createdAt: '2026-08-10T02:00:00.000Z',
    ...overrides
  }
}

function visitListResponse (data: TGetInspectorVisitListResponse['data']): TGetInspectorVisitListResponse {
  return { message: 'success', data, page: 1, limit: 9999, count: data.length, totalPage: 1 }
}

function entrantsResponse (data: TGetEntrantListResponse['data']): TGetEntrantListResponse {
  return { message: 'success', data }
}

function gasLogResponse (data: IGetGasLogListResponse['data'], overdue: boolean): IGetGasLogListResponse {
  return { message: 'success', data, overdue }
}

async function mountLayout (permit: IPermitDetail, audit: IPermitAuditEntry[]): Promise<VueWrapper> {
  const wrapper = mount(PermitPrintLayout, {
    props: { permit, audit },
    global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] }
  })
  await flushPromises()
  return wrapper
}

/**
 * 2026-09-13 owner-filed task — official per-type printed permit forms. The print trigger now
 * opens a `Menu` (Volt's PrimeVue wrapper) instead of printing directly. PrimeVue's popup `Menu`
 * teleports its item list straight onto the real `document.body` (verified: it is NOT inside
 * `wrapper`'s own DOM tree at all), so menu items are found/clicked via a `DOMWrapper` over
 * `document.body` rather than `wrapper.find()`. Item labels are the SAME bilingual "ไทย /
 * English" composite string regardless of active locale (see `permit.detail.print.menu.*`), so
 * matching by the English half is stable under both `setLocale('en')` and `'th'`.
 */
async function clickPrintMenuItem (wrapper: VueWrapper, labelSubstring: string): Promise<void> {
  await wrapper.find('[data-test="print-trigger"]').trigger('click')
  const body = new DOMWrapper(document.body)
  const items = body.findAll('[data-pc-section="itemlink"]')
  const target = items.find((item: DOMWrapper<Element>): boolean => item.text().includes(labelSubstring))
  if (!target) throw new Error(`print menu item containing "${labelSubstring}" not found`)
  await target.trigger('click')
  await flushPromises()
}

describe('PermitPrintLayout (2026-09-12 owner-filed issue 2)', () => {
  beforeEach(() => {
    setLocale('en')
    // jsdom has no `document.fonts` — `usePrint.onPrint()` awaits `document.fonts.ready` before it
    // ever reaches the (also here-inert, see below) `window.print()` call.
    Object.defineProperty(document, 'fonts', { value: { ready: Promise.resolve() }, configurable: true })
    vi.spyOn(InspectorVisitProvider.prototype, 'list').mockResolvedValue(visitListResponse([]))
    vi.spyOn(EntrantProvider.prototype, 'list').mockResolvedValue(entrantsResponse([]))
    vi.spyOn(GasLogProvider.prototype, 'list').mockResolvedValue(gasLogResponse([{
      id: 10,
      permitId: PERMIT_ID,
      lel: 0,
      o2: 20.9,
      co: 0,
      so2: null,
      tester: 'Wichai T.',
      recordedById: 'u-insp',
      recordedAt: '2026-08-10T04:15:00.000Z',
      createdAt: '2026-08-10T04:15:00.000Z',
      dueAt: '2026-08-10T06:15:00.000Z'
    }], false))
  })

  afterEach(() => {
    setLocale('th')
    vi.restoreAllMocks()
  })

  it('renders nothing printable until the trigger is clicked — no duplicate hidden DOM by default', async () => {
    const wrapper = await mountLayout(buildPermit(), [])
    expect(wrapper.find('[data-test="print-root"]').exists()).toBe(false)
  })

  it('assembles every section from live data once triggered: header, pre-work checklist, entrants, gas log, visits and audit', async () => {
    const audit = [
      buildAuditEntry('ENTRANT_CHECKED_IN', { id: 1, payload: { workerId: 5, workerName: 'Somchai W.' } }),
      buildAuditEntry('PERMIT_APPROVED', { id: 2, createdAt: '2026-08-10T03:00:00.000Z' })
    ]
    const wrapper = await mountLayout(buildPermit(), audit)

    await clickPrintMenuItem(wrapper, 'Full report')

    const root = wrapper.find('[data-test="print-root"]')
    expect(root.exists()).toBe(true)

    // Header — permit id/type, dynamic, cannot come from the (static) @page margin boxes.
    expect(root.text()).toContain(PERMIT_ID)
    expect(root.text()).toContain('e-safework')

    // Pre-work checklist — the two answered rows, with a Yes/No label, not the raw wire answer.
    const preWork = root.find('[data-test="print-section-pre-work"]')
    expect(preWork.text()).toContain('Yes')
    expect(preWork.text()).toContain('No')

    // Entrant register — derived from the audit trail, confined-space only.
    const entrants = root.find('[data-test="print-section-entrants"]')
    expect(entrants.exists()).toBe(true)
    expect(entrants.text()).toContain('Somchai W.')

    // Gas log — from usePermitReport's own fetch, confined-space only.
    const gasLog = root.find('[data-test="print-section-gas-log"]')
    expect(gasLog.exists()).toBe(true)
    expect(gasLog.text()).toContain('Wichai T.')

    // Approval/closure and audit sections are always present.
    expect(root.find('[data-test="print-section-approval"]').exists()).toBe(true)
    expect(root.find('[data-test="print-section-audit"]').text()).toContain('Permit approved')
  })

  it('omits the entrant/gas-log sections for a non-confined-space permit type', async () => {
    const wrapper = await mountLayout(buildPermit({ type: 'hot' as TPermitType }), [])

    await clickPrintMenuItem(wrapper, 'Full report')

    const root = wrapper.find('[data-test="print-root"]')
    expect(root.find('[data-test="print-section-entrants"]').exists()).toBe(false)
    expect(root.find('[data-test="print-section-gas-log"]').exists()).toBe(false)
  })

  /**
   * 2026-09-13 owner-filed task — official per-type printed permit forms. The menu's second
   * option, and the existing full-report option must both stay independently available/mutually
   * exclusive in the DOM (never both mounted from one click).
   */
  it('mounts the official permit form (not the full report) when that menu option is chosen, and vice versa', async () => {
    vi.spyOn(UserProvider.prototype, 'me').mockResolvedValue({
      message: 'success',
      data: {
        id: 'u-1',
        email: 'somchai@example.com',
        firstName: 'Somchai',
        lastName: 'P.',
        phoneNumberPrefix: null,
        phoneNumber: null,
        phoneNumberExtend: null,
        permitRole: 'contractor',
        active: true,
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
        contractorProfile: { firmName: 'Acme Fabrication Co.', taxId: null, address: null, contactPerson: null, contractStart: null, contractEnd: null }
      }
    })

    const wrapper = await mountLayout(buildPermit({ type: 'hot' as TPermitType }), [])

    await clickPrintMenuItem(wrapper, 'Official permit form')

    expect(wrapper.find('[data-test="official-form-root"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="print-root"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="official-form-root"]').text()).toContain('Acme Fabrication Co.')
  })
})
