import { dayjs } from '@/plugins/dayjs.plugin'
import type { IGasLogEntryWire } from '@/models/response/gas-log/GasLogRes.model'
import type { IInspectorVisitWire } from '@/models/response/inspector-visit/InspectorVisitRes.model'

/**
 * wayfinder 112 — the report's two gap types, both derived client-side from data the report
 * already fetches (no new endpoint). Every function is pure and takes `now` as a parameter rather
 * than reading the system clock internally, so both are deterministic under test.
 */

export interface INoVisitDayGap {
  /** `YYYY-MM-DD`, Asia/Bangkok calendar day. */
  date: string
}

export interface IOverdueReadingGap {
  /** The gas-log entry whose `dueAt` passed with no reading taken before it. */
  entryId: number
  dueAt: string
  /** The reading that eventually closed the gap, if any — `null` for the still-open trailing gap. */
  nextRecordedAt: string | null
}

/**
 * A pure date-only string (`startDate`/`endDate`, `YYYY-MM-DD`, no time-of-day of its own) is read
 * as Bangkok wall-clock midnight directly — same pattern as `src/utils/CertificateStatus.ts`'s
 * `bangkokCalendarDay`, so a date string is never first parsed as host-local time.
 */
function bangkokCalendarDay (value: string): dayjs.Dayjs {
  return dayjs.tz(value, 'Asia/Bangkok').startOf('day')
}

/** A real instant (full ISO timestamp, or a `Date`) converted to its Bangkok wall-clock day. */
function bangkokInstantDay (value: string | Date): dayjs.Dayjs {
  return dayjs(value).tz('Asia/Bangkok').startOf('day')
}

/**
 * "Day with no visit" — every calendar day (Asia/Bangkok) from `permit.startDate` to
 * `min(permit.endDate, permit.closedAt ?? now)`, flagged when zero visits have a `startedAt`
 * falling on that day. Never flags a future day: the upper bound is capped at `now` whenever the
 * permit is not yet closed, and a closed permit's own `closedAt` is always in the past.
 */
export function findNoVisitDays (
  startDate: string,
  endDate: string,
  closedAt: string | null,
  visits: IInspectorVisitWire[],
  now: Date
): INoVisitDayGap[] {
  const visitDays = new Set(visits.map((visit: IInspectorVisitWire): string => bangkokInstantDay(visit.startedAt).format('YYYY-MM-DD')))

  const start = bangkokCalendarDay(startDate)
  const permitEnd = bangkokCalendarDay(endDate)
  const boundary = closedAt ? bangkokInstantDay(closedAt) : bangkokInstantDay(now)
  const end = permitEnd.isBefore(boundary) ? permitEnd : boundary

  if (end.isBefore(start)) return []

  const gaps: INoVisitDayGap[] = []
  let cursor = start
  while (!cursor.isAfter(end)) {
    const date = cursor.format('YYYY-MM-DD')
    if (!visitDays.has(date)) gaps.push({ date })
    cursor = cursor.add(1, 'day')
  }
  return gaps
}

/**
 * "Overdue reading nobody took" — each gas-log entry carries its own server-computed `dueAt`
 * (`computeGasReadingStatus(entry.recordedAt).dueAt`, never recomputed here). A gap exists between
 * two entries when the later one's `recordedAt` falls after the earlier one's `dueAt`; for the
 * LAST entry (chronologically), a gap exists when its `dueAt` has already passed the permit's
 * `closedAt` (if closed) or `now`, with no reading after it.
 *
 * The api serves gas-log **newest first** (`recordedAt: 'desc'`) — sorted ascending here first so
 * "next entry" and "last entry" mean chronological order, not array order. Entries with a null
 * `dueAt` are skipped (the wire type allows it even though every live row carries one). Zero
 * entries yields zero gaps — this function never invents a "nobody ever took a reading" gap.
 */
export function findOverdueReadingGaps (
  entries: IGasLogEntryWire[],
  closedAt: string | null,
  now: Date
): IOverdueReadingGap[] {
  const sorted = entries
    .filter((entry: IGasLogEntryWire): entry is IGasLogEntryWire & { dueAt: string } => Boolean(entry.dueAt))
    .slice()
    .sort((a: IGasLogEntryWire, b: IGasLogEntryWire): number => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime())

  const boundary = closedAt ? new Date(closedAt).getTime() : now.getTime()
  const gaps: IOverdueReadingGap[] = []

  sorted.forEach((entry: IGasLogEntryWire & { dueAt: string }, index: number): void => {
    const dueAtMs = new Date(entry.dueAt).getTime()
    const next = sorted[index + 1]

    if (next) {
      if (new Date(next.recordedAt).getTime() > dueAtMs) {
        gaps.push({ entryId: entry.id, dueAt: entry.dueAt, nextRecordedAt: next.recordedAt })
      }
      return
    }

    if (dueAtMs < boundary) {
      gaps.push({ entryId: entry.id, dueAt: entry.dueAt, nextRecordedAt: null })
    }
  })

  return gaps
}
