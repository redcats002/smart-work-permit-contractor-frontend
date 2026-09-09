import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'
import { schema } from '@/utils/Schema'

/**
 * `schema.date()` (src/utils/Schema.ts) accepts a Date (from the DatePicker) or a
 * date-ish string and transforms it to an ISO string — the shape ICertificate expects.
 * Cross-field "expiry after issued" is enforced here, in the schema, via `.refine` on
 * the parsed object — never in a submit handler.
 */
const BaseCertificateSchema = z.object({
  // wayfinder 060 — identity is the Worker id. `workerName` and `role` are gone from the wire:
  // the name is the server's display echo and the role describes the person, not the card.
  // `z.number()` rather than a non-empty string is the whole point — an unresolved name can no
  // longer reach the payload at all.
  workerId: z.number({ message: i18n.global.t('worker.validation.required') }),
  certType: z.string().min(1, i18n.global.t('certificate.form.validation.certTypeRequired')),
  issuedDate: schema.date(i18n.global.t('certificate.form.field.issuedDate')),
  expiryDate: schema.date(i18n.global.t('certificate.form.field.expiryDate')),
  // File selection only — upload itself goes through useUpload()/Upload.provider in the
  // submit handler, not through zod. Deliberately NOT schema.media: that helper requires
  // a non-empty `url`, which a freshly-picked, not-yet-uploaded file can never have.
  file: z
    .instanceof(File)
    .optional()
    .refine((file: File | undefined): boolean => {
      if (!file) return true
      // Mirrors the backend's server-side allowlist (docs/api/GAPS.md row V3) so the user is told
      // locally instead of collecting a 400 FILE_TYPE_NOT_ALLOWED. `image/gif` used to be listed
      // here and is NOT accepted by the API; webp/heic are.
      return ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'application/pdf'].includes(file.type)
    }, i18n.global.t('certificate.form.validation.fileType'))
})

export const AddCertificateSchema = BaseCertificateSchema.refine(
  (data: z.infer<typeof BaseCertificateSchema>): boolean => new Date(data.expiryDate).getTime() > new Date(data.issuedDate).getTime(), {
    message: i18n.global.t('certificate.form.validation.expiryAfterIssued'),
    path: ['expiryDate']
  }
)

/** Post-validation shape (zod's `schema.date()` transforms the picked Date to an ISO string). */
export type TAddCertificateFormValues = z.infer<typeof AddCertificateSchema>

/**
 * Pre-validation shape bound to `<Form :initial-values>` — `issuedDate`/`expiryDate` hold
 * whatever the DatePicker emits (a `Date`, or `undefined` before the user picks one); the
 * resolver only produces the ISO-string `TAddCertificateFormValues` shape once valid.
 */
export interface IAddCertificateFormState {
  workerId: number | undefined
  /** Display seed for the picker when editing; never sent. */
  workerName: string
  certType: string
  issuedDate: Date | undefined
  expiryDate: Date | undefined
  file: File | undefined
}

export function useAddCertificateInitialValues (): IAddCertificateFormState {
  return {
    workerId: undefined,
    workerName: '',
    certType: '',
    issuedDate: undefined,
    expiryDate: undefined,
    file: undefined
  }
}
