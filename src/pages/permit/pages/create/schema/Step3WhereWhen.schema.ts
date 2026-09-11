import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'

/**
 * wayfinder 070/107 — "Where & when" is step 3. Runs against the whole accumulated wizard
 * formData (see useWizard.next()), so this only asserts this step's own keys.
 *
 * `areaId`/`pinId` are deliberately NOT required here, mirroring the pre-107 schemas they came
 * from: area never gates Next/Submit (wayfinder 037's explicit constraint), and whether a pin is
 * REQUIRED depends on async external state (whether an active pin on an active plan exists) that
 * a zod schema can't see — that gate stays in `usePinPreflight`/`useWizard.isNextBlocked`,
 * unchanged by this ticket.
 *
 * `location` is `Permit.location` moved verbatim from `Step2BasicInfo.schema.ts` — same wire
 * field, still required at this app's own wizard-UX level even though it is nullable on the wire
 * (wayfinder 034/070).
 */
const requiredText = (label: string): z.ZodString => z.string().min(1, i18n.global.t('common.validation.requiredField', { label }))

export const Step3WhereWhenFieldsSchema = z.object({
  areaId: z.number().nullable().optional(),
  pinId: z.number().nullable().optional(),
  location: requiredText(i18n.global.t('permit.create.steps.whereWhen.field.locationDetail')),
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
