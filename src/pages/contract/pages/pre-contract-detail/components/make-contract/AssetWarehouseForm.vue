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
      <LabelField
        :form="$form"
        label="เอกสารหลักทรัพย์"
        name="files"
        tag="div"
        hide-error
        required>
        <UploadInput
          v-model="preAssets[i].files"
          class="border border-dashed border-gray-700 rounded-md"
          detail=""
          icon="material-symbols-light:upload-file-outline"
          icon-class="size-20"
          remove-button-class="text-(--p-gray-4)! border rounded-full border-(--p-gray-4)! p-1"
          remove-icon="solar:trash-bin-2-linear"
          hide-button
          touchable>
          <template #label>
            <span>
              ลากและวางไฟล์ที่นี่ หรือ
              <span class="font-bold underline">เลือกไฟล์</span>
            </span>
          </template>
        </UploadInput>
      </LabelField>
      <LabelField
        :form="$form"
        :name="`${i}.locationId`"
        label="จุดจัดเก็บ"
        hide-error
        required>
        <LocationSelection
          v-model="preAssets[i].locationId"
          :invalid="invalid(i)"
          :name="`${i}.locationId`" />
      </LabelField>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import { toast } from '@/plugins/toast'
import { handleValidate, scrollToFirstError } from '@/utils/HandleSubmit'
import type { IFormType } from '@/models/Form.model'
import LabelField from '@/components/input/LabelField.vue'
import UploadInput from '@/components/input/UploadInput.vue'
import LocationSelection from '@/components/selection/modules/api/location/LocationSelection.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { type PreAssetWarehouseFormValues, type PreAssetWarehouseListFormValues, PreAssetWarehouseSchema } from '../../schema/make-contract.schema'

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
const errors = ref<Record<string, any>[]>([])


function onSubmit (event: FormSubmitEvent): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
}

function invalid (index: number): boolean {
  const found = !!errors.value.find((error: Record<string, any>): boolean => error.path === `${index}.locationId`)
  return found
}

function manualValidateLocation (): boolean {
  try {
    preAssets.value.forEach((asset: PreAssetWarehouseFormValues, index: number): void => {
      if (!asset.locationId) {
        errors.value.push({
          code: 'custom',
          path: `${index}.locationId`,
          message: `กรุณาเลือกจุดจัดเก็บสำหรับหลักทรัพย์ที่ ${index + 1}`
        })
      }
    })
    if (errors.value.length) {
      errors.value.forEach((error: Record<string, any>): void => {
        toast.error(error.message)
      })
      return false
    }
    return true
  } catch (error: unknown) {
    toast.error(`เกิดข้อผิดพลาดในการตรวจสอบข้อมูลจุดจัดเก็บ ${error}`)
    return false
  } finally {
    errors.value = []
  }
}

async function submit (): Promise<boolean> {
  const isValid = manualValidateLocation()
  if (!isValid) return false
  const event = await handleValidate(formRef)
  onSubmit(event)
  return event.valid || false
}

defineExpose<IExposes>({ submit })
</script>
