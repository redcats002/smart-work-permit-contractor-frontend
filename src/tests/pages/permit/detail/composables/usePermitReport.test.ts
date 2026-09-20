import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import usePermitReport, { type IEntrantAuditEvent, type IUsePermitReport } from '@/pages/permit/pages/detail/composables/usePermitReport'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IPermitAuditEntry } from '@/models/modules/permit/Permit.model'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'

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

/**
 * `WORKER_MARKED_NOT_AVAILABLE` was silently dropped from the report tab's `entrantEvents` — the
 * filter only ever allowed `ENTRANT_CHECKED_IN`/`ENTRANT_CHECKED_OUT`, even though the backend
 * writes this action correctly (`record-entrant-not-available.ts`, `payload.note` carrying the
 * absence reason) and it already renders fine in the generic audit Log tab
 * (`PermitAuditTimeline.test.ts`, 2026-09-12 owner-filed issue 1). This is the report-tab half of
 * that same gap.
 */
describe('usePermitReport — entrantEvents includes WORKER_MARKED_NOT_AVAILABLE', () => {
  it('surfaces a not-available entry with its direction and absence reason from payload.note', () => {
    const permit = ref(buildPermit())
    const audit = ref<IPermitAuditEntry[]>([
      buildAuditEntry('WORKER_MARKED_NOT_AVAILABLE', {
        createdAt: '2026-08-10T03:00:00.000Z',
        payload: { workerId: 42, workerName: 'Anurak K.', note: 'Called in sick', source: 'manual' }
      })
    ])

    const { entrantEvents }: IUsePermitReport = usePermitReport(PERMIT_ID, permit, audit)

    expect(entrantEvents.value).toHaveLength(1)
    const event: IEntrantAuditEvent = entrantEvents.value[0]
    expect(event.direction).toBe('NOT_AVAILABLE')
    expect(event.workerId).toBe(42)
    expect(event.workerName).toBe('Anurak K.')
    expect(event.reason).toBe('Called in sick')
    expect(event.closedByClosure).toBe(false)
  })

  it('reason is null when payload.note is missing or blank', () => {
    const permit = ref(buildPermit())
    const audit = ref<IPermitAuditEntry[]>([
      buildAuditEntry('WORKER_MARKED_NOT_AVAILABLE', { payload: { workerId: 1, workerName: 'Somchai P.' } })
    ])

    const { entrantEvents }: IUsePermitReport = usePermitReport(PERMIT_ID, permit, audit)

    expect(entrantEvents.value[0].reason).toBeNull()
  })

  it('still includes ENTRANT_CHECKED_IN/OUT alongside the not-available entry, sorted oldest first', () => {
    const permit = ref(buildPermit())
    const audit = ref<IPermitAuditEntry[]>([
      buildAuditEntry('ENTRANT_CHECKED_OUT', {
        id: 2,
        createdAt: '2026-08-10T05:00:00.000Z',
        payload: { workerId: 1, workerName: 'Somchai P.' }
      }),
      buildAuditEntry('WORKER_MARKED_NOT_AVAILABLE', {
        id: 1,
        createdAt: '2026-08-10T03:00:00.000Z',
        payload: { workerId: 2, workerName: 'Anurak K.', note: 'Reassigned to another site' }
      })
    ])

    const { entrantEvents }: IUsePermitReport = usePermitReport(PERMIT_ID, permit, audit)

    expect(entrantEvents.value.map((event: IEntrantAuditEvent) => event.direction)).toEqual(['NOT_AVAILABLE', 'OUT'])
  })
})
