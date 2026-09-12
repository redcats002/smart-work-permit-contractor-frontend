import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import PrimeVue from 'primevue/config'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import i18n, { setLocale } from '@/plugins/I18n.plugin'
import EntrantProvider from '@/resources/provider/entrant/Entrant.provider'
import GasLogProvider from '@/resources/provider/gas-log/GasLog.provider'
import InspectorVisitProvider from '@/resources/provider/inspector-visit/InspectorVisit.provider'
import PermitReportSection from '@/pages/permit/pages/detail/components/PermitReportSection.vue'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IPermitAuditEntry } from '@/models/modules/permit/Permit.model'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import type { TGetEntrantListResponse } from '@/models/response/entrant/EntrantRes.model'
import type { IGetGasLogListResponse } from '@/models/response/gas-log/GasLogRes.model'
import type { TGetInspectorVisitListResponse } from '@/models/response/inspector-visit/InspectorVisitRes.model'

const PERMIT_ID = 'WP-CONF-20260810-001'

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

async function mountReport (permit: IPermitDetail, audit: IPermitAuditEntry[]): Promise<VueWrapper> {
  const wrapper = mount(PermitReportSection, {
    props: { permit, audit },
    global: { plugins: [i18n, [PrimeVue, { unstyled: true }]] }
  })
  await flushPromises()
  return wrapper
}

describe('PermitReportSection (wayfinder 112)', () => {
  beforeEach(() => {
    setLocale('en')
  })

  afterEach(() => {
    setLocale('th')
    vi.restoreAllMocks()
  })

  it('renders a visit — who/when, PPE (new shape), notes and gas readings correlated to the visit window', async () => {
    vi.spyOn(InspectorVisitProvider.prototype, 'list').mockResolvedValue(visitListResponse([{
      id: 1,
      permitId: PERMIT_ID,
      inspectorId: 'u-insp',
      inspector: { id: 'u-insp', email: 'insp@example.com', firstName: 'Wichai', lastName: 'T.' },
      startedAt: '2026-08-10T04:00:00.000Z',
      submittedAt: '2026-08-10T05:00:00.000Z',
      source: 'scan',
      ppeChecklist: { worn: [{ item: 'Hardhat', worn: true }], undeclaredGaps: [], note: 'All clear' },
      notes: [{ id: 1, noteType: 'CORRECTIVE_ACTION', text: 'Tighten the scaffold clamp', createdById: 'u-insp', createdAt: '2026-08-10T04:30:00.000Z' }],
      photos: [],
      createdAt: '2026-08-10T04:00:00.000Z'
    }]))
    vi.spyOn(EntrantProvider.prototype, 'list').mockResolvedValue(entrantsResponse([]))
    vi.spyOn(GasLogProvider.prototype, 'list').mockResolvedValue(gasLogResponse([{
      id: 1,
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

    const wrapper = await mountReport(buildPermit(), [])

    expect(wrapper.find('[data-test="report-visit-1"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Wichai T.')
    expect(wrapper.text()).toContain('Tighten the scaffold clamp')
    expect(wrapper.find('[data-test="report-visit-1"] [data-test="report-visit-ppe-new"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="report-visit-1"] [data-test="report-visit-gas"]').exists()).toBe(true)
  })

  it('renders a legacy-shape PPE checklist without crashing, as "recorded on an earlier checklist"', async () => {
    vi.spyOn(InspectorVisitProvider.prototype, 'list').mockResolvedValue(visitListResponse([{
      id: 2,
      permitId: PERMIT_ID,
      inspectorId: 'u-insp',
      inspector: null,
      startedAt: '2026-08-10T04:00:00.000Z',
      submittedAt: '2026-08-10T05:00:00.000Z',
      source: null,
      ppeChecklist: { helmet: true, safetyBoots: false, gloves: true, eyeProtection: true },
      notes: [],
      photos: [],
      createdAt: '2026-08-10T04:00:00.000Z'
    }]))
    vi.spyOn(EntrantProvider.prototype, 'list').mockResolvedValue(entrantsResponse([]))
    vi.spyOn(GasLogProvider.prototype, 'list').mockResolvedValue(gasLogResponse([], false))

    const wrapper = await mountReport(buildPermit(), [])

    const legacy = wrapper.find('[data-test="report-visit-2"] [data-test="report-visit-ppe-legacy"]')
    expect(legacy.exists()).toBe(true)
    expect(legacy.text()).toContain('Recorded on an earlier checklist')
    expect(legacy.text()).toContain('helmet')
  })

  it('renders the gap list from realistic fixtures — a no-visit day and an overdue reading', async () => {
    vi.spyOn(InspectorVisitProvider.prototype, 'list').mockResolvedValue(visitListResponse([{
      id: 3,
      permitId: PERMIT_ID,
      inspectorId: 'u-insp',
      inspector: null,
      startedAt: '2026-08-10T04:00:00.000Z',
      submittedAt: '2026-08-10T05:00:00.000Z',
      source: 'scan',
      ppeChecklist: null,
      notes: [],
      photos: [],
      createdAt: '2026-08-10T04:00:00.000Z'
    }]))
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
      recordedAt: '2026-08-10T04:00:00.000Z',
      createdAt: '2026-08-10T04:00:00.000Z',
      dueAt: '2026-08-10T06:00:00.000Z'
    }], true))

    // Permit window 2026-08-10..2026-08-11 Bangkok, closed the evening of the 11th — the 11th has
    // no visit, and the sole gas reading's dueAt (2026-08-10T06:00Z) is long past with nothing after it.
    const wrapper = await mountReport(buildPermit({ status: 'CLOSED', closedAt: '2026-08-11T15:00:00.000Z' }), [])

    expect(wrapper.find('[data-test="report-gap-no-visit"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('2026-08-11')
    expect(wrapper.find('[data-test="report-gap-overdue-reading"]').exists()).toBe(true)
  })

  it('renders the closure summary only once the permit is CLOSED', async () => {
    vi.spyOn(InspectorVisitProvider.prototype, 'list').mockResolvedValue(visitListResponse([]))
    vi.spyOn(EntrantProvider.prototype, 'list').mockResolvedValue(entrantsResponse([]))
    vi.spyOn(GasLogProvider.prototype, 'list').mockResolvedValue(gasLogResponse([], false))

    const active = await mountReport(buildPermit({ status: 'ACTIVE' }), [])
    expect(active.find('[data-test="report-closure-section"]').exists()).toBe(false)

    const audit = [buildAuditEntry('PERMIT_CLOSED', { payload: { reason: 'Work complete, area cold' } }),
      buildAuditEntry('ENTRANT_CHECKED_OUT', {
        id: 2,
        payload: { workerId: 5, workerName: 'Somchai W.', source: 'system', closedPermit: true },
        createdAt: '2026-08-11T14:55:00.000Z'
      })]

    const closed = await mountReport(buildPermit({
      status: 'CLOSED',
      closedAt: '2026-08-11T15:00:00.000Z',
      closedBy: { id: 'u-9', email: 'jp@example.com', firstName: 'Pornchai', lastName: 'S.' }
    }), audit)

    const section = closed.find('[data-test="report-closure-section"]')
    expect(section.exists()).toBe(true)
    expect(section.text()).toContain('Work complete, area cold')
    expect(section.text()).toContain('Pornchai S.')
    expect(section.text()).toContain('Somchai W.')
  })

  it('the Print button calls window.print()', async () => {
    vi.spyOn(InspectorVisitProvider.prototype, 'list').mockResolvedValue(visitListResponse([]))
    vi.spyOn(EntrantProvider.prototype, 'list').mockResolvedValue(entrantsResponse([]))
    vi.spyOn(GasLogProvider.prototype, 'list').mockResolvedValue(gasLogResponse([], false))
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})

    const wrapper = await mountReport(buildPermit(), [])

    await wrapper.find('[data-test="report-print"]').trigger('click')

    expect(printSpy).toHaveBeenCalledTimes(1)
  })

  it('degrades gracefully — an individual fetch failure never crashes the report', async () => {
    vi.spyOn(InspectorVisitProvider.prototype, 'list').mockRejectedValue({ code: 500, message: 'boom' })
    vi.spyOn(EntrantProvider.prototype, 'list').mockResolvedValue(entrantsResponse([]))
    vi.spyOn(GasLogProvider.prototype, 'list').mockResolvedValue(gasLogResponse([], false))

    const wrapper = await mountReport(buildPermit(), [])

    expect(wrapper.find('[data-test="report-visits-empty"]').exists()).toBe(true)
  })
})
