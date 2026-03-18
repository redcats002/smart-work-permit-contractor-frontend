<template>
  <Form
    ref="formRef"
    v-slot="$form"
    :initial-values="preAsset"
    :resolver="resolver"
    class="grid grid-cols-1 gap-4"
    @submit="onFormSubmit($event)">
    <LabelField
      :form="$form"
      label="เอกสารหลักทรัพย์"
      name="files"
      tag="div"
      hide-error
      required>
      <UploadInput
        v-model="uploadFiles"
        v-model:preview-urls="previewUrls" />
    </LabelField>
    <LabelField
      v-if="preAsset?.locationId !== undefined"
      :form="$form"
      label="จุดจัดเก็บ"
      name="locationId"
      tag="div"
      required>
      <LocationSelection v-model="preAsset.locationId" />
    </LabelField>
  </Form>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import LabelField from '@/components/input/LabelField.vue'
import UploadInput from '@/components/input/UploadInput.vue'
import LocationSelection from '@/components/selection/modules/location/LocationSelection.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { type PreAssetMakeAContractFormValues, PreAssetMakeAContractSchema } from '../schema/installment.schema'

interface IEmits {
  confirmed: []
}
interface IExposes {
  submit: () => void
}

const emit = defineEmits<IEmits>()

const preAsset = defineModel<PreAssetMakeAContractFormValues>({ required: true })

const resolver = zodResolver(PreAssetMakeAContractSchema)
const formRef = useTemplateRef<any>('formRef')
const uploadFiles = ref<File[]>([])
const previewUrls = ref<string[]>([])

function onFormSubmit (event: FormSubmitEvent): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  emit('confirmed')
}

function submit (): void {
  formRef.value?.submit()
}

defineExpose<IExposes>({ submit })
</script>
