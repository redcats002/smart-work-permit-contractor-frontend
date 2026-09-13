import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'

/**
 * `POST /permits/:id/extend` — `endDate` (date-only) and `dailyEnd` (time-only) are validated
 * as `Date` here, exactly as their `DatePicker`s emit; the ISO/`YYYY-MM-DD` wire conversion is
 * done in `ExtendPermitModal.vue`'s submit handler with the same `Step3WhereWhen.vue`-style
 * local-time composition, not through a zod `.transform()` — `endDate` and `dailyEnd` need
 * DIFFERENT wire shapes (`YYYY-MM-DD` vs a full `1970-01-01`-anchored ISO datetime), so one
 * shared transform would get one of the two wrong.
 *
 * The two cross-field `.refine()`s below mirror the server's own gate on this route (a new end
 * instant must be after now and not before the permit's start) — a client mirror for instant
 * feedback, never a gate beyond what the server checks itself on submit.
 */
export const ExtendPermitFieldsSchema = z.object({
  endDate: z.date({ message: i18n.global.t('common.validation.requiredField', { label: i18n.global.t('permit.detail.extend.field.endDate') }) }),
  dailyEnd: z.date({ message: i18n.global.t('common.validation.requiredField', { label: i18n.global.t('permit.detail.extend.field.dailyEnd') }) })
})

export type TExtendPermitFormValues = z.infer<typeof ExtendPermitFieldsSchema>

/** Pre-validation shape — `ExtendPermitModal.vue` seeds both fields from the permit's CURRENT
 * `endDate`/`dailyEnd` (never a blank default), so there is no `useXInitialValues()` helper here
 * unlike `RequestClose.schema.ts` — the "initial value" is permit-specific, not a constant. */
export interface IExtendPermitFormState {
  endDate: Date | undefined
  dailyEnd: Date | undefined
}

/** Same local-time splice `usePermitCountdown.ts`'s `computeWorkWindowEnd` uses, on raw `Date`s instead of ISO strings. */
export function combineEndInstant (endDate: Date, dailyEnd: Date): number {
  const combined = new Date(endDate)
  combined.setHours(dailyEnd.getHours(), dailyEnd.getMinutes(), 0, 0)
  return combined.getTime()
}

/**
 * `startAt` is the permit's own start instant (`startDate` + `dailyStart`, same composition),
 * captured once when the modal opens — this schema is built per-open, not module-level, because
 * the gate depends on which permit is being extended.
 */
export function createExtendPermitSchema (startAt: number): z.ZodType<TExtendPermitFormValues> {
  return ExtendPermitFieldsSchema
    .refine(
      (data: TExtendPermitFormValues): boolean => combineEndInstant(data.endDate, data.dailyEnd) > Date.now(), {
        message: i18n.global.t('permit.detail.extend.validation.endInFuture'),
        path: ['dailyEnd']
      }
    )
    .refine(
      (data: TExtendPermitFormValues): boolean => combineEndInstant(data.endDate, data.dailyEnd) >= startAt, {
        message: i18n.global.t('permit.detail.extend.validation.notBeforeStart'),
        path: ['endDate']
      }
    )
}

export default createExtendPermitSchema
