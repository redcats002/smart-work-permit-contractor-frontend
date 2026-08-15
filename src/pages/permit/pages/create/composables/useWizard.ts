import type { ComputedRef, Ref } from 'vue'
import { computed, onUnmounted, ref } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { useDebounce } from '@/utils/Debounce'
import { useApiError } from '@/composables/useApiError'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { ICreatePermitDraftPayload, IUpdatePermitDraftPayload } from '@/models/request/permit/PermitReq.model'
import PermitProvider, { type IPermitProvider } from '@/resources/provider/permit/Permit.provider'
import { WIZARD_STEPS, type IWizardStepDef } from '../wizard/WizardSteps'

const PermitService: IPermitProvider = new PermitProvider()

export interface IUseWizard {
  steps: IWizardStepDef[]
  currentStepIndex: Ref<number>
  currentStep: ComputedRef<IWizardStepDef>
  maxUnlockedStepIndex: Ref<number>
  formData: Ref<IUpdatePermitDraftPayload>
  draftId: Ref<string | undefined>
  saving: Ref<boolean>
  isFirstStep: ComputedRef<boolean>
  isLastStep: ComputedRef<boolean>
  isNextBlocked: ComputedRef<boolean>
  canSubmit: ComputedRef<boolean>
  next (): void
  back (): void
  goToStep (index: number): void
  updateFormData (patch: Partial<IUpdatePermitDraftPayload>): void
}

/**
 * POST /permits needs the full draft shape, but the wizard only has `type` at
 * the moment "meaningful input" first fires (step 1 sets it before anything
 * else on the draft exists). Assumption pending PMT-005 confirmation: the
 * backend accepts a sparse draft — every other required field is sent blank
 * and gets filled in by the PATCHes later steps trigger.
 */
function buildCreatePayload (data: IUpdatePermitDraftPayload): ICreatePermitDraftPayload {
  return {
    type: data.type as TPermitType,
    project: data.project ?? '',
    foreman: data.foreman ?? '',
    workDate: data.workDate ?? '',
    workTimeStart: data.workTimeStart ?? '',
    workTimeEnd: data.workTimeEnd ?? '',
    workDescription: data.workDescription ?? '',
    location: data.location ?? '',
    outdoorWork: data.outdoorWork ?? false
  }
}

/**
 * Page-scoped wizard state for /permits/create (PMT-004). Deliberately a
 * composable, not a Pinia store — call site owns the instance, so navigating
 * away and back to the route always starts clean (see AGENTS.md "Wizard state
 * lives in a composable, not a Pinia store").
 *
 * `steps` defaults to the real WIZARD_STEPS registry; tests inject a smaller
 * fake registry to exercise the gating logic against schemas that can
 * actually fail (the real placeholder schemas always pass, by design).
 */
export function useWizard (steps: IWizardStepDef[] = WIZARD_STEPS): IUseWizard {
  const { mapError } = useApiError()

  const currentStepIndex = ref(0)
  const maxUnlockedStepIndex = ref(0)
  const formData = ref<IUpdatePermitDraftPayload>({})
  const draftId = ref<string | undefined>(undefined)
  const saving = ref(false)

  const currentStep: ComputedRef<IWizardStepDef> = computed((): IWizardStepDef => steps[currentStepIndex.value])
  const isFirstStep: ComputedRef<boolean> = computed((): boolean => currentStepIndex.value === 0)
  const isLastStep: ComputedRef<boolean> = computed((): boolean => currentStepIndex.value === steps.length - 1)
  const isNextBlocked: ComputedRef<boolean> = computed(
    (): boolean => !currentStep.value.schema.safeParse(formData.value).success
  )
  const canSubmit: ComputedRef<boolean> = computed(
    (): boolean => isLastStep.value && !isNextBlocked.value && draftId.value !== undefined && !saving.value
  )

  /**
   * Creates the draft on the first call (draftId still undefined), PATCHes it
   * on every call after. Reads draftId.value fresh at execution time, not at
   * call time — see the `inflight` chain below for why that matters.
   */
  async function doPersist (): Promise<void> {
    if (formData.value.type === undefined) return

    if (draftId.value === undefined) {
      const response = await PermitService.create(buildCreatePayload(formData.value))
      draftId.value = response.data.id
      return
    }
    await PermitService.update(draftId.value, formData.value)
  }

  /**
   * Two debounced flushes can both see draftId === undefined if they fire
   * before the first POST /permits resolves — chaining every persist() call
   * onto the same promise serializes them, so the second call's doPersist()
   * only ever runs after the first has set draftId. That is what prevents a
   * duplicate draft, not a boolean "isCreating" flag (which would drop the
   * second write instead of sequencing it).
   */
  let inflight: Promise<void> = Promise.resolve()

  function persist (): void {
    inflight = inflight.then(async (): Promise<void> => {
      await handleLoading(doPersist, { loadingUnit: saving }, (error: unknown): void => {
        toast.error(mapError(error).message)
      })
    })
  }

  const debouncedPersist = useDebounce((): void => persist(), 1500)

  onUnmounted((): void => {
    // Flush a pending PATCH so the last edit isn't lost on navigation. Never
    // fires a fresh create on teardown — debouncedPersist only has something
    // pending if updateFormData already scheduled one, which itself only
    // happens once `type` is set (see updateFormData below).
    debouncedPersist.flush()
  })

  function updateFormData (patch: Partial<IUpdatePermitDraftPayload>): void {
    formData.value = { ...formData.value, ...patch }
    // "First meaningful input" = the permit type is chosen (step 1). Nothing
    // is worth drafting server-side before that.
    if (formData.value.type === undefined) return
    debouncedPersist()
  }

  function next (): void {
    if (isNextBlocked.value || isLastStep.value) return
    currentStepIndex.value += 1
    if (currentStepIndex.value > maxUnlockedStepIndex.value) {
      maxUnlockedStepIndex.value = currentStepIndex.value
    }
  }

  /** Back never validates the current step — the user can always retreat. */
  function back (): void {
    if (isFirstStep.value) return
    currentStepIndex.value -= 1
  }

  /**
   * Refuses to jump past the furthest step unlocked via next(). Also refuses the
   * jump if any step strictly before `index` no longer validates — maxUnlockedStepIndex
   * only ratchets forward, so without this re-check, editing an earlier step back into
   * an invalid state (impossible today since every placeholder schema always passes,
   * but very possible once PMT-005 gives step 1 a real schema) would let the stepper
   * jump past it anyway.
   */
  function goToStep (index: number): void {
    if (index < 0 || index > maxUnlockedStepIndex.value) return
    const blockedBefore = steps
      .slice(0, index)
      .some((step: IWizardStepDef): boolean => !step.schema.safeParse(formData.value).success)
    if (blockedBefore) return
    currentStepIndex.value = index
  }

  return {
    steps,
    currentStepIndex,
    currentStep,
    maxUnlockedStepIndex,
    formData,
    draftId,
    saving,
    isFirstStep,
    isLastStep,
    isNextBlocked,
    canSubmit,
    next,
    back,
    goToStep,
    updateFormData
  }
}

export default useWizard
