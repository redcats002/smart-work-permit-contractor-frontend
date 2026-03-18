import { regex } from '@/utils/Regex'
import type { IRegisterPayload } from '@/models/request/auth/public/AuthReq.public.model'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { z } from 'zod'

export const RegisterSchema = z.object({
  email: z.email('รูปแบบอีเมลไม่ถูกต้อง').min(1, 'กรุณากรอกอีเมล'),
  password: z
    .string()
    .min(8, { message: 'ต้องมีตัวอักษรภาษาอังกฤษ และตัวเลข รวมกันอย่างน้อย 8 ถึง 16 ตัว' })
    .max(16, { message: 'ต้องมีตัวอักษรภาษาอังกฤษ และตัวเลข รวมกันอย่างน้อย 8 ถึง 16 ตัว' })
    .refine((value: string): boolean => regex.upperCaseOneCharRegex.test(value), {
      message: 'ต้องมีอักษรภาษาอังกฤษพิมพ์ใหญ่อย่างน้อย 1 ตัว'
    })
    .refine((value: string): boolean => regex.atLeastOneNumber.test(value), {
      message: 'ต้องมี 0-9 อย่างน้อย 1 ตัว'
    }),
  confirmPassword: z.string().min(1, 'กรุณากรอกยืนยันรหัสผ่าน')
})

export type RegisterFormValues = z.infer<typeof RegisterSchema>

export function useRegisterResolver () {
  const baseResolver = zodResolver(RegisterSchema)

  return async (options: { values: Record<string, unknown>, names?: string[] }): Promise<Record<string, unknown>> => {
    const result = await baseResolver(options) as unknown as Record<string, unknown>
    const errors = (result.errors ?? {}) as Record<string, unknown[]>
    const values = options.values as unknown as IRegisterPayload

    if (
      values.confirmPassword
      && values.password
      && values.password !== values.confirmPassword
    ) {
      errors.confirmPassword ??= []
      errors.confirmPassword.push({ message: 'รหัสผ่านกับยืนยันรหัสผ่านไม่ตรงกัน' })
    }

    return { ...result, errors }
  }
}

export function useFormInitialValues (): RegisterFormValues {
  return {
    email: '',
    password: '',
    confirmPassword: ''
  }
}
