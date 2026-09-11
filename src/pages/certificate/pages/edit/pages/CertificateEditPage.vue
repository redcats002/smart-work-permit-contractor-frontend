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
        ref="formRef"
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
        </LabelField>
        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          :label="t('certificate.form.field.certType')"
          name="certType"
          tag="div"
          required>
          <!-- wayfinder 103 — `Worker.role` is removed; `CertTypeSelect` always falls back to its
               full vocabulary now, including whatever certType this record already carries, so
               the page never renders blank and never rewrites an unrecognised stored value. -->
          <CertTypeSelect
            v-model="formData.certType"
            :invalid="invalid"
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
             one. The hint states the rule; the server only re-checks it when this PATCH touches
             licenceNo or filePath (buildPayload/onSubmit mirror that, never beyond it), so an
             edit that leaves both untouched cannot trip this on a pre-095 certificate. -->
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
import { computed, onMounted, ref, useTemplateRef, watch, type ComputedRef, type Ref } from 'vue'
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
import CertTypeSelect from '@/components/certificate/CertTypeSelect.vue'
import type { IFormInstanceWithRegister } from '@/models/Form.model'
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
import { EApiErrorCode } from '@/enums/modules/error/ApiErrorCode.enum'

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
// wayfinder 095/115 — the licenceNo the certificate loaded with, so buildPayload can tell "the
// user changed it" from "it arrived from hydrate and was never touched" (same discipline 045
// established for areaId). Compared against formData.licenceNo, never re-derived from it.
const existingLicenceNo = ref('')
const existingDescription = ref('')

/**
 * wayfinder 117 — see `AddCertificateModal.vue`'s identical pair of watchers for the full
 * explanation: `WorkerPicker` is a plain Vue component, so nothing calls `$pcForm.register()`
 * for it, and only the `<Form>` instance's own public `register`/`setFieldValue` (typed as
 * `IFormInstanceWithRegister` from `@/models/Form.model` — `register` is not on the library's
 * own declared `FormInstance` even though the runtime exposes it) can get `workerId` into the
 * resolver's values.
 * The `<Form v-else>` only mounts once `fetchDetail()` resolves, which is exactly when
 * `formData.value.workerId` is already the real, fetched id — `watch(formRef, …)` fires the
 * moment that happens rather than needing `onMounted`, which would run too early here.
 */
const formRef = useTemplateRef<IFormInstanceWithRegister | null>('formRef')

watch(formRef, (instance: IFormInstanceWithRegister | null): void => {
  if (!instance) return
  instance.register('workerId')
}, { immediate: true })

watch((): number | undefined => formData.value.workerId, (workerId: number | undefined): void => {
  formRef.value?.setFieldValue('workerId', workerId)
})

const certificateId: ComputedRef<number> = computed((): number => Number(route.params.id))

// The create form's schema, reused unchanged. The fields are identical, and a second schema for
// one shape drifts — the two would disagree about the file allowlist first. The one-of rule
// (licenceNo or an attachment) is NOT expressed in this schema at all — see its own comment for
// why — so there is nothing here that would need to differ between create and edit anyway.
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
 *
 * wayfinder 095/115 — `licenceNo`/`description` get the same "omit when untouched" discipline,
 * compared against `existingLicenceNo`/`existingDescription` (what the certificate loaded with),
 * not against a fixed default. This is the whole fix for the trap this ticket names: the server
 * only re-checks the one-of rule when the patch touches `licenceNo` or `filePath`, so a form that
 * resent `licenceNo: ''` for a field nobody touched would trip `CERT_LICENCE_OR_ATTACHMENT_REQUIRED`
 * on every pre-095 certificate. Unlike `filePath` there is no `null` variant for these two on the
 * wire — clearing one means sending `''`, which still counts as "touched" here.
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

  const licenceNo = formData.value.licenceNo.trim()
  if (licenceNo !== existingLicenceNo.value) payload.licenceNo = licenceNo

  const description = formData.value.description.trim()
  if (description !== existingDescription.value) payload.description = description

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

/**
 * wayfinder 095/115 — mirrors the server's one-of rule for feedback, never beyond it: only checked
 * when the built payload actually touches `licenceNo` or `filePath` (exactly the condition under
 * which the server re-checks it), using the FINAL state each would leave the certificate in. A
 * payload that omits both keys always passes — that is the "expiry date alone" case this ticket's
 * own required test covers.
 */
function violatesLicenceOrAttachmentRule (payload: IUpdateCertificatePayload): boolean {
  const touchesGate = 'licenceNo' in payload || 'filePath' in payload
  if (!touchesGate) return false

  const finalLicenceNo = 'licenceNo' in payload ? payload.licenceNo : existingLicenceNo.value
  const finalFilePath = 'filePath' in payload ? payload.filePath : existingFilePath.value
  return !finalLicenceNo && !finalFilePath
}

function onSubmit (event: FormSubmitEvent): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  submitErrorMessage.value = undefined
  handleLoading(async (): Promise<void> => {
    const payload = await buildPayload()
    if (violatesLicenceOrAttachmentRule(payload)) {
      submitErrorMessage.value = mapError({ code: 400, errorCode: EApiErrorCode.CERT_LICENCE_OR_ATTACHMENT_REQUIRED }).message
      return
    }
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
    // wayfinder 095/115 — normalize null to '' AND trim once, here, so formData/existing* stay
    // comparable by simple string equality in buildPayload rather than each caller re-doing
    // `(x ?? '').trim()`. Trimming the server's own value too: a padded stored value must not
    // read as "touched" the moment the user's own (browser-trimmed) input is compared against it.
    const licenceNo = (certificate.licenceNo ?? '').trim()
    const description = (certificate.description ?? '').trim()
    formData.value = {
      workerId: certificate.workerId,
      workerName: certificate.workerName,
      certType: certificate.certType,
      // The API returns full ISO timestamps; the DatePicker binds a Date.
      issuedDate: new Date(certificate.issuedDate),
      expiryDate: new Date(certificate.expiryDate),
      licenceNo,
      description,
      file: undefined
    }
    existingLicenceNo.value = licenceNo
    existingDescription.value = description
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
