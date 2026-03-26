<template>
  <Form
    :key="formKey"
    ref="formRef"
    v-slot="$form"
    :initial-values="preAssets"
    :resolver="resolver"
    @submit="onSubmit($event)">
    <div
      v-for="(_, i) in preAssets"
      v-show="activeIndex === i"
      :key="`asset-warehouse-form-${i}`"
      class="grid grid-cols-1 gap-4">
      <!-- <LabelField
        v-if="false"
        :form="$form"
        label="เอกสารหลักทรัพย์"
        name="files"
        tag="div"
        hide-error
        required>
        <UploadInput
          v-model="uploadFiles"
          v-model:preview-urls="previewUrls" />
      </LabelField> -->
      <LabelField
        v-slot="{ invalid }"
        :form="$form"
        label="จุดจัดเก็บ"
        name="locationId"
        hide-error
        required>
        <LocationSelection
          v-model="preAssets[activeIndex].locationId"
          :invalid="invalid"
          name="locationId" />
      </LabelField>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { handleValidate, scrollToFirstError } from '@/utils/HandleSubmit'
import type { IFormType } from '@/models/Form.model'
import LabelField from '@/components/input/LabelField.vue'
// import UploadInput from '@/components/input/UploadInput.vue'
import LocationSelection from '@/components/selection/modules/location/LocationSelection.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { type PreAssetWarehouseListFormValues, PreAssetWarehouseSchema } from '../schema/make-contract.schema'

interface IProps {
  formKey: number
  activeIndex: number
}
interface IEmits {
  submit: []
}
interface IExposes {
  submit: () => Promise<boolean>
}

defineEmits<IEmits>()
withDefaults(defineProps<IProps>(), {})

const preAssets = defineModel<PreAssetWarehouseListFormValues>({ required: true })

const resolver = zodResolver(PreAssetWarehouseSchema)
const formRef = useTemplateRef<IFormType>('formRef')
// const uploadFiles = ref<File[]>([])
// const previewUrls = ref<string[]>([])

function onSubmit (event: FormSubmitEvent): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
}

async function submit (): Promise<boolean> {
  const event = await handleValidate(formRef)
  onSubmit(event)
  return event.valid || false
}

defineExpose<IExposes>({ submit })
</script>
