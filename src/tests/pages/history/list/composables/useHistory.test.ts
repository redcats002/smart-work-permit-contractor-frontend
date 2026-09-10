import { describe, expect, it } from 'vitest'
import { setLocale } from '@/plugins/I18n.plugin'
import { formatDuration } from '@/pages/history/pages/list/composables/useHistory'

// `useApiError`/`formatDuration` localize through the app's i18n singleton (see
// `src/plugins/I18n.plugin.ts`) — mount it via `setLocale`, not a fresh `createI18n`, or the
// default locale (`th`) leaks into an assertion written in English.
setLocale('en')

describe('formatDuration (wayfinder 082)', () => {
  it('formats a same-day permit from its 1970-01-01-anchored dailyStart/dailyEnd, not HH:mm', () => {
    // `dailyStart`/`dailyEnd` have ALWAYS been full ISO datetimes on the wire (the "067 UTC
    // trap" — see IPermitBase's doc comment), never `HH:mm`. The previous implementation ran
    // `start.split(':')` on this exact shape: `"1970-01-01T06:00:00.000Z".split(':')` yields
    // `["1970-01-01T06", "00", "00.000Z"]`, `Number("1970-01-01T06")` is `NaN`, and the function
    // returned the literal string `"NaNh NaNm"` for every single-day permit in the app — this is
    // the test that would have caught it, because it feeds the function the real shape.
    const result = formatDuration(
      '1970-01-01T06:00:00.000Z', '1970-01-01T14:30:00.000Z', '2026-08-10', '2026-08-10'
    )

    expect(result).not.toContain('NaN')
    expect(result).toBe('8h 30m')
  })

  it('reports the per-day duration AND the day count for a multi-day permit (wayfinder 067)', () => {
    // A permit's window now repeats daily between startDate and endDate. Showing only the bare
    // per-day figure for a 5-day permit understates it — the day count must ride along.
    const result = formatDuration(
      '1970-01-01T06:00:00.000Z', '1970-01-01T14:30:00.000Z', '2026-08-10', '2026-08-14'
    )

    expect(result).toBe('8h 30m/day · 5 day(s)')
  })

  it('the per-day duration is timezone-stable — start and end shift by the same local offset', () => {
    // getHours()/getMinutes() (local time, per the 067 UTC trap) shift BOTH legs of the pair by
    // the same offset, so the difference is unaffected by the host machine's TZ. Guards against a
    // future change accidentally reading only one side in UTC.
    const eightThirty = formatDuration(
      '1970-01-01T22:00:00.000Z', '1970-01-02T06:30:00.000Z', '2026-08-10', '2026-08-10'
    )

    expect(eightThirty).toBe('8h 30m')
  })
})
