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
        <LabelField
          v-model="formData.workerName"
          :form="$form"
          :label="t('certificate.form.field.workerName')"
          name="workerName"
          required />
        <LabelField
          v-model="formData.role"
          :form="$form"
          :label="t('certificate.form.field.role')"
          name="role"
          required />
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
              accept="image/png,image/jpeg,image/gif,application/pdf"
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
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import CertificateProvider, { type ICertificateProvider } from '@/resources/provider/certificate/Certificate.provider'
import {
  AddCertificateSchema,
  useAddCertificateInitialValues,
  type IAddCertificateFormState,
  type TAddCertificateFormValues
} from '@/pages/certificate/schema/AddCertificate.schema'

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

function resetForm (): void {
  formData.value = useAddCertificateInitialValues()
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
 */
async function useCreate (values: TAddCertificateFormValues): Promise<void> {
  let fileRef: string | undefined

  if (formData.value.file) {
    const file = formData.value.file
    const [uploaded] = await getUploadImages([{
      file,
      isNew: true,
      name: file.name,
      url: '',
      path: ''
    }])
    fileRef = uploaded?.url
  }

  await CertificateService.create({
    workerName: values.workerName,
    role: values.role,
    certType: values.certType,
    issuedDate: values.issuedDate,
    expiryDate: values.expiryDate,
    fileRef
  })
}

function onSubmit (event: FormSubmitEvent, close: () => void): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  handleLoading(async (): Promise<void> => {
    await useCreate(event.values as TAddCertificateFormValues)
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
