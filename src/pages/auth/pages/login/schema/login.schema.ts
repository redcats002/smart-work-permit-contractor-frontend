import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'

export const LoginSchema = z.object({
  email: z
    .email(i18n.global.t('platform.auth.validation.emailInvalid'))
    .min(1, i18n.global.t('platform.auth.validation.emailRequired')),
  password: z
    .string()
    .min(1, i18n.global.t('platform.auth.validation.passwordRequired'))
})

export type LoginFormValues = z.infer<typeof LoginSchema>
