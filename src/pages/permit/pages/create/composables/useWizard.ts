import type { ComputedRef, Ref } from 'vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { dayjs } from '@/plugins/dayjs.plugin'
import i18n from '@/plugins/I18n.plugin'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { useDebounce } from '@/utils/Debounce'
import { useApiError, type IApiErrorResult } from '@/composables/useApiError'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { ICreatePermitDraftPayload, IUpdatePermitDraftPayload } from '@/models/request/permit/PermitReq.model'
import type { IFacilityPlan } from '@/models/modules/facility-plan/FacilityPlan.model'
import type { IPermitPosition, IPermitSafetyReading, IPermitWorker } from '@/models/modules/permit/Permit.model'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import type { TChecklistAnswer } from '../constants/SafetyChecklist'
import {
  EMPTY_SUBMIT_FAILURES, extractSubmitFailures, stepKeyForSubmitFailure, type ISubmitFailures
} from '../constants/SubmitErrorRouting'
import { hasPartialJsaRow, toSubmittableJsaSteps } from '../schema/Step5Jsa.schema'
import {
  useCertificatePreflight, type ICertificateProblem, type TCertificatePreflightState
} from './useCertificatePreflight'
import { usePlanPosition, type TPositionPreflightState } from './usePlanPosition'
import PermitProvider, { type IPermitProvider } from '@/resources/provider/permit/Permit.provider'
import { WIZARD_STEPS, type IWizardStepDef } from '../wizard/WizardSteps'

const PermitService: IPermitProvider = new PermitProvider()

export interface IUseWizard {
  /**
   * feat-023. The `position` step is filtered OUT of this whenever no active facility plan
   * exists — that is the current production state today, and it must keep working unchanged
   * (see `usePlanPosition`). Reactive because the underlying `GET /facility-plans/active` lookup
   * is async; StepperHeader/WizardFooter/PermitCreatePage all bind `:steps="steps"`, which
   * auto-unwraps a computed in the template with no consumer-side change.
   */
  steps: ComputedRef<IWizardStepDef[]>
  currentStepIndex: Ref<number>
  currentStep: ComputedRef<IWizardStepDef>
  maxUnlockedStepIndex: Ref<number>
  formData: Ref<IUpdatePermitDraftPayload>
  checklistAnswers: Ref<Record<string, TChecklistAnswer>>
  draftId: Ref<string | undefined>
  saving: Ref<boolean>
  submitting: Ref<boolean>
  /** Localized verdict of the last rejected submit — the server's answer, never its `message`. */
  submitError: Ref<IApiErrorResult | undefined>
  /**
   * Every per-item failure the last rejected submit reported (`failures[]` /
   * `certificateFailures[]`), so steps 3 and 4 can highlight ALL of them at once rather than the
   * one code that happened to land in the envelope.
   */
  submitFailures: Ref<ISubmitFailures>
  /**
   * CRT-004. Client-side worker-certificate pre-flight, shared by step 4 (gates Next, names the
   * blocking worker) and step 6's review row — ONE instance so the two never disagree about which
   * workers are blocking. `'fail'` is the only state that gates anything: `'loading'`/`'unknown'`
   * never block, because an unconfirmed answer must never be stricter than the server's real
   * verdict at submit (../../../../../PROMPT-LOG.md "no client-side rule that blocks what the
   * server would accept").
   */
  certificateState: Ref<TCertificatePreflightState>
  certificateProblems: Ref<ICertificateProblem[]>
  /**
   * wayfinder ticket 004. Re-runs the shared pre-flight against the CURRENT worker list. This is
   * the ONLY trigger: nothing watches `formData.workers`, because checking mid-typing closed the
   * worker-name suggestion overlay (see the implementation note below). Step 4 calls it on the
   * events that settle a name; the wizard calls it on hydrate and on every forward move.
   */
  recheckCertificates (): void
  /**
   * feat-023. Mirrors `certificateState` exactly, for the Position step + Review row. `'none'`
   * (no active plan — today's production default) and `'loading'` never block; only a confirmed
   * `'fail'` (an active plan exists and `formData.position` is unset) does.
   */
  positionState: ComputedRef<TPositionPreflightState>
  activePlan: Ref<IFacilityPlan | null>
  isFirstStep: ComputedRef<boolean>
  isLastStep: ComputedRef<boolean>
  isNextBlocked: ComputedRef<boolean>
  canSubmit: ComputedRef<boolean>
  next (): void
  back (): void
  goToStep (index: number): void
  updateFormData (patch: Partial<IUpdatePermitDraftPayload>): void
  updateChecklistAnswers (patch: Record<string, TChecklistAnswer>): void
  submitDraft (): Promise<string | undefined>
  /**
   * wayfinder ticket 033 — the explicit "Save as Draft" action (as opposed to the debounced
   * autosave `updateFormData` already schedules on every field edit). Flushes any pending
   * autosave and waits for the same `inflight` chain `submitDraft` waits on, so the confirmation
   * dialog's "confirm" really has landed before the caller navigates away. Never fires a fresh
   * create by itself — `debouncedPersist` only has something pending if `updateFormData` already
   * scheduled one (see its own `hasCreatableDraft` gate), so calling this with nothing entered
   * yet is a safe no-op.
   */
  saveDraft (): Promise<void>
  /**
   * PMT-014. Seeds the wizard from an already-confirmed-editable permit (the resume/duplicate
   * routes own confirming editability — this function only seeds state, it never calls the API).
   * Sets `draftId` so the next edit PATCHes rather than creating a second draft, primes
   * `lastPersistedReading` from `latestSafetyReading` so a copied/unchanged reading is never
   * replayed as a new row, and lands on the first step whose schema does not validate (every
   * earlier step is therefore unlocked already).
   */
  hydrate (permit: IPermitDetail): void
}

/**
 * POST /permits requires type, title, location, foreman, workDate, workTimeStart and
 * workTimeEnd — all of them, with `minLength: 1` on the strings (docs/api/openapi.json). The
 * wizard only has `type` when "meaningful input" first fires, so a draft cannot be created that
 * early: `title`, `location` and `foreman` come from step 2, and the create call must wait for
 * them. `hasCreatableDraft` below is that gate, and PMT-005 owns making step 2 satisfy it.
 *
 * There is no `project` and no `workDescription` on this API — those were assumptions.
 */
/**
 * The reading fields PATCH /permits/:id actually declares. **SO2 is absent from the wire** — the
 * `safetyReading` body schema in docs/api/openapi.json is `{ lel, o2, co, wind, height }` only,
 * and Elysia strips unknown keys, so an so2 value is silently discarded (docs/api/GAPS.md row K).
 * It is collected and displayed because the design asks for it, and it is advisory-only
 * (`SAFETY_RANGES.ranges.so2.blocking === false`), so dropping it cannot change a verdict.
 */
function toWireReading (reading: IPermitSafetyReading): IPermitSafetyReading {
  return {
    lel: reading.lel,
    o2: reading.o2,
    co: reading.co,
    wind: reading.wind,
    height: reading.height
  }
}

function buildCreatePayload (data: IUpdatePermitDraftPayload): ICreatePermitDraftPayload {
  return {
    type: data.type as TPermitType,
    title: data.title ?? '',
    location: data.location ?? '',
    foreman: data.foreman ?? '',
    workDate: data.workDate ?? '',
    workTimeStart: data.workTimeStart ?? '',
    workTimeEnd: data.workTimeEnd ?? '',
    outdoorWork: data.outdoorWork ?? false
  }
}

/** Every field POST /permits rejects as empty must be present before the first create fires. */
export function hasCreatableDraft (data: IUpdatePermitDraftPayload): boolean {
  return Boolean(data.type && data.title && data.location && data.foreman
    && data.workDate && data.workTimeStart && data.workTimeEnd)
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
export function useWizard (registry: IWizardStepDef[] = WIZARD_STEPS): IUseWizard {
  const { mapError } = useApiError()

  const currentStepIndex = ref(0)
  const maxUnlockedStepIndex = ref(0)
  const formData = ref<IUpdatePermitDraftPayload>({})
  const checklistAnswers = ref<Record<string, TChecklistAnswer>>({})
  const draftId = ref<string | undefined>(undefined)
  const saving = ref(false)
  const submitting = ref(false)
  const submitError = ref<IApiErrorResult | undefined>(undefined)
  const submitFailures = ref<ISubmitFailures>(EMPTY_SUBMIT_FAILURES)

  // CRT-004. ONE preflight instance for the whole wizard — step 4 (gates Next) and step 6 (review
  // row) read the same `certificateState`/`certificateProblems`, so they can never show a passing
  // row next to a disabled Submit (or vice versa) for the same underlying answer. A local
  // `certificateChecking` loading flag is used instead of the global loading store, since a
  // lookup can be triggered on every worker-list edit.
  const certificateChecking = ref(false)
  const {
    state: certificateState,
    problems: certificateProblems,
    check: checkCertificates
  } = useCertificatePreflight(certificateChecking)

  // feat-023. ONE shared position pre-flight instance, mirroring the certificate one above —
  // the Position step's gate and the Review row can never disagree about whether a pin is owed.
  // Fetched on mount (not, say, debounced off an input like the certificate check) so it has
  // resolved long before a real user, walking the wizard by hand, reaches the step it gates.
  // `onMounted`, not a bare call at setup time: a composable-level test that calls `useWizard()`
  // directly (no component tree — see src/tests/composables/useWizard.test.ts) has no active
  // Pinia, and this app's 401 interceptor branch touches the auth store — exactly the failure
  // mode `useCertificatePreflight` avoids by never firing unless there is a named worker to look
  // up. Outside a mounted component `onMounted` is a documented no-op, so those tests are
  // unaffected; a real page always mounts inside `main.ts`'s Pinia-registered app.
  const { activePlan, required: positionRequired, fetchActive, stateFor: positionStateFor } = usePlanPosition()
  onMounted((): void => {
    void fetchActive()
  })

  const positionState: ComputedRef<TPositionPreflightState> = computed(
    (): TPositionPreflightState => positionStateFor(formData.value.position)
  )

  /**
   * The `position` step only appears once an active facility plan is confirmed — see the
   * `IUseWizard.steps` doc. Every other step's `key` is a fixed member of `registry`; filtering
   * never changes their relative order.
   */
  const steps: ComputedRef<IWizardStepDef[]> = computed(
    (): IWizardStepDef[] => registry.filter((step: IWizardStepDef): boolean => step.key !== 'position' || positionRequired.value)
  )

  const currentStep: ComputedRef<IWizardStepDef> = computed(
    (): IWizardStepDef => steps.value[currentStepIndex.value]
  )
  const isFirstStep: ComputedRef<boolean> = computed((): boolean => currentStepIndex.value === 0)
  const isLastStep: ComputedRef<boolean> = computed((): boolean => currentStepIndex.value === steps.value.length - 1)
  const isNextBlocked: ComputedRef<boolean> = computed((): boolean => {
    if (!currentStep.value.schema.safeParse(formData.value).success) return true
    // Only the PPE & Workers step gates on certificates, and only on a CONFIRMED 'fail' — never
    // on 'loading'/'unknown', which would make an unresolved lookup stricter than the server.
    if (currentStep.value.key === 'ppeWorkers' && certificateState.value === 'fail') return true
    // Same shape for the Position step: only a CONFIRMED 'fail' (an active plan exists and no
    // pin is set) blocks — 'loading'/'none' never do (../../../../../PROMPT-LOG.md "no
    // client-side rule that blocks what the server would accept").
    if (currentStep.value.key === 'position' && positionState.value === 'fail') return true
    return false
  })
  const canSubmit: ComputedRef<boolean> = computed(
    (): boolean => isLastStep.value && !isNextBlocked.value && draftId.value !== undefined
      && !saving.value && !submitting.value && certificateState.value !== 'fail'
      // Guards the Review step specifically: Review's own schema can't see external plan state,
      // so a hydrated draft that lands there with no pin must still be blocked here, not just on
      // the Position step itself (which the user may never have re-visited this session).
      && positionState.value !== 'fail'
  )

  /**
   * The check runs on COMMIT, never on keystrokes. It used to run off a 500ms debounced watch on
   * `formData.workers`, which meant a name half-typed into step 4's AutoComplete fired a lookup,
   * and its verdict then mounted/unmounted the `certificateProblems` banner *below the table*
   * while the suggestion overlay was open. PrimeVue's AutoComplete binds a scroll listener on its
   * scrollable ancestors and a window resize listener whenever the overlay is up, and BOTH call
   * `hide()` — so the reflow from that banner closed the suggestion list mid-typing (reported
   * 2026-09-01). Step 4 now calls `recheckCertificates()` itself on the events that actually
   * settle a name (selecting a suggestion, blurring the field with a changed name, removing a
   * row, creating a certificate in-wizard), and the wizard re-runs it on every forward move so a
   * gate can never be stale. `check()` is sequence-guarded, so overlapping calls are safe.
   */
  function recheckCertificates (): void {
    void checkCertificates(formData.value.workers ?? [])
  }

  /**
   * Creates the draft on the first call (draftId still undefined), PATCHes it
   * on every call after. Reads draftId.value fresh at execution time, not at
   * call time — see the `inflight` chain below for why that matters.
   */
  /**
   * The last safety reading actually accepted by the server, serialized. `safetyReading` APPENDS
   * a row on every PATCH (it is a log, not a field), so sending the unchanged reading along with
   * an unrelated edit — a title fix, a JSA row, a worker's BP — would append a duplicate every
   * time. Snapshotted only AFTER the PATCH resolves, so a failed request does not lose the
   * reading, and compared against what is actually SENT (so2 stripped) rather than what is held
   * in `formData`.
   */
  let lastPersistedReading: string | undefined

  /**
   * wayfinder ticket 045. True only while `formData.areaId` holds a value a HUMAN chose in this
   * session — picking an area, or clearing one. It is deliberately NOT "formData has an areaId":
   * `hydrate` seeds the permit's stored `areaId` for display, and echoing that back on every
   * autosave is what makes a permit referencing a non-APPROVED area unsaveable forever.
   *
   * Set from `updateFormData`, so it holds regardless of which wizard steps mounted — the whole
   * point of 045, since `AreaPicker` lives on a step that production never renders. Cleared by an
   * explicit `areaId: undefined`, which is `AreaPicker.resolveStaleArea`'s "I stripped this, do
   * not send it" and the one spelling that is not a user choice.
   */
  let areaIdIsUserChoice = false

  async function doPersist (): Promise<void> {
    if (formData.value.type === undefined) return

    if (draftId.value === undefined) {
      const response = await PermitService.create(buildCreatePayload(formData.value))
      draftId.value = response.data.id
      return
    }

    const { safetyReading, ...rest } = formData.value
    const payload: IUpdatePermitDraftPayload = { ...rest }
    // wayfinder ticket 001. `jsaSteps` is replaced WHOLESALE by this PATCH (AGENTS.md), so a
    // partial row (started, not finished) must never shrink the outgoing array — that would
    // overwrite the permit's persisted jsaSteps and delete that row's already-complete siblings
    // too. While any row is partial, skip the key entirely this round: `formData.jsaSteps` is
    // untouched (the user keeps typing into it), and the next PATCH after they finish or delete
    // the row sends the real list. A blank "add row" placeholder, on the other hand, was never
    // persisted, so dropping IT from the array is safe — `toSubmittableJsaSteps` does that and
    // recomputes sortOrder with no gaps.
    if (payload.jsaSteps !== undefined) {
      if (hasPartialJsaRow(payload.jsaSteps)) {
        delete payload.jsaSteps
      } else {
        payload.jsaSteps = toSubmittableJsaSteps(payload.jsaSteps)
      }
    }
    // wayfinder tickets 037 + 044 + 045. The invariant: `areaId` goes on the wire ONLY when a
    // human set it in this session. A value that merely arrived from `hydrate` is display state,
    // never outgoing payload, so it is deleted here — the server's `AREA_NOT_APPROVED` guard
    // fires on the key's PRESENCE, not on whether the value changed, and omitting the key is what
    // the server reads as "leave the stored value alone".
    //
    // 045: this used to be `payload.areaId === undefined`, which was a proxy for "AreaPicker told
    // us to strip it" — correct only while `AreaPicker` mounts. It lives inside `Step7Position`,
    // which `steps` filters out entirely when no facility plan is active, and that is production
    // today. A permit carrying a non-APPROVED `areaId` would then 400 on EVERY autosave, forever,
    // with no UI able to clear it. The condition is now `areaIdIsUserChoice`, which no step has to
    // mount to be right.
    //
    // `null` still reaches the server — that is a user's deliberate clear, and it is destructive
    // on purpose. Do not collapse `undefined` and `null` here; they mean opposite things.
    if (!areaIdIsUserChoice) delete payload.areaId
    const wireReading = safetyReading === undefined ? undefined : toWireReading(safetyReading)
    const serialized = wireReading === undefined ? undefined : JSON.stringify(wireReading)
    const shouldAppendReading = serialized !== undefined && serialized !== lastPersistedReading
    if (shouldAppendReading) payload.safetyReading = wireReading

    await PermitService.update(draftId.value, payload)
    if (shouldAppendReading) lastPersistedReading = serialized
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

  /**
   * `permit.workDate` is a full ISO timestamp on the wire (see IPermitBase); formData must hold
   * `YYYY-MM-DD`, the shape everything downstream (Step2BasicInfo's picker, buildCreatePayload,
   * the PATCH body) actually sends. Converts through Bangkok wall-clock time, not browser-local —
   * a plain `dayjs(...).format()` ignores `dayjs.tz.setDefault` (see AGENTS.md's dayjs latent-bug
   * note); `.tz('Asia/Bangkok')` is required.
   */
  function toFormWorkDate (workDate: string): string {
    return dayjs(workDate).tz('Asia/Bangkok').format('YYYY-MM-DD')
  }

  /** First step whose schema rejects the given data, or the last step when every step passes. */
  function firstInvalidStepIndex (data: IUpdatePermitDraftPayload): number {
    const blockedIndex = steps.value.findIndex((step: IWizardStepDef): boolean => !step.schema.safeParse(data).success)
    return blockedIndex === -1 ? steps.value.length - 1 : blockedIndex
  }

  /**
   * `bloodPressure`/`alcoholReading` are `string` on the wire — NOT nullable
   * (docs/api/openapi.json: `{ type: 'string' }`) — but GET returns `null` for any worker that
   * never had a health check (every non-Confined-Space permit, always). Hydrating that `null`
   * straight into `formData` and later sending it back via `doPersist`'s wholesale `workers`
   * replace 400s (`Expected property 'workers.N.bloodPressure' to be string but found: null`), so
   * it must be dropped here, once, at the point data enters the wizard — never round-tripped.
   */
  function toFormWorkers (workers: IPermitWorker[]): IPermitWorker[] {
    return workers.map((worker: IPermitWorker): IPermitWorker => ({
      workerName: worker.workerName,
      roleOnPermit: worker.roleOnPermit,
      bloodPressure: worker.bloodPressure ?? undefined,
      alcoholReading: worker.alcoholReading ?? undefined
    }))
  }

  /**
   * feat-023. GET returns the pin flattened (`planId`/`planX`/`planY`); the wizard's own
   * `formData.position` shape is the nested one PATCH/POST accept — see `IPermitPosition`. `null`
   * when the permit was never pinned (every permit before the first plan was ever activated).
   */
  function toFormPosition (permit: IPermitDetail): IPermitPosition | null {
    if (permit.planId === null || permit.planX === null || permit.planY === null) return null
    return { planId: permit.planId, planX: permit.planX, planY: permit.planY }
  }

  function hydrate (permit: IPermitDetail): void {
    const hydrated: IUpdatePermitDraftPayload = {
      type: permit.type,
      title: permit.title,
      location: permit.location,
      foreman: permit.foreman,
      workDate: toFormWorkDate(permit.workDate),
      workTimeStart: permit.workTimeStart,
      workTimeEnd: permit.workTimeEnd,
      outdoorWork: permit.outdoorWork,
      safetyReading: permit.latestSafetyReading ?? undefined,
      jsaSteps: permit.jsaSteps,
      workers: toFormWorkers(permit.workers),
      photos: permit.photos,
      position: toFormPosition(permit),
      // wayfinder tickets 037 + 044 + 045. Seeded as-is, whatever it is, purely so `AreaPicker`
      // can DISPLAY it — the picker resolves whether the area is in the list this contractor can
      // actually see, and since 044 "it is not" is the ordinary case, not a rare one. Nothing
      // here may assume a seeded `areaId` is selectable, or even approved.
      //
      // 045: seeding is not choosing. `areaIdIsUserChoice` stays false below, so this value is
      // never echoed back on an autosave no matter which steps mount — the permit stays saveable
      // even when the picker that used to strip it is filtered out of the wizard entirely.
      areaId: permit.areaId ?? undefined
    }

    formData.value = hydrated
    areaIdIsUserChoice = false
    draftId.value = permit.id
    submitError.value = undefined
    submitFailures.value = EMPTY_SUBMIT_FAILURES

    const wireReading = hydrated.safetyReading === undefined ? undefined : toWireReading(hydrated.safetyReading)
    lastPersistedReading = wireReading === undefined ? undefined : JSON.stringify(wireReading)

    const landingIndex = firstInvalidStepIndex(hydrated)
    maxUnlockedStepIndex.value = landingIndex
    currentStepIndex.value = landingIndex

    // The removed watch carried `immediate: true`, so a hydrated draft's workers were checked on
    // arrival. Keep that: step 6's review row must not read 'idle' for a draft loaded straight
    // into it.
    recheckCertificates()
  }

  function updateFormData (patch: Partial<IUpdatePermitDraftPayload>): void {
    formData.value = { ...formData.value, ...patch }
    // wayfinder ticket 045 — see `areaIdIsUserChoice`. Only an explicit key counts, and an
    // explicit `undefined` counts the other way: that is the picker stripping a reference the
    // user never asked about, not choosing one.
    if ('areaId' in patch) areaIdIsUserChoice = patch.areaId !== undefined
    // Any edit makes the last server verdict stale, so drop it: otherwise a reading the server
    // rejected stays red — and its banner stays up — even after the user has corrected the value,
    // until they press Submit again. Cleared on ANY field edit rather than only the rejected one:
    // the user is actively editing the draft the server refused, and Submit re-runs the check, so
    // clearing a beat early is strictly better than a stuck red card.
    submitError.value = undefined
    submitFailures.value = EMPTY_SUBMIT_FAILURES
    // A draft cannot be created from step 1 alone: POST /permits requires type, title, location,
    // foreman, workDate, workTimeStart and workTimeEnd together, all non-empty (API-005). Before
    // that the create would 400, so nothing is persisted; once the draft exists, every later edit
    // PATCHes as usual.
    if (!draftId.value && !hasCreatableDraft(formData.value)) return
    debouncedPersist()
  }

  /**
   * Step 3's checklist. Never persisted and never gates Next — see
   * ../constants/SafetyChecklist.ts and docs/api/GAPS.md row J.
   */
  function updateChecklistAnswers (patch: Record<string, TChecklistAnswer>): void {
    checklistAnswers.value = { ...checklistAnswers.value, ...patch }
  }

  function next (): void {
    if (isNextBlocked.value || isLastStep.value) return
    currentStepIndex.value += 1
    if (currentStepIndex.value > maxUnlockedStepIndex.value) {
      maxUnlockedStepIndex.value = currentStepIndex.value
    }
    // Every forward move re-runs the check, so a verdict can never be stale by the time step 6
    // reads it — the price of no longer checking on every keystroke. Cheap: `check()` is a no-op
    // lookup when no worker is named, and is sequence-guarded against overlap.
    recheckCertificates()
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
    const blockedBefore = steps.value
      .slice(0, index)
      .some((step: IWizardStepDef): boolean => !step.schema.safeParse(formData.value).success)
    if (blockedBefore) return
    currentStepIndex.value = index
    recheckCertificates()
  }

  /**
   * wayfinder ticket 033. See the `IUseWizard.saveDraft` doc — this is the whole implementation,
   * deliberately mirroring the flush-then-await-inflight opening of `submitDraft` below without
   * that function's POST /permits/:id/submit call.
   */
  async function saveDraft (): Promise<void> {
    debouncedPersist.flush()
    await inflight
  }

  /**
   * PMT-009. Flushes any pending autosave, then POSTs /permits/:id/submit.
   *
   * The SERVER'S VERDICT WINS: the client-side gate above is convenience only, so a 400 here is
   * expected even from a wizard that looks green. On failure the error is localized off
   * `errorCode` — never the backend `message`, which joins every failure with '; ' in
   * backend-authored English — and the user is returned to the step that can actually fix it.
   *
   * Resolves with the permit id on success, `undefined` on failure.
   */
  async function submitDraft (): Promise<string | undefined> {
    if (draftId.value === undefined) return undefined
    submitError.value = undefined
    submitFailures.value = EMPTY_SUBMIT_FAILURES

    // Land any debounced edit before submitting, so the server validates what the user sees.
    debouncedPersist.flush()
    await inflight

    const id = draftId.value
    if (id === undefined) return undefined

    const response = await handleLoading(
      async (): Promise<string> => {
        const result = await PermitService.submit(id)
        // wayfinder ticket 008 — "permit submitted" is sanctioned to toast. The detail page's
        // `?submitted=1` banner confirms the state once the user has landed there; this toast
        // confirms the ACTION at the moment it actually happened, during the navigation itself.
        toast.success(i18n.global.t('permit.toast.submitted'))
        return result.data.id
      }, { loadingUnit: submitting }, (error: unknown): void => {
        const mapped = mapError(error)
        submitError.value = mapped
        submitFailures.value = extractSubmitFailures(error)
        toast.error(mapped.message)
        // feat-023. The server can disagree with the client's plan-activation belief (a plan was
        // activated moments ago, after this session's own lookup) — re-fetch so the Position
        // step actually exists to jump to below, instead of staying permanently hidden for the
        // rest of the session on a stale 'none' verdict.
        if (mapped.code === 'PERMIT_POSITION_REQUIRED' && !positionRequired.value) void fetchActive()
        // Resolved against the CURRENT steps array, not a fixed index: the Position step may or
        // may not exist in it depending on `positionRequired`. Assigned directly rather than via
        // goToStep(): goToStep refuses the jump when any EARLIER step fails its own schema, and
        // the whole point of this branch is that the server disagreed with a client-side gate
        // that passed. The user must always land on the step that can fix it, never be stranded
        // on Review with an error they cannot act on.
        const stepKey = stepKeyForSubmitFailure(mapped.code, submitFailures.value)
        const stepIndex = stepKey === undefined ? -1 : steps.value.findIndex((step: IWizardStepDef): boolean => step.key === stepKey)
        if (stepIndex !== -1 && stepIndex <= maxUnlockedStepIndex.value) {
          currentStepIndex.value = stepIndex
        }
      }
    )

    return response
  }

  return {
    steps,
    currentStepIndex,
    currentStep,
    maxUnlockedStepIndex,
    formData,
    checklistAnswers,
    draftId,
    saving,
    submitting,
    submitError,
    submitFailures,
    certificateState,
    certificateProblems,
    recheckCertificates,
    positionState,
    activePlan,
    isFirstStep,
    isLastStep,
    isNextBlocked,
    canSubmit,
    next,
    back,
    goToStep,
    updateFormData,
    updateChecklistAnswers,
    submitDraft,
    saveDraft,
    hydrate
  }
}

export default useWizard
