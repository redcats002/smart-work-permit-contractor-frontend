import { regex } from '@/utils/Regex'
import type { IResetPasswordPayload } from '@/models/request/auth/public/AuthReq.public.model'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import z from 'zod'

export const ResetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: 'ต้องมีตัวอักษรภาษาอังกฤษ และตัวเลข รวมกันอย่างน้อย 8 ถึง 16 ตัว' })
    .max(16, { message: 'ต้องมีตัวอักษรภาษาอังกฤษ และตัวเลข รวมกันอย่างน้อย 8 ถึง 16 ตัว' })
    .refine((value: string): boolean => regex.upperCaseOneCharRegex.test(value), {
      message: 'ต้องมีอักษรภาษาอังกฤษพิมพ์ใหญ่อย่างน้อย 1 ตัว'
    })
    .refine((value: string): boolean => regex.atLeastOneNumber.test(value), {
      message: 'ต้องมี 0-9 อย่างน้อย 1 ตัว'
    }),
  confirmNewPassword: z.string().min(1, 'กรุณากรอกยืนยันรหัสผ่าน')
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
      errors.confirmNewPassword.push({ message: 'รหัสผ่านกับยืนยันรหัสผ่านไม่ตรงกัน' })
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
