import { ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import usePermitCountdown, {
  computeWorkWindowEnd, WARNING_THRESHOLD_MINUTES, type IUsePermitCountdown
} from '@/pages/permit/pages/detail/composables/usePermitCountdown'
import type { TPermitStatus } from '@/enums/modules/permit/PermitStatus.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'

const PERMIT_ID = 'WP-HOT-20260810-002'

function buildPermit (overrides: Partial<IPermitDetail> = {}): IPermitDetail {
  return {
    id: PERMIT_ID,
    type: 'hot' as TPermitType,
    status: 'ACTIVE' as TPermitStatus,
    title: 'Weld the pipe rack',
    foreman: 'Somchai P.',
    location: 'Zone A',
    startDate: '2026-08-09',
    endDate: '2026-08-10',
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

/** Same local-time-of-day extraction `usePermitCountdown.ts` itself uses, round-tripped through
 * a real `Date` so the test never hardcodes a UTC offset. */
function dailyEndAt (time: Date): string {
  const carrier = new Date(1970, 0, 1)
  carrier.setHours(time.getHours(), time.getMinutes(), 0, 0)
  return carrier.toISOString()
}

function dateOnly (date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

describe('usePermitCountdown — the permit-timeout warning', () => {
  const NOW = new Date(2026, 7, 10, 9, 0, 0)

  beforeEach(() => {
    // Only Date and the interval, matching FireWatch.test.ts's convention — promises still resolve.
    vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval'] })
    vi.setSystemTime(NOW)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('computeWorkWindowEnd splices dailyEnd\'s time-of-day onto endDate\'s calendar day, local time', () => {
    const endAt = new Date(2026, 7, 10, 17, 30, 0)
    const permit = { endDate: dateOnly(endAt), dailyEnd: dailyEndAt(endAt) }

    expect(computeWorkWindowEnd(permit)).toBe(endAt.getTime())
  })

  it('computeWorkWindowEnd returns null when endDate or dailyEnd cannot be parsed', () => {
    expect(computeWorkWindowEnd({ endDate: 'not-a-date', dailyEnd: '1970-01-01T10:00:00.000Z' })).toBeNull()
    expect(computeWorkWindowEnd({ endDate: '2026-08-10', dailyEnd: 'not-a-date' })).toBeNull()
  })

  it('state is normal with more than 30 minutes left on an ACTIVE permit', () => {
    const endAt = new Date(NOW.getTime() + 45 * 60 * 1000)
    const permit = ref(buildPermit({ status: 'ACTIVE', endDate: dateOnly(endAt), dailyEnd: dailyEndAt(endAt) }))

    const { state, remainingMs }: IUsePermitCountdown = usePermitCountdown(permit)

    expect(state.value).toBe('normal')
    expect(remainingMs.value).toBe(45 * 60 * 1000)
  })

  it('state is warning at exactly the 30-minute threshold on an ACTIVE or FIRE_MONITOR permit', () => {
    const endAt = new Date(NOW.getTime() + WARNING_THRESHOLD_MINUTES * 60 * 1000)

    const active = ref(buildPermit({ status: 'ACTIVE', endDate: dateOnly(endAt), dailyEnd: dailyEndAt(endAt) }))
    expect(usePermitCountdown(active).state.value).toBe('warning')

    const fireMonitor = ref(buildPermit({ status: 'FIRE_MONITOR', endDate: dateOnly(endAt), dailyEnd: dailyEndAt(endAt) }))
    expect(usePermitCountdown(fireMonitor).state.value).toBe('warning')
  })

  it('state is expired once the server has actually marked the permit EXPIRED', () => {
    const endAt = new Date(NOW.getTime() - 5 * 60 * 1000)
    const permit = ref(buildPermit({ status: 'EXPIRED', endDate: dateOnly(endAt), dailyEnd: dailyEndAt(endAt) }))

    const { state, remainingMs }: IUsePermitCountdown = usePermitCountdown(permit)

    expect(state.value).toBe('expired')
    expect(remainingMs.value).toBeLessThan(0)
  })

  it('state stays normal for a status the server never sweeps out of a live work window (e.g. DRAFT)', () => {
    const endAt = new Date(NOW.getTime() - 5 * 60 * 1000)
    const permit = ref(buildPermit({ status: 'DRAFT', endDate: dateOnly(endAt), dailyEnd: dailyEndAt(endAt) }))

    expect(usePermitCountdown(permit).state.value).toBe('normal')
  })

  it('state is normal, and remaining formats as 00:00, when the permit has no usable endDate/dailyEnd', () => {
    const permit = ref(buildPermit({ status: 'ACTIVE', endDate: '', dailyEnd: '' }))

    const { state, remaining, workWindowEndAt }: IUsePermitCountdown = usePermitCountdown(permit)

    expect(workWindowEndAt.value).toBeNull()
    expect(state.value).toBe('normal')
    expect(remaining.value).toBe('00:00')
  })

  it('re-syncs immediately when the source permit changes, without waiting for the next tick', () => {
    const soon = new Date(NOW.getTime() + 45 * 60 * 1000)
    const permit = ref(buildPermit({ status: 'ACTIVE', endDate: dateOnly(soon), dailyEnd: dailyEndAt(soon) }))

    const { state } = usePermitCountdown(permit)
    expect(state.value).toBe('normal')

    const extended = new Date(NOW.getTime() + 90 * 60 * 1000)
    permit.value = buildPermit({ status: 'ACTIVE', endDate: dateOnly(extended), dailyEnd: dailyEndAt(extended) })

    expect(state.value).toBe('normal')
  })
})
