import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { useApiError } from '@/composables/useApiError'
import type { IFacilityPlan } from '@/models/modules/facility-plan/FacilityPlan.model'
import type { IPermitPosition } from '@/models/modules/permit/Permit.model'
import FacilityPlanProvider, { type IFacilityPlanProvider } from '@/resources/provider/facility-plan/FacilityPlan.provider'

/**
 * feat-023 — whether the wizard needs a pin at all, and whether it has one, shared by `useWizard`
 * (gates Next/Submit on the Position step, exactly like `useCertificatePreflight` gates PPE &
 * Workers) and the Review step's summary row. ONE instance so the two can never disagree.
 *
 * `'none'` is the current production state — no plan has ever been activated — and MUST NOT
 * block anything: PROMPT-LOG's standing ruling is "no client-side rule that blocks what the
 * server would accept", and `'loading'` (the fetch hasn't resolved yet) gets the same treatment.
 * Only a CONFIRMED active plan with no pin is `'fail'`.
 */
export type TPositionPreflightState = 'loading' | 'none' | 'ok' | 'fail'

export interface IUsePlanPosition {
  /** `null` while loading or when no plan has ever been activated. */
  activePlan: Ref<IFacilityPlan | null>
  /** True once the active-plan lookup has settled (success OR failure) — used to gate step visibility. */
  loaded: Ref<boolean>
  /** Whether the Position step should even be shown — an active plan exists. */
  required: ComputedRef<boolean>
  fetchActive (): Promise<void>
  /** The gate: given the wizard's current `formData.position`, is a pin still owed? */
  stateFor (position: IPermitPosition | null | undefined): TPositionPreflightState
}

export function usePlanPosition (): IUsePlanPosition {
  const { mapError } = useApiError()
  const FacilityPlanService: IFacilityPlanProvider = new FacilityPlanProvider()

  const activePlan = ref<IFacilityPlan | null>(null)
  const loaded = ref(false)

  const required: ComputedRef<boolean> = computed((): boolean => activePlan.value !== null)

  async function fetchActive (): Promise<void> {
    try {
      const { data } = await FacilityPlanService.getActive()
      activePlan.value = data
    } catch (error: unknown) {
      // A failed lookup must never be stricter than "no plan" — see the doc comment above.
      mapError(error)
      activePlan.value = null
    } finally {
      loaded.value = true
    }
  }

  function stateFor (position: IPermitPosition | null | undefined): TPositionPreflightState {
    if (!loaded.value) return 'loading'
    if (!required.value) return 'none'
    const hasPin = Boolean(position && typeof position.planX === 'number' && typeof position.planY === 'number' && position.planId)
    return hasPin ? 'ok' : 'fail'
  }

  return { activePlan, loaded, required, fetchActive, stateFor }
}

export default usePlanPosition
