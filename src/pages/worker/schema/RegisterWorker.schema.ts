import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'

/**
 * wayfinder 062 — the `/workers` list's own "Register worker" modal. `POST /workers` requires
 * only `name` (`idCardNo`/`phone` optional) — see `ICreateWorkerPayload`.
 *
 * wayfinder 103 — `role` removed. A worker is a name; what they do belongs to the permit
 * (`roleOnPermit`), not to the person.
 */
export const RegisterWorkerSchema = z.object({
  name: z.string().min(1, i18n.global.t('worker.form.validation.nameRequired')),
  idCardNo: z.string().optional(),
  phone: z.string().optional()
})

export type TRegisterWorkerFormValues = z.infer<typeof RegisterWorkerSchema>

export function useRegisterWorkerInitialValues (): TRegisterWorkerFormValues {
  return { name: '', idCardNo: '', phone: '' }
}

export default RegisterWorkerSchema
