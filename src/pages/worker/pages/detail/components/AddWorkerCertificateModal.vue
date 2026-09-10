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
        <!-- The worker is already known (this is THEIR detail page) — no picker, just the same
             shared schema/name-registration the other two forms use (wayfinder 061). -->
        <p class="rounded-lg bg-surface-app px-3.5 py-2.5 text-sm text-text-secondary">
          {{ worker.name }}
        </p>
        <input
          :value="formData.workerId"
          name="workerId"
          type="hidden">
        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          :label="t('certificate.form.field.certType')"
          name="certType"
          tag="div"
          required>
          <!-- wayfinder 086 — the worker is already known (this is THEIR detail page), so the
               role is available immediately, unlike the other three entry points. -->
          <CertTypeSelect
            v-model="formData.certType"
            :invalid="invalid"
            :role="worker.role"
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

        <p
          v-if="submitErrorMessage"
          class="rounded-lg border border-status-rejected-border bg-status-rejected-bg px-3.5 py-2.5
            text-[12.5px] font-semibold text-status-rejected-fg-emphasis"
          role="alert">
          <span aria-hidden="true">⛔</span> {{ submitErrorMessage }}
        </p>

        <ConfirmButton
          :label="t('certificate.form.submit')"
          class="w-full!"
          type="submit" />
      </Form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import { handleLoading } from '@/utils/HandleLoading'
import { useApiError } from '@/composables/useApiError'
import useUpload from '@/composables/useUpload'
import BaseModal from '@/components/modal/BaseModal.vue'
import LabelField from '@/components/input/LabelField.vue'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import CertTypeSelect from '@/components/certificate/CertTypeSelect.vue'
import { dayjs } from '@/plugins/dayjs.plugin'
import type { IWorker } from '@/models/modules/worker/Worker.model'
import CertificateProvider, { type ICertificateProvider } from '@/resources/provider/certificate/Certificate.provider'
import {
  AddCertificateSchema,
  useAddCertificateInitialValues,
  type IAddCertificateFormState
} from '@/pages/certificate/schema/AddCertificate.schema'
import { EApiErrorCode } from '@/enums/modules/error/ApiErrorCode.enum'

/**
 * wayfinder 062 — "adding one from here uses 061's form with the worker pre-selected." Same
 * shared `AddCertificate.schema.ts` the standalone modal and the in-wizard one use (061's "one
 * schema, three forms"), scoped to this module rather than importing the certificate module's
 * own modal component — matching `CreateCertificateModal.vue`'s precedent of not crossing the
 * parallel-tree module boundary for a page-level component.
 */
interface IProps {
  worker: IWorker
}

interface IEmits {
  created: [certificate: { id: number }]
}

const props = defineProps<IProps>()
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
  formData.value = { ...useAddCertificateInitialValues(), workerId: props.worker.id, workerName: props.worker.name }
  submitErrorMessage.value = undefined
}

// Reseeds workerId every time the modal opens — the worker prop is stable per page, but this
// keeps the contract explicit rather than relying on a mount-time-only default.
watch(visible, (isVisible: boolean): void => {
  if (isVisible) resetForm()
})

function onFileChange (event: Event): void {
  const input = event.target as HTMLInputElement
  formData.value.file = input.files?.[0]
  input.value = ''
}

/**
 * wayfinder 086 — reads every field from `formData`, never the Form's emitted `event.values`.
 * `CertTypeSelect` is now this form's only non-native (component-based, not `<input>`) field
 * with a registered `name`, and per 061's recorded trap that alone is enough to make
 * `event.values` come back `undefined` entirely.
 */
async function useCreate (): Promise<{ id: number }> {
  let filePath: string | undefined

  if (formData.value.file) {
    const file = formData.value.file
    const [uploaded] = await getUploadImages([{ file, isNew: true, name: file.name, url: '', path: '' }])
    filePath = uploaded?.path || undefined
    if (!filePath) throw new Error('Certificate attachment upload did not return a storage path')
  }

  const response = await CertificateService.create({
    workerId: props.worker.id,
    certType: formData.value.certType,
    issuedDate: dayjs(formData.value.issuedDate).format('YYYY-MM-DD'),
    expiryDate: dayjs(formData.value.expiryDate).format('YYYY-MM-DD'),
    licenceNo: formData.value.licenceNo.trim() || undefined,
    description: formData.value.description.trim() || undefined,
    filePath
  })
  return { id: response.data.id }
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
  submitErrorMessage.value = undefined
  if (violatesLicenceOrAttachmentRule()) {
    submitErrorMessage.value = mapError({ code: 400, errorCode: EApiErrorCode.CERT_LICENCE_OR_ATTACHMENT_REQUIRED }).message
    return
  }
  handleLoading(async (): Promise<void> => {
    const certificate = await useCreate()
    emits('created', certificate)
    resetForm()
    close()
  }, {}, (error: unknown): void => {
    submitErrorMessage.value = mapError(error).message
  })
}
</script>

<style scoped></style>
