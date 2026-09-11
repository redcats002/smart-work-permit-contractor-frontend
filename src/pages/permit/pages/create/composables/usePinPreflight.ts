import { ref, type Ref } from 'vue'
import { useApiError } from '@/composables/useApiError'
import PinProvider, { type IPinProvider } from '@/resources/provider/pin/Pin.provider'

/**
 * wayfinder ticket 107 — renamed from `usePlanPosition` (feat-023). Whether the wizard needs a
 * pin at all, and whether it has one, shared by `useWizard` (gates Next/Submit on the Where &
 * When step, exactly like `useCertificatePreflight` gates PPE & Workers) and the Review step's
 * summary row. ONE instance so the two can never disagree.
 *
 * The old composable tracked one specific `activePlan` object, because the pre-105 gate asked
 * "does an active facility plan exist". Ticket 105's own resolution reframes the gate as "does an
 * active pin on an active plan exist" — a global fact, not a plan (or an area) the wizard needs to
 * hold onto — so this composable no longer fetches or exposes a plan at all. `PinPicker.vue` owns
 * its own plan/pin fetches independently, the same self-contained shape `AreaPicker.vue` already
 * uses; this composable's only job is the yes/no preflight gate.
 *
 * `'none'` (no active pin anywhere yet) MUST NOT block anything: PROMPT-LOG's standing ruling is
 * "no client-side rule that blocks what the server would accept", and `'loading'` (the probe
 * hasn't resolved yet) gets the same treatment. Only a CONFIRMED active-pin-exists with no `pinId`
 * chosen is `'fail'`.
 */
export type TPositionPreflightState = 'loading' | 'none' | 'ok' | 'fail'

export interface IUsePinPreflight {
  /** True once the existence probe has settled (success OR failure) — used to gate step visibility. */
  loaded: Ref<boolean>
  /** Whether a pin is owed at all — at least one active pin on an active plan exists anywhere. */
  required: Ref<boolean>
  /**
   * The existence probe: `PinService.list({ page: 1, limit: 1, active: true })`. `?active=true`
   * is itself "active AND on a currently-active plan" (the api's own route description) — one
   * lightweight lookup answers the whole gate, `required = count > 0`. Call it once on mount.
   */
  fetchRequired (): Promise<void>
  /** The gate: given the wizard's current `formData.pinId`, is a pin still owed? */
  stateFor (pinId: number | null | undefined): TPositionPreflightState
}

export function usePinPreflight (): IUsePinPreflight {
  const { mapError } = useApiError()
  const PinService: IPinProvider = new PinProvider()

  const loaded = ref(false)
  const required = ref(false)

  async function fetchRequired (): Promise<void> {
    try {
      const { count } = await PinService.list({ page: 1, limit: 1, active: true })
      required.value = count > 0
    } catch (error: unknown) {
      // A failed lookup must never be stricter than "no pin owed" — see the doc comment above.
      mapError(error)
      required.value = false
    } finally {
      loaded.value = true
    }
  }

  function stateFor (pinId: number | null | undefined): TPositionPreflightState {
    if (!loaded.value) return 'loading'
    if (!required.value) return 'none'
    return typeof pinId === 'number' ? 'ok' : 'fail'
  }

  return { loaded, required, fetchRequired, stateFor }
}

export default usePinPreflight
