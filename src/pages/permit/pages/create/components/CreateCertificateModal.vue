<template>
  <BaseModal
    v-model="visible"
    :label="t('certificate.form.title')">
    <template #default="{ close }">
      <Form
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
            :invalid="invalid" />
          <!-- The Form tracks fields by registered input name, and WorkerPicker is a component,
               not an <input>. Without this the resolver never sees workerId, the schema's
               `z.number()` fails on undefined, and submit silently no-ops. -->
          <input
            :value="formData.workerId"
            name="workerId"
            type="hidden">
        </LabelField>
        <LabelField
          v-model="formData.certType"
          :form="$form"
          :label="t('certificate.form.field.certType')"
          name="certType"
          required />
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

        <!--
          wayfinder ticket 004: upload/create failures render INLINE beside the field, never a
          toast — the sanctioned toast here (PROMPT-LOG.md session 11) is success only.
        -->
        <p
          v-if="submitErrorMessage"
          class="rounded-lg border border-status-rejected-border bg-status-rejected-bg px-3.5 py-2.5
            text-[12.5px] font-semibold text-status-rejected-fg-emphasis"
          role="alert">
          <span aria-hidden="true">⛔</span> {{ submitErrorMessage }}
        </p>

        <ConfirmButton
          id="create-certificate-from-wizard-button"
          :label="t('certificate.form.submit')"
          class="w-full!"
          type="submit" />
      </Form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
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
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import CertificateProvider, { type ICertificateProvider } from '@/resources/provider/certificate/Certificate.provider'
import {
  AddCertificateSchema,
  useAddCertificateInitialValues,
  type IAddCertificateFormState,
  type TAddCertificateFormValues
} from '@/pages/certificate/schema/AddCertificate.schema'

/**
 * wayfinder ticket 004 — "create a certificate without leaving the wizard". Patterned on
 * `src/pages/certificate/pages/list/components/AddCertificateModal.vue` (same schema, same
 * upload flow), NOT a straight reuse of that component: this modal is scoped to the permit
 * module (no cross-module page import — AGENTS.md's parallel-tree module boundary) and surfaces
 * upload/create failures INLINE rather than via toast, per this ticket's explicit constraint.
 *
 * Emits the created row itself — the caller (Step4PpeWorkers.vue) splices it straight into the
 * worker-name AutoComplete's suggestion cache instead of refetching the certificate list.
 */
interface IEmits {
  created: [certificate: ICertificate]
}

const emits = defineEmits<IEmits>()

const { t } = useI18n()
const { mapError } = useApiError()
const { getUploadImages } = useUpload()

const CertificateService: ICertificateProvider = new CertificateProvider()

const visible = defineModel<boolean>({ default: false })
const resolver = zodResolver(AddCertificateSchema)
const formData: Ref<IAddCertificateFormState> = ref(useAddCertificateInitialValues())
const submitErrorMessage: Ref<string | undefined> = ref(undefined)

function resetForm (): void {
  formData.value = useAddCertificateInitialValues()
  submitErrorMessage.value = undefined
}

function onFileChange (event: Event): void {
  const input = event.target as HTMLInputElement
  formData.value.file = input.files?.[0]
  input.value = ''
}

/**
 * Same shape as `AddCertificateModal.vue`'s `useCreate` — the attachment is sent as the storage
 * **path**, never the presigned `fileUrl`, which dies 60s after upload. The API persists it since
 * wayfinder 056, so there is no "not stored" caveat any more.
 */
async function useCreate (values: TAddCertificateFormValues): Promise<{ certificate: ICertificate }> {
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

  const response = await CertificateService.create({
    workerId: formData.value.workerId as number,
    certType: values.certType,
    issuedDate: values.issuedDate,
    expiryDate: values.expiryDate,
    filePath
  })

  return { certificate: response.data }
}

function onSubmit (event: FormSubmitEvent, close: () => void): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  submitErrorMessage.value = undefined
  handleLoading(async (): Promise<void> => {
    const { certificate } = await useCreate(event.values as TAddCertificateFormValues)
    emits('created', certificate)
    resetForm()
    close()
    // Sanctioned toast (PROMPT-LOG.md session 11: "a certificate created from the permit form") —
    // the new row is not visible anywhere on screen once the modal closes, unlike the certificate
    // list page, which just re-renders with it.
    toast.success(t('certificate.form.submit'))
  }, {}, (error: unknown): void => {
    // INLINE, never a toast — this covers the four upload refusal codes
    // (FILE_TYPE_NOT_ALLOWED / FILE_TOO_LARGE / UPLOAD_FOLDER_NOT_ALLOWED / STORAGE_UNAVAILABLE)
    // and any other create failure, all localized off `errorCode` by `mapError`.
    submitErrorMessage.value = mapError(error).message
  })
}
</script>

<style scoped>
</style>
