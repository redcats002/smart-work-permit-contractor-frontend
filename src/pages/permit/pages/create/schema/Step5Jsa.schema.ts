import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'
import { EJsaPhase } from '@/enums/modules/permit/JsaPhase.enum'

/**
 * PMT-008 — step 5 gate.
 *
 * There is deliberately NO minimum row count. "At least one JSA row before Next" shipped here
 * originally from this item's acceptance list, and the product owner DROPPED it
 * (../PROMPT-LOG.md, session 2): it was never in the backend contract — `PATCH /permits/:id`
 * accepts an empty `jsaSteps` array and `POST /permits/:id/submit` does not check the JSA at all
 * (docs/api/openapi.json) — and a client-only rule must not block a submission the server would
 * accept. Do not re-add it: with `jsaSteps` starting empty it was a hard dead end, the only step
 * in the wizard that could not be passed by filling in what is on screen.
 *
 * The per-row `minLength: 1` checks below are NOT invented and stay: `step`, `hazard` and
 * `control` are all required with `minLength: 1` on the wire, so a half-filled row would 400.
 */
const JsaStepShape = z.object({
  id: z.number().optional(),
  phase: z.enum(EJsaPhase),
  step: z.string().optional(),
  hazard: z.string().optional(),
  control: z.string().optional(),
  sortOrder: z.number().optional()
})

interface IJsaDraft {
  step?: string
  hazard?: string
  control?: string
}

export function jsaRowComplete (row: IJsaDraft): boolean {
  return Boolean(row.step?.trim()) && Boolean(row.hazard?.trim()) && Boolean(row.control?.trim())
}

export const Step5JsaSchema = z
  .object({
    jsaSteps: z.array(JsaStepShape).optional()
  })
  .superRefine((data: { jsaSteps?: IJsaDraft[] }, ctx: z.RefinementCtx): void => {
    const rows = data.jsaSteps ?? []

    rows.forEach((row: IJsaDraft, index: number): void => {
      if (!jsaRowComplete(row)) {
        ctx.addIssue({
          code: 'custom',
          path: ['jsaSteps', index],
          message: i18n.global.t('permit.create.steps.jsa.validation.incompleteRow')
        })
      }
    })
  })

export default Step5JsaSchema
