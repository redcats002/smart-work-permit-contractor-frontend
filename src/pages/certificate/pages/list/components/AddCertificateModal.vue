<template>
  <BaseModal
    v-model="visible"
    :label="t('certificate.form.title')">
    <template #default="{ close }">
      <Form
        ref="formRef"
        v-slot="$form"
        :initial-values="formData"
        :resolver="resolver"
        class="grid grid-cols-1 gap-4"
        @submit="onSubmit($event, close)">
        <!-- wayfinder 060/061: a worker is a record, so this is a picker over GET /workers with
             inline create, not two free-text fields. `role` is gone entirely - it describes the
             person and lives on the Worker now. -->
        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          :label="t('worker.picker.label')"
          name="workerId"
          tag="div"
          required>
          <WorkerPicker
            v-model="formData.workerId"
            :initial-name="formData.workerName"
            :invalid="invalid"
            @worker-selected="onWorkerSelected($event)" />
        </LabelField>
        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          :label="t('certificate.form.field.certType')"
          name="certType"
          tag="div"
          required>
          <CertTypeSelect
            v-model="formData.certType"
            :invalid="invalid"
            :role="selectedWorkerRole"
            name="certType" />
        </LabelField>
        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          :label="t('certificate.form.field.issuedDate')"
          name="issuedDate"
          tag="div"
          required>
          <DatePicker
            v-model="formData.issuedDate"
            :invalid="invalid"
            date-format="yy-mm-dd"
            name="issuedDate"
            fluid
            show-icon />
        </LabelField>
        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          :label="t('certificate.form.field.expiryDate')"
          name="expiryDate"
          tag="div"
          required>
          <DatePicker
            v-model="formData.expiryDate"
            :invalid="invalid"
            date-format="yy-mm-dd"
            name="expiryDate"
            fluid
            show-icon />
        </LabelField>
        <!-- wayfinder 095/115 — a certificate needs a licence number OR an attachment, at least
             one. The hint states the rule; `onSubmit` mirrors it explicitly before calling the
             API (not a schema refine — see AddCertificate.schema.ts's own comment on why a
             cross-field refine here would never run), and the server's verdict stays
             authoritative regardless. -->
        <LabelField
          v-slot="{ invalid }"
          :description="t('certificate.form.field.licenceOrAttachmentHint')"
          :form="$form"
          :label="t('certificate.form.field.licenceNo')"
          name="licenceNo"
          tag="div">
          <InputText
            v-model="formData.licenceNo"
            :invalid="invalid"
            :placeholder="t('certificate.form.field.licenceNoPlaceholder')"
            name="licenceNo"
            fluid />
        </LabelField>
        <LabelField
          :form="$form"
          :label="t('certificate.form.field.description')"
          name="description"
          tag="div">
          <Textarea
            v-model="formData.description"
            :placeholder="t('certificate.form.field.descriptionPlaceholder')"
            name="description"
            rows="3"
            fluid />
        </LabelField>
        <LabelField
          :form="$form"
          :label="t('certificate.form.field.file')"
          name="file"
          tag="div">
          <label
            class="flex h-10.5 cursor-pointer items-center justify-center gap-1.5 rounded-md border-[1.5px] border-dashed
              border-border-input px-3 text-sm text-text-tertiary transition-colors hover:border-text-tertiary">
            <span aria-hidden="true">📎</span>
            <span class="truncate">{{ formData.file?.name ?? t('certificate.form.field.filePlaceholder') }}</span>
            <input
              accept="image/png,image/jpeg,image/webp,image/heic,application/pdf"
              class="hidden"
              name="file"
              type="file"
              @change="onFileChange($event)">
          </label>
        </LabelField>
        <ConfirmButton
          id="add-certificate-button"
          :label="t('certificate.form.submit')"
          class="w-full!"
          type="submit" />
      </Form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import { handleLoading } from '@/utils/HandleLoading'
import { toast } from '@/plugins/toast'
import { useApiError } from '@/composables/useApiError'
import useUpload from '@/composables/useUpload'
import BaseModal from '@/components/modal/BaseModal.vue'
import LabelField from '@/components/input/LabelField.vue'
import WorkerPicker from '@/components/worker/WorkerPicker.vue'
import CertTypeSelect from '@/components/certificate/CertTypeSelect.vue'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import { dayjs } from '@/plugins/dayjs.plugin'
import type { IWorker } from '@/models/modules/worker/Worker.model'
import type { IFormInstanceWithRegister } from '@/models/Form.model'
import CertificateProvider, { type ICertificateProvider } from '@/resources/provider/certificate/Certificate.provider'
import {
  AddCertificateSchema,
  useAddCertificateInitialValues,
  type IAddCertificateFormState
} from '@/pages/certificate/schema/AddCertificate.schema'
import { EApiErrorCode } from '@/enums/modules/error/ApiErrorCode.enum'

interface IEmits {
  created: []
}

const emits = defineEmits<IEmits>()

const { t } = useI18n()
const { mapError } = useApiError()
const { getUploadImages } = useUpload()

const CertificateService: ICertificateProvider = new CertificateProvider()

const visible = defineModel<boolean>({ default: false })
const resolver = zodResolver(AddCertificateSchema)
const formData: Ref<IAddCertificateFormState> = ref(useAddCertificateInitialValues())
// wayfinder 086 — filters CertTypeSelect's options. Undefined until a worker is actually picked,
// which is the "unknown role" case CertTypeSelect already falls back to the full list for.
const selectedWorkerRole: Ref<string | undefined> = ref(undefined)

/**
 * wayfinder 117 — `WorkerPicker` is a plain Vue component, not a component that extends
 * `@primevue/core`'s `BaseEditableHolder`, so nothing calls `$pcForm.register()` on its behalf
 * the way it does automatically for `InputText`/`Select`/`DatePicker` (checked against
 * `node_modules/@primevue/core/baseeditableholder/index.mjs`). Registering it explicitly through
 * the `<Form>` instance's own public API (`register`/`setFieldValue` — see `IFormInstanceWithRegister`
 * in `@/models/Form.model` for why `register` needs its own type: it is not on the library's
 * declared `FormInstance` even though the runtime exposes it) is what actually gets `workerId`
 * into the resolver's `values`; a native `<input type="hidden">` bound to
 * `:value="formData.workerId"` (061's original attempt) never did, because `register()`'s own
 * `onChange` handler expects a `{ value }`-shaped payload (mirroring how `BaseEditableHolder`'s
 * `writeValue()` calls it), not a raw DOM event whose `event.target.value` would only ever be a
 * string — wrong shape for this schema's `z.number()` regardless.
 */
const formRef = useTemplateRef<IFormInstanceWithRegister | null>('formRef')

watch(formRef, (instance: IFormInstanceWithRegister | null): void => {
  if (!instance) return
  instance.register('workerId')
}, { immediate: true })

watch((): number | undefined => formData.value.workerId, (workerId: number | undefined): void => {
  formRef.value?.setFieldValue('workerId', workerId)
})

function resetForm (): void {
  formData.value = useAddCertificateInitialValues()
  selectedWorkerRole.value = undefined
}

function onWorkerSelected (worker: IWorker | undefined): void {
  selectedWorkerRole.value = worker?.role
}

function onFileChange (event: Event): void {
  const input = event.target as HTMLInputElement
  formData.value.file = input.files?.[0]
  input.value = ''
}

/**
 * Uploads the picked file (if any) via the existing Upload.provider / useUpload
 * composable, then creates the certificate. An already-expired expiryDate is
 * intentionally NOT rejected here — the record is the truth; CertificateCard
 * badges it as Expired via certificateStatus() once the list refreshes.
 *
 * The attachment is sent as the storage **path**, not the `fileUrl`: that URL is a presigned
 * handle that expires 60 seconds after upload (REVIEW-2026-08-19 S4), so storing it stores a
 * dead link. `useUpload` no longer fabricates a success on a failed upload — it now rethrows,
 * which propagates out of this function before `CertificateService.create` is ever called, so
 * `onSubmit`'s `handleLoading` error callback surfaces the real (localized) failure and no
 * certificate is saved. A second, narrower guard below covers the case where `getUploadImages`
 * resolves without throwing but still has no usable path (e.g. an upload response missing
 * `originalName`, which `useUpload` skips splicing) — that must abort too, not save silently
 * without the attachment the user asked for.
 *
 * wayfinder 086 — reads every field from `formData`, never the Form's emitted `event.values`.
 * `certType` (now `CertTypeSelect`, a component rather than an `<input>`, same as `WorkerPicker`)
 * joins `workerId` in tripping the exact trap 061 already recorded once for
 * `CertificateEditPage.vue`: once a second non-native field sits in this `<Form>`, `event.values`
 * comes back `undefined` ENTIRELY, not just for that field — this modal was silently vulnerable
 * to the same failure the whole time `WorkerPicker` was its only such field, just never
 * triggered, because nothing had exercised it until this ticket's own no-op-trap test did.
 */
async function useCreate (): Promise<void> {
  let filePath: string | undefined

  if (formData.value.file) {
    const file = formData.value.file
    const [uploaded] = await getUploadImages([{
      file,
      isNew: true,
      name: file.name,
      url: '',
      path: ''
    }])
    filePath = uploaded?.path || undefined
    if (!filePath) throw new Error('Certificate attachment upload did not return a storage path')
  }

  await CertificateService.create({
    workerId: formData.value.workerId as number,
    certType: formData.value.certType,
    issuedDate: dayjs(formData.value.issuedDate).format('YYYY-MM-DD'),
    expiryDate: dayjs(formData.value.expiryDate).format('YYYY-MM-DD'),
    licenceNo: formData.value.licenceNo.trim() || undefined,
    description: formData.value.description.trim() || undefined,
    filePath
  })
}

/**
 * wayfinder 095/115 — mirrors the server's one-of rule for feedback, never beyond it: at creation
 * there is no existing attachment to fall back on, so "a licence number, or a picked file" is the
 * whole rule, unconditionally. Checked explicitly here rather than in the zod schema — see
 * AddCertificate.schema.ts's own comment on why a cross-field `.refine()` on this schema never
 * actually runs in any of these forms.
 */
function violatesLicenceOrAttachmentRule (): boolean {
  return !formData.value.licenceNo.trim() && !formData.value.file
}

function onSubmit (event: FormSubmitEvent, close: () => void): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  if (violatesLicenceOrAttachmentRule()) {
    toast.error(mapError({ code: 400, errorCode: EApiErrorCode.CERT_LICENCE_OR_ATTACHMENT_REQUIRED }).message)
    return
  }
  handleLoading(async (): Promise<void> => {
    await useCreate()
    emits('created')
    resetForm()
    close()
  }, {}, (error: unknown): void => {
    toast.error(mapError(error).message)
  })
}
</script>

<style scoped>

</style>
