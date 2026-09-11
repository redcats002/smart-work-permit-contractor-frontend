import { z } from 'zod'
import i18n from '@/plugins/I18n.plugin'
import { schema } from '@/utils/Schema'

/**
 * `schema.date()` (src/utils/Schema.ts) accepts a Date (from the DatePicker) or a
 * date-ish string and transforms it to an ISO string — the shape ICertificate expects.
 *
 * wayfinder 117 — CORRECTING 061/086's comment, previously repeated in all four forms that use
 * this schema: *"without this [hidden input] the resolver never sees workerId... submit silently
 * no-ops."* That is false in a misleading way. Traced against
 * `node_modules/@primevue/core/baseeditableholder/index.mjs` and
 * `node_modules/@primevue/forms/useform/index.mjs`: a form-aware PrimeVue component (anything
 * extending `BaseEditableHolder` — `InputText`, `Select`, `DatePicker`, …) self-registers via an
 * `immediate` watcher on its injected `$pcForm`/`$formName` that calls
 * `this.$pcForm.register(name, formControl)` itself. **A plain native `<input>` never runs that
 * watcher and never calls `register()` either** — so 061's bare `<input type="hidden"
 * name="workerId">` did NOT fix the thing its own comment claimed. `workerId` was absent from
 * the Form's tracked `_states` (and therefore the resolver's `values`) both BEFORE and AFTER that
 * hidden input existed. `z.number()` on the missing key failed this schema's BASE object parse
 * on every submit, and zod never runs a `.refine()` chain past a failed base parse — so the
 * `expiryAfterIssued` rule that used to sit below (see git history) never executed either,
 * PRE-DATING wayfinder 095/115/117 entirely. `event.valid` read `true` regardless throughout,
 * because it is computed only over registered `_states` entries, and `workerId` was never one.
 * Nothing user-visible ever broke only because every one of these forms' `useCreate()`/
 * `buildPayload()` already reads from `formData` directly rather than the resolver's output.
 *
 * **Fixed properly in all four entry points** (`AddCertificateModal.vue`, `CertificateEditPage.vue`,
 * `CreateCertificateModal.vue`, `AddWorkerCertificateModal.vue`), not in this schema: each one
 * calls the `<Form>` instance's own `register('workerId')`/`setFieldValue('workerId', …)` — the
 * same public API `@primevue/forms` exposes for exactly this "a component owns the value, not a
 * native input" case — rather than repeating 061's native-`<input>` non-fix. `workerId` now
 * reaches the resolver's `values` for real; see each file's own comment and its no-op-trap test.
 *
 * **`expiryAfterIssued` was removed rather than revived.** Registering `workerId` properly means
 * every currently-dead cross-field `.refine()` on this schema would start firing — there was
 * exactly one, `expiryAfterIssued` (issued/expiry ordering). Checked against the api
 * (`smart-work-permit-api/src/modules/certificate/commands/{create,update}/{create,update}.model.ts`
 * and `.service.ts`): the server has **no ordering check on these two dates at all**, in either
 * direction. Shipping this rule as a submission-blocking `.refine()` would therefore refuse a
 * PATCH/POST the server accepts outright — exactly the shape the standing invariant forbids ("a
 * client may mirror a rule for instant feedback, never gate beyond it"; here there is no server
 * rule to mirror). Reported as a finding, not shipped: if the product owner wants this enforced,
 * it belongs in the api first, this schema second. Do not re-add it as a client-only gate.
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
  // wayfinder 095/115/117. The one-of rule (licenceNo OR an attachment) is NOT expressed as a
  // cross-field .refine here — `file`'s `<input type="file">` is a plain native input with no
  // Form registration of its own (same class of gap 117 fixed for `workerId`, deliberately left
  // alone here: 115 already chose a plain JS check on purpose, not a refine that would only ever
  // see `file` as undefined and wrongly demand licenceNo alone). Each entry point checks it
  // explicitly in its own onSubmit/buildPayload instead (CertificateEditPage.vue's
  // `violatesLicenceOrAttachmentRule`, and its create-form siblings' own same-shaped check),
  // independent of this schema and of `event.valid`.
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

// wayfinder 117 — was `BaseCertificateSchema.refine(expiryAfterIssued)`. Removed rather than
// revived; see this file's top comment for why (no server-side counterpart, so a live version of
// this rule would refuse a PATCH/POST the server accepts). `AddCertificateSchema` is exported
// under its existing name so none of the four entry points that import it need to change.
export const AddCertificateSchema = BaseCertificateSchema

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
