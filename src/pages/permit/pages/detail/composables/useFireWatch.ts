import type { ComputedRef, Ref } from 'vue'
import { computed, onUnmounted, ref, watch } from 'vue'
import type { IPermitFireWatch } from '@/models/modules/permit/Permit.model'

/**
 * Mandatory Hot Work Fire Watch. Mirrors the backend's `FIRE_WATCH_DURATION_MINUTES`
 * (`smart-work-permit-api/src/libs/config/permit.config.ts`) — the server is authoritative and
 * re-checks it on close, answering 403 `FIRE_WATCH_NOT_ELAPSED` while it is still running.
 *
 * Declared once here and consumed by both the countdown panel and the closure modal's blocked
 * banner, so the number can never drift between the two.
 */
export const FIRE_WATCH_DURATION_MINUTES = 30

const FIRE_WATCH_DURATION_MS: number = FIRE_WATCH_DURATION_MINUTES * 60 * 1000

/** `MM:SS`, zero-padded. Clamped at zero — a negative remainder means the watch already elapsed. */
export function formatCountdown (remainingMs: number): string {
  const total = Math.max(0, Math.ceil(remainingMs / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export interface IUseFireWatch {
  /** Milliseconds left, recomputed once a second. `0` when there is no running watch. */
  remainingMs: ComputedRef<number>
  /** `MM:SS` for display. */
  remaining: ComputedRef<string>
  /** Percentage of the 30 minutes already elapsed, 0-100 — drives the progress bar. */
  elapsedPercent: ComputedRef<number>
  running: ComputedRef<boolean>
}

type TFireWatchSource = Ref<IPermitFireWatch | null> | ComputedRef<IPermitFireWatch | null>

/**
 * The countdown is anchored to the SERVER, never to a client-side start timestamp: a page reload,
 * a second tab, or a shifted device clock must not reset or extend the watch.
 *
 * Two server-supplied anchors, in order of preference:
 *
 * 1. `fireWatch.remainingSeconds` — computed server-side and therefore immune to clock skew. It is
 *    captured against the local clock the moment the payload arrives, and re-captured on every
 *    refetch, so a reload always re-anchors on the server's number.
 * 2. `fireWatch.startedAt` (identical to the permit's `fireMonitorStartedAt`) plus the 30 minutes,
 *    used when a payload predates the backend's 2026-08-21 `fireWatch` addition.
 *
 * Between refetches the local clock only *interpolates* — it never decides when the watch ends.
 * The backend re-checks on close regardless, and its 403 wins.
 */
export function useFireWatch (source: TFireWatchSource): IUseFireWatch {
  const now = ref<number>(Date.now())
  /** Local timestamp at which the current server remainder runs out. `null` when no watch is running. */
  const deadline = ref<number | null>(null)

  function anchor (value: IPermitFireWatch | null): void {
    if (!value) {
      deadline.value = null
      return
    }
    if (Number.isFinite(value.remainingSeconds)) {
      deadline.value = Date.now() + Math.max(0, value.remainingSeconds) * 1000
      return
    }
    const started = Date.parse(value.startedAt)
    deadline.value = Number.isNaN(started) ? null : started + FIRE_WATCH_DURATION_MS
  }

  watch(source, (value: IPermitFireWatch | null): void => {
    anchor(value)
  }, { immediate: true })

  const timer: ReturnType<typeof setInterval> = setInterval((): void => {
    now.value = Date.now()
  }, 1000)

  onUnmounted((): void => {
    clearInterval(timer)
  })

  const remainingMs: ComputedRef<number> = computed((): number => {
    if (deadline.value === null) return 0
    return Math.max(0, deadline.value - now.value)
  })

  const remaining: ComputedRef<string> = computed((): string => formatCountdown(remainingMs.value))

  const elapsedPercent: ComputedRef<number> = computed((): number => {
    if (deadline.value === null) return 0
    const elapsed = FIRE_WATCH_DURATION_MS - remainingMs.value
    return Math.min(100, Math.max(0, Math.round((elapsed / FIRE_WATCH_DURATION_MS) * 100)))
  })

  const running: ComputedRef<boolean> = computed((): boolean => remainingMs.value > 0)

  return { remainingMs, remaining, elapsedPercent, running }
}

export default useFireWatch
