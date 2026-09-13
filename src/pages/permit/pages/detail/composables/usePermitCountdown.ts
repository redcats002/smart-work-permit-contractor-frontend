import type { ComputedRef, Ref } from 'vue'
import { computed, onUnmounted, ref, watch } from 'vue'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import { formatCountdown } from './useFireWatch'

/**
 * The permit-timeout warning. Unlike `useFireWatch`, the work-window end has no server-computed
 * remainder field on the wire — it is derived client-side from `permit.endDate` (`YYYY-MM-DD`)
 * combined with `permit.dailyEnd`'s time-of-day, on the SAME "067 UTC TRAP" convention
 * `Step3WhereWhen.vue`'s `extractTimeOfDay`/`composeDateTime` use: `Date#getHours`/`Date#setHours`
 * (browser-LOCAL), never `getUTCHours`/`setUTCHours`. Diverging here would compute a different
 * instant than the one the wizard showed the contractor when they picked it.
 *
 * The server is still authoritative for the actual state transition: it is the one sweep that
 * flips a permit to `EXPIRED`, and `POST /permits/:id/extend` re-checks its own gate regardless of
 * what this composable renders. This is a warning surface, not a lock — closest in spirit to
 * `useFireWatch`'s own "render, never gate" stance.
 */
export const WARNING_THRESHOLD_MINUTES = 30

const WARNING_THRESHOLD_MS: number = WARNING_THRESHOLD_MINUTES * 60 * 1000

export type TPermitCountdownState = 'normal' | 'warning' | 'expired'

export interface IUsePermitCountdown {
  /** Milliseconds until the work window ends. Negative once it has passed. */
  remainingMs: ComputedRef<number>
  /** `MM:SS` for display, clamped at zero. */
  remaining: ComputedRef<string>
  /** `null` when the permit has no usable `endDate`/`dailyEnd`. */
  workWindowEndAt: ComputedRef<number | null>
  state: ComputedRef<TPermitCountdownState>
}

type TPermitCountdownSource = Ref<IPermitDetail | null> | ComputedRef<IPermitDetail | null>

/** Browser-local extraction, matching `Step3WhereWhen.vue`'s `extractTimeOfDay` verbatim. */
function extractTimeOfDay (iso: string): { hours: number, minutes: number } | undefined {
  const parsed = new Date(iso)
  return Number.isNaN(parsed.getTime()) ? undefined : { hours: parsed.getHours(), minutes: parsed.getMinutes() }
}

/**
 * `permit.endDate` is `YYYY-MM-DD` — `new Date(...)` on that shape is what
 * `Step3WhereWhen.vue`'s own `endDateModel` getter already does to show it in the DatePicker, so
 * this splices the daily-end time onto the SAME calendar-day instant the contractor last saw.
 */
export function computeWorkWindowEnd (permit: Pick<IPermitDetail, 'endDate' | 'dailyEnd'>): number | null {
  const endDate = new Date(permit.endDate)
  if (Number.isNaN(endDate.getTime())) return null
  const timeOfDay = extractTimeOfDay(permit.dailyEnd)
  if (!timeOfDay) return null
  const combined = new Date(endDate)
  combined.setHours(timeOfDay.hours, timeOfDay.minutes, 0, 0)
  return combined.getTime()
}

export function usePermitCountdown (source: TPermitCountdownSource): IUsePermitCountdown {
  const now = ref<number>(Date.now())

  const workWindowEndAt: ComputedRef<number | null> = computed((): number | null => {
    const permit = source.value
    return permit ? computeWorkWindowEnd(permit) : null
  })

  const timer: ReturnType<typeof setInterval> = setInterval((): void => {
    now.value = Date.now()
  }, 1000)

  onUnmounted((): void => {
    clearInterval(timer)
  })

  // Re-sync immediately whenever the source permit changes (e.g. right after a successful
  // extend) rather than waiting up to a second for the interval to tick `now` again.
  watch(source, (): void => {
    now.value = Date.now()
  })

  const remainingMs: ComputedRef<number> = computed((): number => {
    if (workWindowEndAt.value === null) return 0
    return workWindowEndAt.value - now.value
  })

  const remaining: ComputedRef<string> = computed((): string => formatCountdown(remainingMs.value))

  const state: ComputedRef<TPermitCountdownState> = computed((): TPermitCountdownState => {
    const permit = source.value
    if (!permit || workWindowEndAt.value === null) return 'normal'
    if (permit.status === 'EXPIRED') return 'expired'
    if ((permit.status === 'ACTIVE' || permit.status === 'FIRE_MONITOR') && remainingMs.value <= WARNING_THRESHOLD_MS) {
      return 'warning'
    }
    return 'normal'
  })

  return { remainingMs, remaining, workWindowEndAt, state }
}

export default usePermitCountdown
