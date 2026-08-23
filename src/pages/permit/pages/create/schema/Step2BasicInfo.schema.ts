import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'

/**
 * Runs against the whole accumulated wizard formData (see useWizard.next()), so this only
 * asserts the step-2 keys — `type` is step 1's job (Step1Type.schema.ts).
 *
 * These are the same 6 fields (plus `type`, gated by step 1) that `hasCreatableDraft`
 * (useWizard.ts) checks before the first `POST /permits` fires — see PMT-005's brief, trap 5:
 * "keep the schema at least as strict as `hasCreatableDraft`". Values here are wire-shaped
 * strings (not the DatePicker's `Date`) because this is what actually reaches useWizard's
 * `formData` ref and gets sent to the API as-is — Step2BasicInfo.vue owns converting the
 * pickers' `Date` values to these strings before it emits a patch.
 */
const requiredText = (label: string): z.ZodString => z.string().min(1, i18n.global.t('common.validation.requiredField', { label }))

export const Step2BasicInfoFieldsSchema = z.object({
  title: requiredText(i18n.global.t('permit.create.steps.basicInfo.field.title')),
  foreman: requiredText(i18n.global.t('permit.create.steps.basicInfo.field.foreman')),
  location: requiredText(i18n.global.t('permit.create.steps.basicInfo.field.location')),
  /** `YYYY-MM-DD` */
  workDate: requiredText(i18n.global.t('permit.create.steps.basicInfo.field.workDate')),
  /** Full ISO datetime, composed from `workDate` + the picked start time. */
  workTimeStart: requiredText(i18n.global.t('permit.create.steps.basicInfo.field.workTimeStart')),
  /** Full ISO datetime, composed from `workDate` + the picked end time. */
  workTimeEnd: requiredText(i18n.global.t('permit.create.steps.basicInfo.field.workTimeEnd'))
})

/** End must be strictly after start (acceptance list) — enforced here, never in a submit handler. */
export const Step2BasicInfoSchema = Step2BasicInfoFieldsSchema.refine(
  (data: z.infer<typeof Step2BasicInfoFieldsSchema>): boolean => {
    const start = new Date(data.workTimeStart).getTime()
    const end = new Date(data.workTimeEnd).getTime()
    return !Number.isNaN(start) && !Number.isNaN(end) && end > start
  }, {
    message: i18n.global.t('permit.create.steps.basicInfo.validation.endAfterStart'),
    path: ['workTimeEnd']
  }
)
