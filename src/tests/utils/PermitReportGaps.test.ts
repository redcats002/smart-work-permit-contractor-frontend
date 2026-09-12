import { describe, expect, it } from 'vitest'
import type { IGasLogEntryWire } from '@/models/response/gas-log/GasLogRes.model'
import type { IInspectorVisitWire } from '@/models/response/inspector-visit/InspectorVisitRes.model'
import { findNoVisitDays, findOverdueReadingGaps, type INoVisitDayGap } from '@/utils/PermitReportGaps'

function buildVisit (overrides: Partial<IInspectorVisitWire> = {}): IInspectorVisitWire {
  return {
    id: 1,
    permitId: 'WP-HOT-20260810-001',
    inspectorId: 'u-insp',
    inspector: null,
    startedAt: '2026-08-10T04:00:00.000Z',
    submittedAt: '2026-08-10T05:00:00.000Z',
    source: 'scan',
    ppeChecklist: null,
    notes: [],
    photos: [],
    createdAt: '2026-08-10T04:00:00.000Z',
    ...overrides
  }
}

function buildEntry (overrides: Partial<IGasLogEntryWire> = {}): IGasLogEntryWire {
  return {
    id: 1,
    permitId: 'WP-CONF-20260810-001',
    lel: 0,
    o2: 20.9,
    co: 0,
    so2: null,
    tester: 'Somchai',
    recordedById: 'u-insp',
    recordedAt: '2026-08-10T04:00:00.000Z',
    createdAt: '2026-08-10T04:00:00.000Z',
    dueAt: '2026-08-10T06:00:00.000Z',
    ...overrides
  }
}

describe('findNoVisitDays', () => {
  it('flags a calendar day (Asia/Bangkok) with zero visits inside the permit window', () => {
    // Window 2026-08-10..2026-08-12 Bangkok, one visit on the 10th only.
    // 2026-08-10T04:00Z is 2026-08-10 11:00 Bangkok; "now" is 2026-08-13 03:00 Bangkok (window fully elapsed).
    const gaps = findNoVisitDays('2026-08-10', '2026-08-12', null, [buildVisit({ startedAt: '2026-08-10T04:00:00.000Z' })], new Date('2026-08-12T20:00:00.000Z'))

    expect(gaps.map((gap: INoVisitDayGap): string => gap.date)).toEqual(['2026-08-11', '2026-08-12'])
  })

  it('does not flag a day that has a visit — negative case', () => {
    const gaps = findNoVisitDays(
      '2026-08-10', '2026-08-10', null, [buildVisit({ startedAt: '2026-08-10T04:00:00.000Z' })], new Date('2026-08-10T20:00:00.000Z')
    )

    expect(gaps).toEqual([])
  })

  it('buckets a visit into the following Bangkok day when its UTC instant crosses midnight (+7h boundary)', () => {
    // 2026-08-10T17:30:00Z is 2026-08-11 00:30 in Asia/Bangkok — the NEXT calendar day.
    const gaps = findNoVisitDays(
      '2026-08-10', '2026-08-11', null, [buildVisit({ startedAt: '2026-08-10T17:30:00.000Z' })], new Date('2026-08-11T20:00:00.000Z')
    )

    // The 10th has no visit (the 17:30Z visit belongs to the 11th) -- only the 10th is a gap.
    expect(gaps.map((gap: INoVisitDayGap): string => gap.date)).toEqual(['2026-08-10'])
  })

  it('never flags a future day — caps the window at "now" for a still-open permit', () => {
    const gaps = findNoVisitDays(
      '2026-08-10', '2026-08-20', null, [], new Date('2026-08-11T05:00:00.000Z') // 2026-08-11 12:00 Bangkok — day 2 of a 10-day window
    )

    expect(gaps.map((gap: INoVisitDayGap): string => gap.date)).toEqual(['2026-08-10', '2026-08-11'])
  })

  it('caps the window at closedAt, not "now", once the permit is closed', () => {
    // closed on day 2 (Bangkok); "now" is much later and must not be used.
    const gaps = findNoVisitDays('2026-08-10', '2026-08-20', '2026-08-11T05:00:00.000Z', [], new Date('2026-08-15T05:00:00.000Z'))

    expect(gaps.map((gap: INoVisitDayGap): string => gap.date)).toEqual(['2026-08-10', '2026-08-11'])
  })
})

describe('findOverdueReadingGaps', () => {
  it('flags a gap when the next reading arrives after the previous one\'s dueAt', () => {
    const entries = [
      buildEntry({ id: 1, recordedAt: '2026-08-10T04:00:00.000Z', dueAt: '2026-08-10T06:00:00.000Z' }),
      buildEntry({ id: 2, recordedAt: '2026-08-10T07:00:00.000Z', dueAt: '2026-08-10T09:00:00.000Z' })
    ]

    const gaps = findOverdueReadingGaps(entries, null, new Date('2026-08-10T08:00:00.000Z'))

    expect(gaps).toEqual([{ entryId: 1, dueAt: '2026-08-10T06:00:00.000Z', nextRecordedAt: '2026-08-10T07:00:00.000Z' }])
  })

  it('does not flag a gap when the next reading arrives before dueAt — negative case', () => {
    const entries = [
      buildEntry({ id: 1, recordedAt: '2026-08-10T04:00:00.000Z', dueAt: '2026-08-10T06:00:00.000Z' }),
      buildEntry({ id: 2, recordedAt: '2026-08-10T05:30:00.000Z', dueAt: '2026-08-10T07:30:00.000Z' })
    ]

    const gaps = findOverdueReadingGaps(entries, null, new Date('2026-08-10T07:00:00.000Z'))

    expect(gaps).toEqual([])
  })

  it('flags the trailing gap when the last reading\'s dueAt has already passed with nothing after it', () => {
    const entries = [buildEntry({ id: 1, recordedAt: '2026-08-10T04:00:00.000Z', dueAt: '2026-08-10T06:00:00.000Z' })]

    const gaps = findOverdueReadingGaps(entries, null, new Date('2026-08-10T07:00:00.000Z'))

    expect(gaps).toEqual([{ entryId: 1, dueAt: '2026-08-10T06:00:00.000Z', nextRecordedAt: null }])
  })

  it('does not flag the trailing gap before dueAt has passed — negative case', () => {
    const entries = [buildEntry({ id: 1, recordedAt: '2026-08-10T04:00:00.000Z', dueAt: '2026-08-10T06:00:00.000Z' })]

    const gaps = findOverdueReadingGaps(entries, null, new Date('2026-08-10T05:00:00.000Z'))

    expect(gaps).toEqual([])
  })

  it('uses closedAt rather than "now" once the permit is closed', () => {
    const entries = [buildEntry({ id: 1, recordedAt: '2026-08-10T04:00:00.000Z', dueAt: '2026-08-10T06:00:00.000Z' })]

    // closedAt is before dueAt -> no gap, even though "now" is well past dueAt.
    const gaps = findOverdueReadingGaps(entries, '2026-08-10T05:00:00.000Z', new Date('2026-08-15T00:00:00.000Z'))

    expect(gaps).toEqual([])
  })

  it('sorts entries by recordedAt ascending before comparing — the api serves them newest-first', () => {
    // Passed in DESCENDING order, as the api actually serves them.
    const entries = [
      buildEntry({ id: 2, recordedAt: '2026-08-10T07:00:00.000Z', dueAt: '2026-08-10T09:00:00.000Z' }),
      buildEntry({ id: 1, recordedAt: '2026-08-10T04:00:00.000Z', dueAt: '2026-08-10T06:00:00.000Z' })
    ]

    const gaps = findOverdueReadingGaps(entries, null, new Date('2026-08-10T08:00:00.000Z'))

    expect(gaps).toEqual([{ entryId: 1, dueAt: '2026-08-10T06:00:00.000Z', nextRecordedAt: '2026-08-10T07:00:00.000Z' }])
  })

  it('returns no gaps for zero entries — never invents a "nobody ever took a reading" gap', () => {
    expect(findOverdueReadingGaps([], null, new Date('2026-08-10T08:00:00.000Z'))).toEqual([])
  })

  it('skips an entry with a null dueAt', () => {
    const entries = [buildEntry({ id: 1, recordedAt: '2026-08-10T04:00:00.000Z', dueAt: null })]

    expect(findOverdueReadingGaps(entries, null, new Date('2026-08-15T00:00:00.000Z'))).toEqual([])
  })
})
