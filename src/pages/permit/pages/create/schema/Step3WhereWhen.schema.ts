import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'
import { parseMapCoordinate } from '@/utils/ParseMapCoordinate'

/**
 * wayfinder 070 — "Where & when" becomes step 3. Runs against the whole accumulated wizard
 * formData (see useWizard.next()), so this only asserts this step's own keys.
 *
 * `area`/`position` are deliberately NOT required here, mirroring the pre-070 schemas they came
 * from: area never gates Next/Submit (wayfinder 037's explicit constraint), and whether a pin is
 * REQUIRED depends on async external state (whether a facility plan is active) that a zod schema
 * can't see — that gate stays in `usePlanPosition`/`useWizard.isNextBlocked`, unchanged by this
 * ticket. This schema only shape-checks `position` when it IS present.
 *
 * `mapUrl` is likewise optional at the wizard level (068's ruling: geo is optional at submit) —
 * but wayfinder 070's rule is explicit: "unparseable input is a form error, never a silent
 * no-op". So when it IS present, it must parse — mirroring the api's own parser client-side for
 * instant feedback, never a stricter gate than the server's authoritative re-parse.
 */
const requiredText = (label: string): z.ZodString => z.string().min(1, i18n.global.t('common.validation.requiredField', { label }))

export const Step3WhereWhenFieldsSchema = z.object({
  areaId: z.number().nullable().optional(),
  position: z.union([
    z.object({
      planId: z.number(),
      planX: z.number().min(0).max(100),
      planY: z.number().min(0).max(100)
    }),
    z.null()
  ]).optional(),
  mapUrl: z.string()
    .refine(
      (value: string): boolean => parseMapCoordinate(value).ok, { message: i18n.global.t('permit.create.steps.whereWhen.geo.validation.unparseable') }
    )
    .optional(),
  /** `YYYY-MM-DD` */
  startDate: requiredText(i18n.global.t('permit.create.steps.whereWhen.field.startDate')),
  /** `YYYY-MM-DD` */
  endDate: requiredText(i18n.global.t('permit.create.steps.whereWhen.field.endDate')),
  /** Full ISO datetime, composed from an arbitrary date + the picked daily start time. */
  dailyStart: requiredText(i18n.global.t('permit.create.steps.whereWhen.field.dailyStart')),
  /** Full ISO datetime, composed from an arbitrary date + the picked daily end time. */
  dailyEnd: requiredText(i18n.global.t('permit.create.steps.whereWhen.field.dailyEnd')),
  scheduleNote: z.string().optional()
})

/**
 * `endDate` may not precede `startDate` (mirrors the api's own model-layer rule, wayfinder 067
 * resolution). The daily window's end must be strictly after its start, on the SAME 1970-01-01
 * anchor both ends are compared through — the api's own `dailyStart <= dailyEnd` overlap
 * comparison is the reason a naive full-timestamp compare would be wrong here (067's `@db.Time`
 * decision note); comparing local wall-clock hours/minutes, exactly as extracted for display, is
 * the client-side mirror of that.
 */
export const Step3WhereWhenSchema = Step3WhereWhenFieldsSchema
  .refine(
    (data: z.infer<typeof Step3WhereWhenFieldsSchema>): boolean => {
      const start = new Date(data.startDate).getTime()
      const end = new Date(data.endDate).getTime()
      return !Number.isNaN(start) && !Number.isNaN(end) && end >= start
    }, {
      message: i18n.global.t('permit.create.steps.whereWhen.validation.endDateNotBeforeStart'),
      path: ['endDate']
    }
  )
  .refine(
    (data: z.infer<typeof Step3WhereWhenFieldsSchema>): boolean => {
      const start = new Date(data.dailyStart)
      const end = new Date(data.dailyEnd)
      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false
      const startMinutes = (start.getHours() * 60) + start.getMinutes()
      const endMinutes = (end.getHours() * 60) + end.getMinutes()
      return endMinutes > startMinutes
    }, {
      message: i18n.global.t('permit.create.steps.whereWhen.validation.endAfterStart'),
      path: ['dailyEnd']
    }
  )

export default Step3WhereWhenSchema
