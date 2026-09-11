import type { ComputedRef, Ref } from 'vue'
import { computed, ref } from 'vue'
import { useApiError } from '@/composables/useApiError'
import type { IPermitAuditEntry } from '@/models/modules/permit/Permit.model'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import type { IEntrantRegisterEntry } from '@/models/response/entrant/EntrantRes.model'
import type { IGasLogEntryWire } from '@/models/response/gas-log/GasLogRes.model'
import type { IInspectorVisitWire } from '@/models/response/inspector-visit/InspectorVisitRes.model'
import EntrantProvider, { type IEntrantProvider } from '@/resources/provider/entrant/Entrant.provider'
import GasLogProvider, { type IGasLogProvider } from '@/resources/provider/gas-log/GasLog.provider'
import InspectorVisitProvider, { type IInspectorVisitProvider } from '@/resources/provider/inspector-visit/InspectorVisit.provider'
import { findNoVisitDays, findOverdueReadingGaps, type INoVisitDayGap, type IOverdueReadingGap } from '@/utils/PermitReportGaps'

const InspectorVisitService: IInspectorVisitProvider = new InspectorVisitProvider()
const EntrantService: IEntrantProvider = new EntrantProvider()
const GasLogService: IGasLogProvider = new GasLogProvider()

/**
 * One entrant check-in/check-out, derived from the audit trail — NOT from `GET /:id/entrants`,
 * which answers only "who is inside right now" (`currentlyInside` below). See the ticket's own
 * finding: the entrants endpoint is a live snapshot, the audit trail is the only source for an
 * actual in/out history. `payload` is read defensively (`unknown`/optional on the wire).
 */
export interface IEntrantAuditEvent {
  workerId: number | null
  workerName: string | null
  direction: 'IN' | 'OUT'
  source: string | null
  /** `true` on the auto-checkout rows a closure writes (`payload.closedPermit === true`). */
  closedByClosure: boolean
  createdAt: string
}

export interface IUsePermitReport {
  visits: Ref<IInspectorVisitWire[]>
  /** Currently-inside workers only — `GET /permits/:id/entrants`'s own scope, never a history. */
  currentlyInside: Ref<IEntrantRegisterEntry[]>
  gasLog: Ref<IGasLogEntryWire[]>
  gasLogOverdue: Ref<boolean>
  loading: Ref<boolean>
  /** Full in/out history, oldest first, derived from the audit trail already passed in. */
  entrantEvents: ComputedRef<IEntrantAuditEvent[]>
  noVisitDays: ComputedRef<INoVisitDayGap[]>
  overdueReadingGaps: ComputedRef<IOverdueReadingGap[]>
  fetchReport (): Promise<void>
  /** Read-time association — readings whose `recordedAt` falls inside the visit's own window. */
  gasReadingsForVisit (visit: IInspectorVisitWire): IGasLogEntryWire[]
  /** Same read-time association, for entrant activity during the visit. */
  entrantEventsForVisit (visit: IInspectorVisitWire): IEntrantAuditEvent[]
}

/**
 * wayfinder 112 — the permit report's own data. `permit`/`audit` are refs the caller already
 * fetched (the page's own `usePermitDetail`) — this composable never re-fetches the permit or the
 * audit trail itself, only the three report-specific reads.
 *
 * Every fetch below is independent and degrades to an empty state on failure, the same defensive
 * shape `usePermitDetail.fetchAudit()` uses — a report tab can never blank the page it lives on.
 */
export function usePermitReport (
  permitId: string,
  permit: Ref<IPermitDetail>,
  audit: Ref<IPermitAuditEntry[]>
): IUsePermitReport {
  const { mapError } = useApiError()

  const visits = ref<IInspectorVisitWire[]>([]) as Ref<IInspectorVisitWire[]>
  const currentlyInside = ref<IEntrantRegisterEntry[]>([]) as Ref<IEntrantRegisterEntry[]>
  const gasLog = ref<IGasLogEntryWire[]>([]) as Ref<IGasLogEntryWire[]>
  const gasLogOverdue = ref(false)
  const loading = ref(false)

  const entrantEvents: ComputedRef<IEntrantAuditEvent[]> = computed((): IEntrantAuditEvent[] => audit.value
    .filter((entry: IPermitAuditEntry): boolean => entry.action === 'ENTRANT_CHECKED_IN' || entry.action === 'ENTRANT_CHECKED_OUT')
    .map((entry: IPermitAuditEntry): IEntrantAuditEvent => {
      const payload = entry.payload && typeof entry.payload === 'object' ? entry.payload as Record<string, unknown> : {}
      return {
        workerId: typeof payload.workerId === 'number' ? payload.workerId : null,
        workerName: typeof payload.workerName === 'string' ? payload.workerName : null,
        direction: entry.action === 'ENTRANT_CHECKED_IN' ? 'IN' : 'OUT',
        source: typeof payload.source === 'string' ? payload.source : null,
        closedByClosure: payload.closedPermit === true,
        createdAt: entry.createdAt
      }
    })
    .sort((a: IEntrantAuditEvent, b: IEntrantAuditEvent): number => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()))

  const noVisitDays: ComputedRef<INoVisitDayGap[]> = computed((): INoVisitDayGap[] =>
    findNoVisitDays(permit.value.startDate, permit.value.endDate, permit.value.closedAt, visits.value, new Date()))

  const overdueReadingGaps: ComputedRef<IOverdueReadingGap[]> = computed((): IOverdueReadingGap[] =>
    findOverdueReadingGaps(gasLog.value, permit.value.closedAt, new Date()))

  function gasReadingsForVisit (visit: IInspectorVisitWire): IGasLogEntryWire[] {
    const start = new Date(visit.startedAt).getTime()
    const end = visit.submittedAt ? new Date(visit.submittedAt).getTime() : Date.now()
    return gasLog.value.filter((entry: IGasLogEntryWire): boolean => {
      const at = new Date(entry.recordedAt).getTime()
      return at >= start && at <= end
    })
  }

  function entrantEventsForVisit (visit: IInspectorVisitWire): IEntrantAuditEvent[] {
    const start = new Date(visit.startedAt).getTime()
    const end = visit.submittedAt ? new Date(visit.submittedAt).getTime() : Date.now()
    return entrantEvents.value.filter((event: IEntrantAuditEvent): boolean => {
      const at = new Date(event.createdAt).getTime()
      return at >= start && at <= end
    })
  }

  async function fetchVisits (): Promise<void> {
    try {
      const response = await InspectorVisitService.list(permitId, { page: 1, limit: 9999 })
      visits.value = response.data
    } catch (error: unknown) {
      visits.value = []
      console.error('[usePermitReport] inspector-visits fetch failed', mapError(error).code)
    }
  }

  async function fetchEntrants (): Promise<void> {
    try {
      const response = await EntrantService.list(permitId)
      currentlyInside.value = response.data
    } catch (error: unknown) {
      currentlyInside.value = []
      console.error('[usePermitReport] entrants fetch failed', mapError(error).code)
    }
  }

  async function fetchGasLog (): Promise<void> {
    try {
      const response = await GasLogService.list(permitId)
      gasLog.value = response.data
      gasLogOverdue.value = response.overdue
    } catch (error: unknown) {
      gasLog.value = []
      gasLogOverdue.value = false
      console.error('[usePermitReport] gas-log fetch failed', mapError(error).code)
    }
  }

  async function fetchReport (): Promise<void> {
    loading.value = true
    try {
      await Promise.all([fetchVisits(), fetchEntrants(), fetchGasLog()])
    } finally {
      loading.value = false
    }
  }

  return {
    visits,
    currentlyInside,
    gasLog,
    gasLogOverdue,
    loading,
    entrantEvents,
    noVisitDays,
    overdueReadingGaps,
    fetchReport,
    gasReadingsForVisit,
    entrantEventsForVisit
  }
}

export default usePermitReport
