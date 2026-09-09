<template>
  <div>
    <div class="border-b border-border px-4 py-5 md:px-8 md:py-6">
      <RouterLink
        :to="{ name: 'CertificateDetailPage', params: { id: certificateId } }"
        class="text-xs text-text-tertiary hover:text-text-secondary">
        ← {{ t('certificate.detail.title') }}
      </RouterLink>
      <h1 class="mt-1 text-xl font-bold tracking-tight text-text-primary md:text-[22px]">
        {{ t('certificate.edit.title') }}
      </h1>
    </div>

    <div class="px-4 py-6 md:px-8">
      <Skeleton
        v-if="loading"
        class="rounded-xl!"
        height="24rem" />

      <div
        v-else-if="loadFailed"
        class="rounded-lg border border-status-rejected-border bg-status-rejected-bg p-4 text-sm text-status-rejected-fg">
        {{ t('certificate.detail.error.loadFailed') }}
      </div>

      <Form
        v-else
        v-slot="$form"
        :initial-values="formData"
        :resolver="resolver"
        class="grid max-w-2xl grid-cols-1 gap-4"
        @submit="onSubmit($event)">
        <!-- Re-points the certificate at a DIFFERENT worker. Correcting a person's spelling is
             a Worker rename, not an edit here (wayfinder 060) — which is why the name is a seed
             for the picker rather than an editable field. -->
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
          <!-- Three states, matching the three the PATCH body can express. `removeFile` is a
               separate flag rather than "an empty input means clear", because an empty input is
               overwhelmingly "I am not touching the file" — making that mean deletion would lose
               an attachment on every unrelated edit. -->
          <p
            v-if="existingFilePath && !removeFile"
            class="mb-1.5 flex items-center gap-1 text-xs text-text-secondary">
            <span aria-hidden="true">📎</span>
            {{ t('certificate.edit.currentFile') }}
          </p>

          <label
            class="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border-input px-3 text-sm text-text-secondary">
            <span aria-hidden="true">📎</span>
            <span class="truncate">
              {{ formData.file?.name ?? (existingFilePath && !removeFile
                ? t('certificate.edit.replaceFile')
                : t('certificate.form.field.filePlaceholder')) }}
            </span>
            <input
              accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
              class="hidden"
              name="file"
              type="file"
              @change="onFileChange($event)">
          </label>

          <p
            v-if="existingFilePath && !formData.file"
            class="mt-1 text-xs text-text-tertiary">
            {{ removeFile ? t('certificate.edit.removeFileHint') : t('certificate.edit.keepFileHint') }}
          </p>

          <button
            v-if="existingFilePath && !formData.file"
            class="mt-1.5 text-xs text-status-rejected-fg underline"
            data-test="toggle-remove-attachment"
            type="button"
            @click="removeFile = !removeFile">
            {{ removeFile ? t('certificate.edit.undoRemoveFile') : t('certificate.edit.removeFile') }}
          </button>
        </LabelField>

        <p
          v-if="submitErrorMessage"
          class="text-sm text-status-rejected-fg">
          {{ submitErrorMessage }}
        </p>

        <div class="flex gap-2">
          <ConfirmButton
            id="save-certificate-button"
            :label="t('certificate.edit.submit')"
            data-test="save-certificate"
            type="submit" />
          <Button
            class="rounded-lg! text-sm!"
            severity="secondary"
            type="button"
            @click="goBack()">
            {{ t('certificate.edit.cancel') }}
          </Button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import DatePicker from '@/volt/DatePicker.vue'
import Button from '@/volt/Button.vue'
import Skeleton from 'primevue/skeleton'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import LabelField from '@/components/input/LabelField.vue'
import WorkerPicker from '@/components/worker/WorkerPicker.vue'
import { dayjs } from '@/plugins/dayjs.plugin'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import { useApiError } from '@/composables/useApiError'
import useUpload from '@/composables/useUpload'
import {
  AddCertificateSchema,
  useAddCertificateInitialValues,
  type IAddCertificateFormState
} from '@/pages/certificate/schema/AddCertificate.schema'
import type { IUpdateCertificatePayload } from '@/models/request/certificate/CertificateReq.model'
import CertificateProvider, { type ICertificateProvider } from '@/resources/provider/certificate/Certificate.provider'

const CertificateService: ICertificateProvider = new CertificateProvider()

const { t } = useI18n()
const { mapError } = useApiError()
const { getUploadImages } = useUpload()
const route = useRoute()
const router = useRouter()

const formData = ref<IAddCertificateFormState>(useAddCertificateInitialValues()) as Ref<IAddCertificateFormState>
const existingFilePath = ref<string | null>(null)
const removeFile = ref(false)
const loading = ref(true)
const loadFailed = ref(false)
const submitErrorMessage = ref<string | undefined>(undefined)

const certificateId: ComputedRef<number> = computed((): number => Number(route.params.id))

// The create form's schema, reused unchanged. The fields are identical, and a second schema for
// one shape drifts — the two would disagree about the file allowlist first.
const resolver = zodResolver(AddCertificateSchema)

function onFileChange (event: Event): void {
  const input = event.target as HTMLInputElement
  formData.value.file = input.files?.[0]
  // Picking a replacement supersedes a pending removal; the two cannot both be true.
  if (formData.value.file) removeFile.value = false
  input.value = ''
}

function goBack (): void {
  void router.push({ name: 'CertificateDetailPage', params: { id: certificateId.value } })
}

/**
 * Builds the PATCH body so the attachment's three cases stay distinct:
 *
 * - a newly picked file  → upload it, send the new path
 * - `removeFile` toggled → send an explicit `null` to detach
 * - neither              → OMIT `filePath` entirely, so the server leaves it alone
 *
 * Sending `undefined` and omitting are the same on the wire, but building the key conditionally
 * says which case is intended at the point it is decided.
 */
async function buildPayload (): Promise<IUpdateCertificatePayload> {
  // Read from `formData`, not from the Form's emitted `values`. Every field here is v-model-bound,
  // and workerId comes from a component rather than a registered input — mixing the two sources
  // was how this silently sent `undefined` once the picker landed. Dates are converted here
  // because the wire wants `YYYY-MM-DD` and the DatePicker binds a Date.
  const payload: IUpdateCertificatePayload = {
    workerId: formData.value.workerId,
    certType: formData.value.certType,
    issuedDate: dayjs(formData.value.issuedDate).format('YYYY-MM-DD'),
    expiryDate: dayjs(formData.value.expiryDate).format('YYYY-MM-DD')
  }

  if (formData.value.file) {
    const file = formData.value.file
    const [uploaded] = await getUploadImages([{ file, isNew: true, name: file.name, url: '', path: '' }])
    // Same guard as the create form: `useUpload` rethrows a failed upload, and this covers the
    // narrower case where it resolves without a usable path. Aborting is right — saving the text
    // fields while silently dropping the replacement the user picked is the worse outcome.
    if (!uploaded?.path) throw new Error('Certificate attachment upload did not return a storage path')
    payload.filePath = uploaded.path
  } else if (removeFile.value) {
    payload.filePath = null
  }

  return payload
}

function onSubmit (event: FormSubmitEvent): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  submitErrorMessage.value = undefined
  handleLoading(async (): Promise<void> => {
    const payload = await buildPayload()
    await CertificateService.update(certificateId.value, payload)
    toast.success(t('certificate.edit.saved'))
    goBack()
  }, {}, (error: unknown): void => {
    // Inline rather than a toast, matching CreateCertificateModal: this covers the upload refusal
    // codes as well as the update itself, and all of them are localized off `errorCode`.
    submitErrorMessage.value = mapError(error).message
  })
}

async function fetchDetail (): Promise<void> {
  loading.value = true
  loadFailed.value = false
  try {
    const response = await CertificateService.detail(certificateId.value)
    const certificate = response.data
    formData.value = {
      workerId: certificate.workerId,
      workerName: certificate.workerName,
      certType: certificate.certType,
      // The API returns full ISO timestamps; the DatePicker binds a Date.
      issuedDate: new Date(certificate.issuedDate),
      expiryDate: new Date(certificate.expiryDate),
      file: undefined
    }
    existingFilePath.value = certificate.filePath
  } catch {
    // 403 as well as 404 — the route is scoped server-side to the owning contractor.
    loadFailed.value = true
  } finally {
    loading.value = false
  }
}

onMounted((): void => {
  void fetchDetail()
})
</script>

<style scoped></style>
