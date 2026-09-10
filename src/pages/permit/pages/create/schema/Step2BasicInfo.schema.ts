import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'

/**
 * Runs against the whole accumulated wizard formData (see useWizard.next()), so this only
 * asserts the step-2 keys — `type` is step 1's job (Step1Type.schema.ts).
 *
 * wayfinder 070 moved the date/time fields to step 3 ("Where & when") — see
 * `Step3WhereWhen.schema.ts`. This step now only asserts the three free-text fields.
 */
const requiredText = (label: string): z.ZodString => z.string().min(1, i18n.global.t('common.validation.requiredField', { label }))

export const Step2BasicInfoFieldsSchema = z.object({
  title: requiredText(i18n.global.t('permit.create.steps.basicInfo.field.title')),
  foreman: requiredText(i18n.global.t('permit.create.steps.basicInfo.field.foreman')),
  location: requiredText(i18n.global.t('permit.create.steps.basicInfo.field.location'))
})

export const Step2BasicInfoSchema = Step2BasicInfoFieldsSchema

export default Step2BasicInfoSchema
