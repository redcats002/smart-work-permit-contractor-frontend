import { z } from 'zod'
import { Step1TypeSchema } from './Step1Type.schema'
import { Step2BasicInfoSchema } from './Step2BasicInfo.schema'
import { Step3SafetyChecksSchema } from './Step3SafetyChecks.schema'
import { Step4PpeWorkersSchema } from './Step4PpeWorkers.schema'
import { Step5JsaSchema } from './Step5Jsa.schema'

/**
 * PMT-009 — step 6 gate.
 *
 * Review has no fields of its own, so it validates the WHOLE draft: it is the composite of every
 * prior step's schema. That is what makes `useWizard.canSubmit` mean something — a user who
 * reached step 6 and then edited an earlier step back into an invalid state must not be able to
 * press Submit.
 *
 * This is still only a client-side convenience. `POST /permits/:id/submit` re-runs its own
 * validation and its verdict wins; a green review here is not a promise the server will accept.
 */
const PRIOR_STEP_SCHEMAS: z.ZodTypeAny[] = [
  Step1TypeSchema,
  Step2BasicInfoSchema,
  Step3SafetyChecksSchema,
  Step4PpeWorkersSchema,
  Step5JsaSchema
]

export const Step6ReviewSchema = z.unknown().superRefine((data: unknown, ctx: z.RefinementCtx): void => {
  for (const schema of PRIOR_STEP_SCHEMAS) {
    const result = schema.safeParse(data)
    if (result.success) continue
    for (const issue of result.error.issues) {
      ctx.addIssue({ code: 'custom', path: issue.path, message: issue.message })
    }
  }
})

export default Step6ReviewSchema
