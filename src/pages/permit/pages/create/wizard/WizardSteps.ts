import type { Component } from 'vue'
import type { z } from 'zod'
import type { IUpdatePermitDraftPayload } from '@/models/request/permit/PermitReq.model'
import type { TChecklistAnswer } from '../constants/SafetyChecklist'
import type { ISubmitFailures } from '../constants/SubmitErrorRouting'
import type { ICertificateProblem, TCertificatePreflightState } from '../composables/useCertificatePreflight'
import type { TPositionPreflightState } from '../composables/usePinPreflight'
import { Step1TypeSchema } from '../schema/Step1Type.schema'
import { Step2BasicInfoSchema } from '../schema/Step2BasicInfo.schema'
import { Step3WhereWhenSchema } from '../schema/Step3WhereWhen.schema'
import { Step3SafetyChecksSchema } from '../schema/Step3SafetyChecks.schema'
import { Step4PpeWorkersSchema } from '../schema/Step4PpeWorkers.schema'
import { Step5JsaSchema } from '../schema/Step5Jsa.schema'
import { Step6ReviewSchema } from '../schema/Step6Review.schema'
import Step1Type from '../components/steps/Step1Type.vue'
import Step2BasicInfo from '../components/steps/Step2BasicInfo.vue'
import Step3WhereWhen from '../components/steps/Step3WhereWhen.vue'
import Step3SafetyChecks from '../components/steps/Step3SafetyChecks.vue'
import Step4PpeWorkers from '../components/steps/Step4PpeWorkers.vue'
import Step5Jsa from '../components/steps/Step5Jsa.vue'
import Step6Review from '../components/steps/Step6Review.vue'

/**
 * The contract every step component (real or stub) is rendered with by
 * PermitCreatePage.vue. `formData` is the whole accumulated draft — a step
 * only reads the slice it cares about — and `update:formData` emits a patch
 * that useWizard merges in and debounce-persists. Steps 1-4/5 do not need to
 * know about persistence, drafts, or navigation at all.
 */
export interface IWizardStepProps {
  title: string
  formData: IUpdatePermitDraftPayload
  /**
   * Step 3's Yes/No/N-A checklist answers, keyed `<type>-<number>`. Held OUTSIDE `formData` even
   * though `preWorkChecklist` is now a real PATCH field (`docs/api/GAPS.md` row J closed) — that
   * split predates the fix and is kept rather than restructuring every step component's contract;
   * `useWizard.doPersist` maps this ref to the wire shape via `SafetyChecklist.ts`'s
   * `toPreWorkChecklistPayload` on every autosave. Steps other than 3 ignore it.
   */
  checklistAnswers: Record<string, TChecklistAnswer>
  /**
   * The draft's server-assigned permit id (`WP-HOT-20260625-001`), once the first
   * POST /permits has resolved. Only step 6 renders it; it is undefined until step 2 satisfies
   * `hasCreatableDraft()`.
   */
  draftId?: string
  /**
   * Per-item failures from the last rejected submit. Steps 3 and 4 highlight the exact readings
   * and workers the SERVER named — which may disagree with the client-side gate, and when it
   * does, the server is right.
   */
  submitFailures: ISubmitFailures
  /**
   * CRT-004. The wizard's single shared certificate pre-flight verdict (`useWizard`, backed by
   * `useCertificatePreflight`). Step 4 uses it to mark blocking workers; step 6 uses it for the
   * review row. Never authoritative — the server's answer on submit always wins.
   */
  certificateState: TCertificatePreflightState
  certificateProblems: ICertificateProblem[]
  /**
   * wayfinder 107 (feat-023's original gate). The wizard's single shared position pre-flight
   * (`useWizard`, backed by `usePinPreflight`) — mirrors `certificateState` exactly. `whereWhen`'s
   * `PinPicker` and the Review row both read this, so they can never disagree.
   */
  positionState: TPositionPreflightState
}

export interface IWizardStepEmits {
  'update:formData': [patch: Partial<IUpdatePermitDraftPayload>]
  'update:checklistAnswers': [patch: Record<string, TChecklistAnswer>]
  /**
   * wayfinder ticket 004. A certificate was created without leaving step 4 — the worker list
   * itself did not change, so `useWizard`'s watch on `formData.workers`'s array reference never
   * fires on its own. This tells `useWizard` to re-run the shared pre-flight immediately, so the
   * worker the certificate was just created for doesn't sit red for another edit cycle.
   */
  'recheck-certificates': []
}

export interface IWizardStepDef {
  /** Stable key — used for :key in v-for and nowhere else (no routing on it). */
  key: string
  /** i18n key under permit.wizard.step.* — also reused as the step's on-screen title. */
  labelKey: string
  component: Component
  /**
   * Validates the relevant slice of `formData` for this step. Steps 1-3 are real
   * (PMT-005/PMT-006); the rest still ship a placeholder (`z.object({})`, always
   * passes) — see the schema files under ../schema/ for the follow-up item that
   * replaces each one.
   */
  schema: z.ZodTypeAny
}

/**
 * The single source of truth for the wizard shell. StepperHeader, WizardFooter
 * and useWizard all derive their behavior from this array — adding a step's
 * real content later means editing its component + schema file, never this
 * list's consumers.
 *
 * wayfinder 070 — "Where & when" moves to position 3, unconditionally: `useWizard.steps` no
 * longer filters ANY entry out of this array (it used to hide `position`, formerly step 7,
 * whenever no facility plan was active — see `usePinPreflight`, wayfinder 107's rename of
 * `usePlanPosition`). Review is always last. The
 * component/schema FILENAMES for the safety/PPE/JSA/review steps still carry their OLD numbers
 * (`Step3SafetyChecks.vue` is step 4 here) — deliberately not renamed, since the ticket's scope
 * is the order and content of the steps, not their filenames; `labelKey` below is what actually
 * drives on-screen numbering.
 */
export const WIZARD_STEPS: IWizardStepDef[] = [
  { key: 'type', labelKey: 'permit.wizard.step.1', component: Step1Type, schema: Step1TypeSchema },
  { key: 'basicInfo', labelKey: 'permit.wizard.step.2', component: Step2BasicInfo, schema: Step2BasicInfoSchema },
  { key: 'whereWhen', labelKey: 'permit.wizard.step.3', component: Step3WhereWhen, schema: Step3WhereWhenSchema },
  { key: 'safetyChecks', labelKey: 'permit.wizard.step.4', component: Step3SafetyChecks, schema: Step3SafetyChecksSchema },
  { key: 'ppeWorkers', labelKey: 'permit.wizard.step.5', component: Step4PpeWorkers, schema: Step4PpeWorkersSchema },
  { key: 'jsa', labelKey: 'permit.wizard.step.6', component: Step5Jsa, schema: Step5JsaSchema },
  { key: 'review', labelKey: 'permit.wizard.step.7', component: Step6Review, schema: Step6ReviewSchema }
]

export default WIZARD_STEPS
