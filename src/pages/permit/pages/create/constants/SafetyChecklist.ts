import { EPermitType, type TPermitType } from '@/enums/modules/permit/PermitType.enum'

/**
 * Step 3's numbered Yes/No/N-A checklist (design lines 300-311, data at design lines 1875-1924).
 *
 * ⚠ NOT PERSISTED. The permit wire contract has no field for these answers — `PATCH /permits/:id`
 * declares only `title, location, foreman, workDate, workTimeStart, workTimeEnd, outdoorWork,
 * jsaSteps, workers, safetyReading, photos` (docs/api/openapi.json), and Elysia strips unknown
 * keys. So the answers deliberately live in `useWizard`'s own state, NEVER in `formData` — putting
 * them there would be a type lie that rides along on every PATCH and is silently discarded.
 * Tracked as `docs/api/GAPS.md` row J (`api-adds`).
 *
 * Because nothing persists them and the backend cannot act on them, they do NOT gate Next.
 * They also start UNANSWERED — the design prefills every row to `yes`, which would be
 * rubber-stamp UI that proves nothing about the actual worksite.
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
