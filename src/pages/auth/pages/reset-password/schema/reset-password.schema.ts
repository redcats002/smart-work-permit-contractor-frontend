import { regex } from '@/utils/Regex'
import i18n from '@/plugins/I18n.plugin'
import type { IResetPasswordPayload } from '@/models/request/auth/public/AuthReq.public.model'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import z from 'zod'

export const ResetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: i18n.global.t('platform.auth.resetPassword.validation.passwordLength') })
    .max(16, { message: i18n.global.t('platform.auth.resetPassword.validation.passwordLength') })
    .refine((value: string): boolean => regex.upperCaseOneCharRegex.test(value), {
      message: i18n.global.t('platform.auth.resetPassword.validation.passwordUpper')
    })
    .refine((value: string): boolean => regex.atLeastOneNumber.test(value), {
      message: i18n.global.t('platform.auth.resetPassword.validation.passwordNumber')
    }),
  confirmNewPassword: z.string().min(1, i18n.global.t('platform.auth.resetPassword.validation.confirmRequired'))
})

export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>

export function useResetPasswordResolver () {
  const baseResolver = zodResolver(ResetPasswordSchema)

  return async (options: { values: Record<string, unknown>, names?: string[] }): Promise<Record<string, unknown>> => {
    const result = await baseResolver(options) as unknown as Record<string, unknown>
    const errors = (result.errors ?? {}) as Record<string, unknown[]>
    const values = options.values as unknown as Pick<IResetPasswordPayload, 'newPassword' | 'confirmNewPassword'>

    if (values.confirmNewPassword && values.newPassword && values.newPassword !== values.confirmNewPassword) {
      errors.confirmNewPassword ??= []
      errors.confirmNewPassword.push({ message: i18n.global.t('platform.auth.resetPassword.validation.confirmMismatch') })
    }

    return { ...result, errors }
  }
}

export function useResetPasswordInitialValues (): ResetPasswordFormValues {
  return {
    newPassword: '',
    confirmNewPassword: ''
  }
}
