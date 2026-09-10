import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'

/**
 * wayfinder 062 — the `/workers` list's own "Register worker" modal. `POST /workers` requires
 * only `name`/`role` (`idCardNo`/`phone` optional) — see `ICreateWorkerPayload`.
 */
export const RegisterWorkerSchema = z.object({
  name: z.string().min(1, i18n.global.t('worker.form.validation.nameRequired')),
  role: z.string().min(1, i18n.global.t('worker.form.validation.roleRequired')),
  idCardNo: z.string().optional(),
  phone: z.string().optional()
})

export type TRegisterWorkerFormValues = z.infer<typeof RegisterWorkerSchema>

export function useRegisterWorkerInitialValues (): TRegisterWorkerFormValues {
  return { name: '', role: '', idCardNo: '', phone: '' }
}

export default RegisterWorkerSchema
