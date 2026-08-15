import type { Component } from 'vue'
import type { z } from 'zod'
import type { IUpdatePermitDraftPayload } from '@/models/request/permit/PermitReq.model'
import { Step1TypeSchema } from '../schema/Step1Type.schema'
import { Step2BasicInfoSchema } from '../schema/Step2BasicInfo.schema'
import { Step3SafetyChecksSchema } from '../schema/Step3SafetyChecks.schema'
import { Step4PpeWorkersSchema } from '../schema/Step4PpeWorkers.schema'
import { Step5JsaSchema } from '../schema/Step5Jsa.schema'
import { Step6ReviewSchema } from '../schema/Step6Review.schema'
import Step1Type from '../components/steps/Step1Type.vue'
import Step2BasicInfo from '../components/steps/Step2BasicInfo.vue'
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
}

export interface IWizardStepEmits {
  'update:formData': [patch: Partial<IUpdatePermitDraftPayload>]
}

export interface IWizardStepDef {
  /** Stable key — used for :key in v-for and nowhere else (no routing on it). */
  key: string
  /** i18n key under permit.wizard.step.* — also reused as the step's on-screen title. */
  labelKey: string
  component: Component
  /**
   * Validates the relevant slice of `formData` for this step. Every step here
   * ships a placeholder (`z.object({})`, always passes) — see the schema files
   * under ../schema/ for the follow-up item that replaces each one.
   */
  schema: z.ZodTypeAny
}

/**
 * The single source of truth for the wizard shell. StepperHeader, WizardFooter
 * and useWizard all derive their behavior from this array — adding a step's
 * real content later means editing its component + schema file, never this
 * list's consumers.
 */
export const WIZARD_STEPS: IWizardStepDef[] = [
  { key: 'type', labelKey: 'permit.wizard.step.1', component: Step1Type, schema: Step1TypeSchema },
  { key: 'basicInfo', labelKey: 'permit.wizard.step.2', component: Step2BasicInfo, schema: Step2BasicInfoSchema },
  { key: 'safetyChecks', labelKey: 'permit.wizard.step.3', component: Step3SafetyChecks, schema: Step3SafetyChecksSchema },
  { key: 'ppeWorkers', labelKey: 'permit.wizard.step.4', component: Step4PpeWorkers, schema: Step4PpeWorkersSchema },
  { key: 'jsa', labelKey: 'permit.wizard.step.5', component: Step5Jsa, schema: Step5JsaSchema },
  { key: 'review', labelKey: 'permit.wizard.step.6', component: Step6Review, schema: Step6ReviewSchema }
]

export default WIZARD_STEPS
