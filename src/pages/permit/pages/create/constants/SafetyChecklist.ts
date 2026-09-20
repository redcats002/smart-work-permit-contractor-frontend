import type { IPreWorkChecklistAnswer } from '@/models/modules/permit/Permit.model'
import { EPermitType, type TPermitType } from '@/enums/modules/permit/PermitType.enum'

/**
 * Step 3's numbered Yes/No/N-A checklist (design lines 300-311, data at design lines 1875-1924).
 *
 * Persisted since the backend closed `docs/api/GAPS.md` row J — `PATCH /permits/:id` now accepts
 * an optional `preWorkChecklist: Array<{ itemKey, answer }> | null`, and the read side echoes it
 * back on both `GET /permits` and `GET /permits/:id`. The answers still live in `useWizard`'s own
 * `checklistAnswers` ref, OUTSIDE `formData` (see `WizardSteps.ts`'s `IWizardStepProps` doc) — that
 * split predates the fix and is kept rather than restructuring the step components' contract;
 * `toPreWorkChecklistPayload`/`toChecklistAnswerMap` below are the two conversion points between
 * that internal `Record<string, TChecklistAnswer>` shape and the wire array shape.
 *
 * Nothing here gates Next — this is a pre-work reference aid, not a safety gate (product
 * decision: no client-side or server-side gating on checklist content). They also start
 * UNANSWERED — the design prefills every row to `yes`, which would be rubber-stamp UI that proves
 * nothing about the actual worksite.
 */
export type TChecklistAnswer = 'yes' | 'no' | 'na'

export const CHECKLIST_ANSWERS: TChecklistAnswer[] = ['yes', 'no', 'na']

/** Row counts per permit type — the copy itself lives in the locale files, EN + TH. */
export const SAFETY_CHECKLIST_LENGTH: Record<TPermitType, number> = {
  [EPermitType.HOT]: 17,
  [EPermitType.CONFINED]: 13,
  [EPermitType.HEIGHTS]: 14
}

/** `'1' … 'N'` for the given type — used both as the display number and the answer-map key suffix. */
export function checklistNumbers (type: TPermitType): string[] {
  const length = SAFETY_CHECKLIST_LENGTH[type] ?? 0
  return Array.from({ length }, (_unused: unknown, index: number): string => String(index + 1))
}

/** Answer-map key. Namespaced by type so switching permit type never reuses another type's answers. */
export function checklistKey (type: TPermitType, number: string): string {
  return `${type}-${number}`
}

/**
 * `checklistAnswers` (this permit type's rows only) → the wire shape for `PATCH /permits/:id`.
 * Unanswered rows are omitted, not sent as some placeholder answer — the checklist is a reference
 * aid, so a partial answer set is a normal, valid state to persist.
 */
export function toPreWorkChecklistPayload (
  type: TPermitType, answers: Record<string, TChecklistAnswer>
): IPreWorkChecklistAnswer[] {
  return checklistNumbers(type).reduce((items: IPreWorkChecklistAnswer[], number: string): IPreWorkChecklistAnswer[] => {
    const itemKey = checklistKey(type, number)
    const answer = answers[itemKey]
    if (answer) items.push({ itemKey, answer })
    return items
  }, [])
}

/**
 * The wire shape (as hydrated from `permit.preWorkChecklist`) → `checklistAnswers`'s internal
 * `Record<string, TChecklistAnswer>` map. `itemKey` already matches `checklistKey()`'s output
 * exactly, so this is a plain re-key, not a translation.
 */
export function toChecklistAnswerMap (items?: IPreWorkChecklistAnswer[] | null): Record<string, TChecklistAnswer> {
  if (!items) return {}
  return items.reduce((map: Record<string, TChecklistAnswer>, item: IPreWorkChecklistAnswer): Record<string, TChecklistAnswer> => {
    map[item.itemKey] = item.answer
    return map
  }, {})
}
