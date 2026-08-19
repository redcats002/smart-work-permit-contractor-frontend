import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'
import { schema } from '@/utils/Schema'
import { EPermitType } from '@/enums/modules/permit/PermitType.enum'

/**
 * Gates step 1: `type` must be one of hot/confined/heights before Next unlocks. Runs against the
 * whole accumulated wizard formData (see useWizard.next()), so this only asserts the `type` key —
 * title/foreman/etc belong to Step2BasicInfoSchema.
 */
export const Step1TypeSchema = z.object({
  type: schema.enum(EPermitType, i18n.global.t('permit.create.steps.type.field'))
})
