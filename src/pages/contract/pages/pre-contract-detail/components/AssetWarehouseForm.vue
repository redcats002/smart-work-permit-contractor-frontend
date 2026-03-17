<template>
  <div class="grid grid-cols-1 gap-4">
    <LabelField
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
      label="จุดจัดเก็บ"
      name="locationId"
      placeholder="กรอกจุดจัดเก็บ"
      tag="div"
      hide-error
      required>
      <LocationSelection
        v-model="preAsset.locationId"
        name="locationId"
        placeholder="กรอกจุดจัดเก็บ" />
    </LabelField>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LabelField from '@/components/input/LabelField.vue'
import UploadInput from '@/components/input/UploadInput.vue'
import LocationSelection from '@/components/selection/modules/location/LocationSelection.vue'
import type { PreAssetMakeAContractFormValues } from '../schema/installment.schema'

interface IProps {}

defineProps<IProps>()

const preAsset = defineModel<PreAssetMakeAContractFormValues>({ required: true })

const uploadFiles = ref<File[]>([])
const previewUrls = ref<string[]>([])
</script>
