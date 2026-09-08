import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'

/**
 * wayfinder ticket 037 — "propose an area" modal, patterned on `AddCertificate.schema.ts`. Name
 * only: `POST /v1/areas` also accepts an optional default `position`, but the in-wizard modal
 * deliberately does not collect one (see `CreateAreaModal.vue`'s doc comment).
 */
export const CreateAreaSchema = z.object({
  name: z.string().min(1, i18n.global.t('permit.create.steps.position.area.proposeModal.validation.nameRequired'))
})

export type TCreateAreaFormValues = z.infer<typeof CreateAreaSchema>

export interface ICreateAreaFormState {
  name: string
}

export function useCreateAreaInitialValues (): ICreateAreaFormState {
  return { name: '' }
}
