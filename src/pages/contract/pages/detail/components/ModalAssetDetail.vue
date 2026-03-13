<template>
  <BaseModal
    v-model="visible"
    class="md:w-240!"
    label="กรอกข้อมูลหลักทรัพย์">
    <template #default>
      <div class="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
        <Form
          ref="formRef"
          v-slot="$form"
          :initial-values="activeFormValues"
          :resolver="activeResolver"
          @submit="onFormSubmit($event)">
          <div>
            <p class="text-base font-bold mb-5">
              รายละเอียดหลักทรัพย์
            </p>
            <VehicleForm
              v-if="isVehicle"
              v-model="vehicleForm"
              :form="$form" />
            <LandForm
              v-else-if="isLand"
              v-model="landForm"
              :form="$form" />
          </div>
        </Form>
        <ImageSection
          v-model:existing-images="existingImages"
          v-model:new-files="newFiles"
          v-model:preview-urls="previewUrls"
          v-model:removed-image-ids="removedImageIds" />
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex items-center gap-3">
        <FormAction
          confirm-label="บันทึก"
          @cancel="close()"
          @confirm="onSave(close)">
          <Button
            class="text-sm text-red-500 hover:text-red-700 transition-colors"
            type="button"
            text
            @click="onClear()">
            ล้างข้อมูล
          </Button>
        </FormAction>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IAssetDetailInfo, IPreAssetImage } from '@/models/response/pre-contract/PreContractRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import { isLandAsset, isVehicleAsset } from '@/enums/modules/contract/AssetType.enum'
import FormAction from '@/components/button/FormAction.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import type { LandFormValues } from '../schema/land.schema'
import { LandFormSchema } from '../schema/land.schema'
import type { VehicleFormValues } from '../schema/vehicle.schema'
import { VehicleSchema } from '../schema/vehicle.schema'
import ImageSection from './ImageSection.vue'
import LandForm from './LandForm.vue'
import VehicleForm from './VehicleForm.vue'

interface IProps {
  asset: IAssetDetailInfo
  contractId: TBaseParamsId
}

interface IEmits {
  saved: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>({ default: false })

const formRef = useTemplateRef<InstanceType<typeof Form> | any>('formRef')
const pendingClose = ref<(() => void) | null>(null)

const vehicleResolver = zodResolver(VehicleSchema)
const landResolver = zodResolver(LandFormSchema)

const activeFormValues = computed((): VehicleFormValues | LandFormValues =>
  isVehicle.value ? vehicleForm.value : landForm.value
)
const activeResolver = computed((): ReturnType<typeof zodResolver> => isVehicle.value ? vehicleResolver : landResolver)

const vehicleForm = ref<VehicleFormValues>(buildVehicleForm())
const landForm = ref<LandFormValues>(buildLandForm())

const existingImages = ref<IPreAssetImage[]>([...(props.asset.images || [])])
const newFiles = ref<File[]>([])
const previewUrls = ref<string[]>([])
const removedImageIds = ref<string[]>([])

const isVehicle = computed((): boolean => isVehicleAsset(props.asset.assetType))
const isLand = computed((): boolean => isLandAsset(props.asset.assetType))

function buildVehicleForm (): VehicleFormValues {
  return {
    assetType: props.asset.assetType || '',
    detail: props.asset.detail || '',
    licensePlate: props.asset.licensePlate || '',
    vehicleProvince: props.asset.vehicleProvince || '',
    yearManufactured: props.asset.yearManufactured,
    yearRegistered: props.asset.yearRegistered,
    chassisNumber: props.asset.chassisNumber || '',
    mileage: props.asset.mileage
  }
}

function buildLandForm (): LandFormValues {
  return {
    assetType: props.asset.assetType || '',
    detail: props.asset.detail || '',
    landNumber: props.asset.landNumber || '',
    surveyPageNumber: props.asset.surveyPageNumber || '',
    landLocation: props.asset.landLocation || '',
    subDistrict: props.asset.subDistrict || '',
    district: props.asset.district || '',
    province: props.asset.province || '',
    postCode: props.asset.postCode || '',
    aerialPhotoNumber: props.asset.aerialPhotoNumber || '',
    aerialPhotoSheet: props.asset.aerialPhotoSheet || '',
    areaRai: props.asset.areaRai,
    areaRgan: props.asset.areaRgan,
    areaTarangWa: props.asset.areaTarangWa
  }
}

function onClear (): void {
  vehicleForm.value = buildVehicleForm()
  landForm.value = buildLandForm()
  newFiles.value = []
  previewUrls.value = []
  removedImageIds.value = []
  existingImages.value = [...(props.asset.images || [])]
  toast.success('ล้างข้อมูลสำเร็จ')
}

async function useSave (): Promise<void> {
  const formData = new FormData() // TODO: to use in upload
  const currentForm = isVehicle.value ? vehicleForm.value : landForm.value

  Object.entries(currentForm).forEach(([key, val]: [string, unknown]): void => {
    if (val !== null && val !== undefined) {
      formData.append(key, String(val))
    }
  })

  removedImageIds.value.forEach((id: string): void => {
    formData.append('removedImageIds[]', id)
  })
  newFiles.value.forEach((file: File): void => {
    formData.append('images', file)
  })

  toast.success('บันทึกข้อมูลสำเร็จ')
  emits('saved')
}

async function onSave (close: () => void): Promise<void> {
  pendingClose.value = close
  const val = await formRef.value?.validate()
  onFormSubmit({ ...val, valid: Object.keys(val.errors).length === 0 })
}

function onFormSubmit (event: FormSubmitEvent): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  handleLoading(async (): Promise<void> => {
    await useSave()
    pendingClose.value?.()
    pendingClose.value = null
  })
}

watch((): IAssetDetailInfo => props.asset, (): void => {
  vehicleForm.value = buildVehicleForm()
  landForm.value = buildLandForm()
  existingImages.value = [...(props.asset.images || [])]
  newFiles.value = []
  previewUrls.value = []
  removedImageIds.value = []
})
</script>
