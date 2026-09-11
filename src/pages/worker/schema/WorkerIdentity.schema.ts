import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'

/**
 * wayfinder 062 — the worker detail page's identity form. Mirrors `PATCH /workers/:id`'s body:
 * every field optional on the wire, but `name` must not be saved blank — the whole point of 059
 * ruling 1 is that a rename here fixes every certificate/permit that references this worker by
 * id, so an accidental blank would corrupt every one of them at once.
 *
 * wayfinder 103 — `role` removed. A worker is a name; what they do belongs to the permit
 * (`roleOnPermit`), not to the person.
 */
export const WorkerIdentitySchema = z.object({
  name: z.string().min(1, i18n.global.t('worker.form.validation.nameRequired')),
  idCardNo: z.string().optional(),
  phone: z.string().optional()
})

export type TWorkerIdentityFormValues = z.infer<typeof WorkerIdentitySchema>

export default WorkerIdentitySchema
