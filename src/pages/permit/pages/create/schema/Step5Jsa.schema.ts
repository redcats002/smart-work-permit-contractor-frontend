import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'
import { EJsaPhase, type TJsaPhase } from '@/enums/modules/permit/JsaPhase.enum'
import type { IJsaStep } from '@/models/modules/permit/Permit.model'

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
 *
 * wayfinder ticket 001. A row where all three fields are blank is not flagged here — it is the
 * "add row" button's own placeholder, dropped silently at serialization (`toSubmittableJsaSteps`
 * below), never sent to the server. Only a PARTIALLY filled row — someone who started typing and
 * stopped — blocks Next/Submit, because silently dropping THAT row would lose real input.
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

/** The "add row" placeholder — none of the three fields have been touched. Not an error; dropped. */
export function jsaRowBlank (row: IJsaDraft): boolean {
  return !row.step?.trim() && !row.hazard?.trim() && !row.control?.trim()
}

/** Started but not finished — the one shape that must never reach the wire (see below) or the schema above. */
function jsaRowPartial (row: IJsaDraft): boolean {
  return !jsaRowComplete(row) && !jsaRowBlank(row)
}

/**
 * wayfinder ticket 001. True when SENDING `jsaSteps` at all would be unsafe this round — not
 * because a filtered array would 400 (it would not; see `toSubmittableJsaSteps`), but because
 * `PATCH /permits/:id` REPLACES `jsaSteps` WHOLESALE (AGENTS.md). A partial row is real, unfinished
 * work the user is mid-typing; if it were simply filtered out of the outgoing array like a blank
 * row is, the PATCH would overwrite the permit's persisted `jsaSteps` with a copy missing that
 * row's already-complete siblings too, up to and including deleting the entire persisted list the
 * moment a single row anywhere is left mid-edit. The caller's job is to skip sending `jsaSteps`
 * entirely while this is true, not to send a smaller array.
 */
export function hasPartialJsaRow (rows: IJsaDraft[]): boolean {
  return rows.some((row: IJsaDraft): boolean => jsaRowPartial(row))
}

export const Step5JsaSchema = z
  .object({
    jsaSteps: z.array(JsaStepShape).optional()
  })
  .superRefine((data: { jsaSteps?: IJsaDraft[] }, ctx: z.RefinementCtx): void => {
    const rows = data.jsaSteps ?? []

    rows.forEach((row: IJsaDraft, index: number): void => {
      // A blank row is dropped at serialization, never sent — it must not block the wizard.
      // Only a row that is started but not finished (partial) is a real validation failure.
      if (!jsaRowPartial(row)) return
      ctx.addIssue({
        code: 'custom',
        path: ['jsaSteps', index],
        message: i18n.global.t('permit.create.steps.jsa.validation.incompleteRow')
      })
    })
  })

/**
 * wayfinder ticket 001. Drops every blank ("add row" placeholder) row and recomputes `sortOrder`
 * per phase over the survivors, so dropping a row never leaves a gap (0, 1, 2, … within each
 * phase) — matching the per-phase numbering Step5Jsa.vue already keeps in the reactive form state.
 *
 * CALL THIS ONLY WHEN `hasPartialJsaRow(rows)` IS FALSE. It also filters out a partial row as a
 * defensive default (never emit a row that would 400), but the caller must not rely on that: on a
 * wholesale-replace endpoint, filtering a partial row out of the array still SENDS the array, which
 * overwrites the permit's persisted `jsaSteps` with one missing that row and would delete already-
 * saved siblings. `hasPartialJsaRow` true means "skip the `jsaSteps` key on this PATCH entirely",
 * not "send a smaller array" — see its own doc comment.
 */
export function toSubmittableJsaSteps (rows: IJsaStep[]): IJsaStep[] {
  const seen: Partial<Record<TJsaPhase, number>> = {}
  return rows
    .filter((row: IJsaStep): boolean => jsaRowComplete(row))
    .map((row: IJsaStep): IJsaStep => {
      const position = seen[row.phase] ?? 0
      seen[row.phase] = position + 1
      return { ...row, sortOrder: position }
    })
}

export default Step5JsaSchema
