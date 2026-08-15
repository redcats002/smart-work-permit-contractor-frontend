import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { IGetPermitListQuery } from '@/models/request/permit/PermitReq.model'
import type { IPermitDetail, IPermitListItem } from '@/models/response/permit/PermitRes.model'

/**
 * ⚠ STUB DATA — only imported by Permit.provider.ts while `USE_STUB_DATA` is true there.
 * Backend `/permits` endpoints are not deployed yet (docs/modules/permit/context.md).
 * Delete this file + the `USE_STUB_DATA` branches in Permit.provider.ts once the real
 * API is reachable — nothing else in the app imports from here.
 *
 * Source: sample permits transcribed from docs/main/SmartWorkPermit-v3.dc.html
 * `basePermits()` (~line 1797), reshaped to the IPermitListItem/IPermitDetail models.
 */
export const MOCK_PERMITS: IPermitListItem[] = [
  {
    id: 'WP-CS-20260701-041',
    type: 'confined',
    status: 'DRAFT',
    project: 'Vessel Farm Turnaround',
    title: 'Vessel V-220 Maintenance',
    foreman: 'Somchai P.',
    location: 'Process Area C · Vessel Farm',
    workDate: '2026-07-01',
    workTimeStart: '10:00',
    workTimeEnd: '16:00',
    outdoorWork: false
  },
  {
    id: 'WP-HW-20260625-014',
    type: 'hot',
    status: 'PENDING',
    project: 'Unit 300 Pipe Rack Repair',
    title: 'Welding Repair — Pipe Rack 7',
    foreman: 'Anan K.',
    location: 'Unit 300 · Pipe Rack',
    workDate: '2026-06-25',
    workTimeStart: '09:00',
    workTimeEnd: '15:00',
    outdoorWork: true
  },
  {
    id: 'WP-CS-20260625-009',
    type: 'confined',
    status: 'ACTIVE',
    project: 'Tank Farm Cleaning Program',
    title: 'Tank T-203 Internal Cleaning',
    foreman: 'Somchai P.',
    location: 'Process Area B · Tank Farm',
    workDate: '2026-06-25',
    workTimeStart: '08:00',
    workTimeEnd: '17:00',
    outdoorWork: false,
    entrantsInside: 3
  },
  {
    id: 'WP-HT-20260625-022',
    type: 'heights',
    status: 'ACTIVE',
    project: 'Warehouse Roof Maintenance',
    title: 'Roof Sheet Replacement',
    foreman: 'Wichai T.',
    location: 'Warehouse 4 · Roof',
    workDate: '2026-06-25',
    workTimeStart: '07:30',
    workTimeEnd: '16:00',
    outdoorWork: true
  },
  {
    id: 'WP-HW-20260624-031',
    type: 'hot',
    status: 'FIRE_MONITOR',
    project: 'Unit 200 Structural Repair',
    title: 'Grinding — Structural Beam',
    foreman: 'Anan K.',
    location: 'Unit 200 · Steel Structure',
    workDate: '2026-06-24',
    workTimeStart: '13:00',
    workTimeEnd: '18:00',
    outdoorWork: false
  },
  {
    id: 'WP-HT-20260623-007',
    type: 'heights',
    status: 'REJECTED',
    project: 'Yard Crane Maintenance',
    title: 'Gantry Crane Maintenance',
    foreman: 'Wichai T.',
    location: 'Yard · Gantry Crane',
    workDate: '2026-06-23',
    workTimeStart: '09:00',
    workTimeEnd: '14:00',
    outdoorWork: true
  },
  {
    id: 'WP-HW-20260601-002',
    type: 'hot',
    status: 'CLOSED',
    project: 'Pump Station A Maintenance',
    title: 'Flange Replacement · Unit 100',
    foreman: 'Anan K.',
    location: 'Unit 100 · Pump Station A',
    workDate: '2026-06-01',
    workTimeStart: '08:00',
    workTimeEnd: '12:00',
    outdoorWork: false,
    closedAt: '2026-06-01T12:45:00+07:00',
    closedBy: { id: 101, firstName: 'Preecha', lastName: 'W.' }
  },
  {
    id: 'WP-CS-20260610-005',
    type: 'confined',
    status: 'CLOSED',
    project: 'Tank Farm Cleaning Program',
    title: 'Tank T-101 Sludge Removal',
    foreman: 'Somchai P.',
    location: 'Tank Farm · T-101',
    workDate: '2026-06-10',
    workTimeStart: '07:00',
    workTimeEnd: '15:00',
    outdoorWork: false,
    closedAt: '2026-06-10T15:20:00+07:00',
    closedBy: { id: 102, firstName: 'Kittipong', lastName: 'R.' }
  },
  {
    id: 'WP-HW-20260615-010',
    type: 'hot',
    status: 'EXPIRED',
    project: 'Workshop Bay Fabrication',
    title: 'Pipe Spool Fabrication',
    foreman: 'Anan K.',
    location: 'Workshop Bay 3',
    workDate: '2026-06-15',
    workTimeStart: '08:00',
    workTimeEnd: '17:00',
    outdoorWork: false
  },
  // --- Additional CLOSED/EXPIRED rows below exist only to give the history
  // archive (HST-001..003, docs/modules/history/context.md) enough rows to
  // exercise search, type/status filters, date range and pagination — the
  // My Permits list above already covered the live-status fixtures it needs.
  {
    id: 'WP-HT-20260528-018',
    type: 'heights',
    status: 'CLOSED',
    project: 'Warehouse Roof Maintenance',
    title: 'Skylight Panel Replacement',
    foreman: 'Wichai T.',
    location: 'Warehouse 2 · Roof',
    workDate: '2026-05-28',
    workTimeStart: '08:00',
    workTimeEnd: '13:30',
    outdoorWork: true,
    closedAt: '2026-05-28T13:50:00+07:00',
    closedBy: { id: 103, firstName: 'Sunee', lastName: 'K.' }
  },
  {
    id: 'WP-CS-20260520-012',
    type: 'confined',
    status: 'EXPIRED',
    project: 'Tank Farm Cleaning Program',
    title: 'Tank T-108 Internal Inspection',
    foreman: 'Somchai P.',
    location: 'Tank Farm · T-108',
    workDate: '2026-05-20',
    workTimeStart: '07:30',
    workTimeEnd: '16:00',
    outdoorWork: false
  },
  {
    id: 'WP-HW-20260514-027',
    type: 'hot',
    status: 'CLOSED',
    project: 'Unit 300 Pipe Rack Repair',
    title: 'Cutting — Pipe Rack Support Beam',
    foreman: 'Anan K.',
    location: 'Unit 300 · Pipe Rack',
    workDate: '2026-05-14',
    workTimeStart: '09:00',
    workTimeEnd: '11:30',
    outdoorWork: true,
    closedAt: '2026-05-14T11:50:00+07:00',
    closedBy: { id: 101, firstName: 'Preecha', lastName: 'W.' }
  },
  {
    id: 'WP-HT-20260505-006',
    type: 'heights',
    status: 'EXPIRED',
    project: 'Yard Crane Maintenance',
    title: 'Gantry Rail Inspection',
    foreman: 'Wichai T.',
    location: 'Yard · Gantry Crane',
    workDate: '2026-05-05',
    workTimeStart: '08:00',
    workTimeEnd: '12:00',
    outdoorWork: true
  },
  {
    id: 'WP-CS-20260428-003',
    type: 'confined',
    status: 'CLOSED',
    project: 'Process Area C Turnaround',
    title: 'Vessel V-118 Entry Inspection',
    foreman: 'Somchai P.',
    location: 'Process Area C · Vessel Farm',
    workDate: '2026-04-28',
    workTimeStart: '07:00',
    workTimeEnd: '14:00',
    outdoorWork: false,
    closedAt: '2026-04-28T14:25:00+07:00',
    closedBy: { id: 102, firstName: 'Kittipong', lastName: 'R.' }
  },
  {
    id: 'WP-HW-20260420-019',
    type: 'hot',
    status: 'CLOSED',
    project: 'Unit 200 Structural Repair',
    title: 'Welding — Steel Structure Bracket',
    foreman: 'Anan K.',
    location: 'Unit 200 · Steel Structure',
    workDate: '2026-04-20',
    workTimeStart: '13:00',
    workTimeEnd: '17:00',
    outdoorWork: false,
    closedAt: '2026-04-20T17:15:00+07:00',
    closedBy: { id: 103, firstName: 'Sunee', lastName: 'K.' }
  },
  {
    id: 'WP-HT-20260412-014',
    type: 'heights',
    status: 'CLOSED',
    project: 'Workshop Bay Fabrication',
    title: 'Overhead Crane Beam Access',
    foreman: 'Wichai T.',
    location: 'Workshop Bay 1',
    workDate: '2026-04-12',
    workTimeStart: '08:30',
    workTimeEnd: '15:00',
    outdoorWork: false,
    closedAt: '2026-04-12T15:20:00+07:00',
    closedBy: { id: 101, firstName: 'Preecha', lastName: 'W.' }
  },
  {
    id: 'WP-HW-20260403-008',
    type: 'hot',
    status: 'EXPIRED',
    project: 'Pump Station A Maintenance',
    title: 'Brazing — Cooling Line Joint',
    foreman: 'Anan K.',
    location: 'Unit 100 · Pump Station A',
    workDate: '2026-04-03',
    workTimeStart: '09:00',
    workTimeEnd: '12:00',
    outdoorWork: false
  }
]

/** Mirrors the "Active"/"Closed" filter-chip grouping in the design (see context.md). */
function matchesStatus (item: IPermitListItem, status: TPermitStatus | TPermitStatus[]): boolean {
  const statuses = Array.isArray(status) ? status : [status]
  return statuses.includes(item.status)
}

/**
 * Matches the history module's search box — ID, title or location, case-insensitive
 * substring (see docs/modules/history/context.md § Screen anatomy).
 */
function matchesSearch (item: IPermitListItem, search: string): boolean {
  const needle = search.trim().toLowerCase()
  if (!needle) return true
  return (
    item.id.toLowerCase().includes(needle)
    || item.title.toLowerCase().includes(needle)
    || item.location.toLowerCase().includes(needle)
  )
}

/** Applies the same status/type/date/search filters + pagination a real backend would apply server-side. */
export function queryMockPermits (query: IGetPermitListQuery): { items: IPermitListItem[], count: number } {
  const filtered = MOCK_PERMITS.filter((item: IPermitListItem): boolean => {
    if (query.status && !matchesStatus(item, query.status)) return false
    if (query.type && item.type !== query.type) return false
    if (query.dateFrom && item.workDate < query.dateFrom) return false
    if (query.dateTo && item.workDate > query.dateTo) return false
    if (query.search && !matchesSearch(item, query.search)) return false
    return true
  })

  const page = query.page ?? 1
  const limit = query.limit ?? 10
  const start = (page - 1) * Number(limit)
  const items = filtered.slice(start, start + Number(limit))

  return { items, count: filtered.length }
}

export function findMockPermitDetail (id: string): IPermitDetail | undefined {
  const item = MOCK_PERMITS.find((p: IPermitListItem): boolean => p.id === id)
  if (!item) return undefined
  return {
    ...item,
    workDescription: `Stub work description for ${item.title}.`,
    jsaSteps: [],
    workers: [],
    photos: []
  }
}

/** Builds a fresh mock draft for the create/update/submit/mark-complete/close stubs. */
export function buildMockDraft (overrides: Partial<IPermitDetail> = {}): IPermitDetail {
  const base = MOCK_PERMITS[0]
  return {
    ...base,
    id: overrides.id ?? `WP-STUB-${Date.now()}`,
    status: 'DRAFT',
    workDescription: 'Stub draft — replace once the real API is reachable.',
    jsaSteps: [],
    workers: [],
    photos: [],
    ...overrides
  }
}
