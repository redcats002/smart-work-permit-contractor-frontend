import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'
import { schema } from '@/utils/Schema'

/**
 * `schema.date()` (src/utils/Schema.ts) accepts a Date (from the DatePicker) or a
 * date-ish string and transforms it to an ISO string — the shape ICertificate expects.
 * Cross-field "expiry after issued" is enforced here, in the schema, via `.refine` on
 * the parsed object — never in a submit handler.
 *
 * KNOWN, PRE-EXISTING (found while building wayfinder 115, not introduced by it): the
 * `expiryAfterIssued` refine below never actually fires in any of the four forms that use this
 * schema. `workerId` is registered with `@primevue/forms` via a bare
 * `<input type="hidden" name="workerId">` (061's fix for the "no-op trap"), and a plain native
 * `<input>` never calls the Form's own `register()` — only a PrimeVue form-aware component does
 * (checked against `node_modules/@primevue/forms/form/index.mjs`: `register` is exposed via
 * `provide('$pcForm')` and each form-aware component calls it itself via `inject`). So `workerId`
 * is absent from the Form's tracked `_states`/resolver `values` forever, `z.number()` on a
 * missing key fails the schema's BASE object parse every time, and zod does not run a `.refine()`
 * chain past a failed base parse — so `expiryAfterIssued` never executes, in EITHER direction.
 * `event.valid` still reads `true` regardless, because `valid` is computed only over `_states`
 * entries, and `workerId` was never added to `_states` to begin with. 061's own comment ("Without
 * this the resolver never sees workerId... submit silently no-ops") is half right: the hidden
 * input does NOT make the resolver see `workerId` either way — the resolver never sees it. What
 * the hidden input actually fixed was `event.values` itself coming back `undefined` wholesale
 * once a second non-native field existed; every one of these forms' `useCreate()`/`buildPayload()`
 * already reads from `formData` directly rather than the resolver's output, which is why nothing
 * user-visible ever broke. Not fixed here — the blast radius (workerId registration across every
 * WorkerPicker-based form) is well outside wayfinder 115's scope. Reported in this ticket's final
 * write-up rather than silently left for the next session to rediscover.
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
  // wayfinder 095/115. The one-of rule (licenceNo OR an attachment) is NOT expressed as a
  // cross-field .refine here — for the same reason `expiryAfterIssued` above is dead code: it
  // would never run either. Each entry point checks it explicitly in its own onSubmit/buildPayload
  // instead (CertificateEditPage.vue's `violatesLicenceOrAttachmentRule`, and its create-form
  // siblings' own same-shaped check), independent of this schema and of `event.valid`.
  licenceNo: z.string().optional(),
  description: z.string().optional(),
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
  /** wayfinder 095/115 — the licence/permit number on the card. */
  licenceNo: string
  /** wayfinder 095/115 — free text for training/examination detail. */
  description: string
  file: File | undefined
}

export function useAddCertificateInitialValues (): IAddCertificateFormState {
  return {
    workerId: undefined,
    workerName: '',
    certType: '',
    issuedDate: undefined,
    expiryDate: undefined,
    licenceNo: '',
    description: '',
    file: undefined
  }
}
