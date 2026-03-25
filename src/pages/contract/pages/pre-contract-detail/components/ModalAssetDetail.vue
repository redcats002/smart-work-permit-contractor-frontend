<template>
  <BaseModal
    v-model="visible"
    class="md:w-240!"
    label="กรอกข้อมูลหลักทรัพย์"
    @open="useInit()">
    <template #default>
      <div class="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
        <Form
          :key="formKey"
          ref="formRef"
          v-slot="$form"
          :initial-values="activeForm"
          :resolver="activeResolver"
          @submit="onSubmit($event)">
          <div>
            <p class="text-base font-bold mb-5">
              รายละเอียดหลักทรัพย์
            </p>
            <VehicleForm
              v-if="isVehicle"
              v-model="form.vehicleForm!"
              v-model:detail="form.detail"
              v-model:type="form.type"
              :asset="asset"
              :form="$form" />
            <LandForm
              v-else-if="isLand"
              v-model="form.realEstateForm!"
              v-model:detail="form.detail"
              v-model:type="form.type"
              :asset="asset"
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
import { computed, onMounted, ref, useTemplateRef, watch } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import { isLandAsset, isVehicleAsset } from '@/enums/modules/asset/AssetType.enum'
import type { IMedia } from '@/resources/provider/Upload.provider'
import FormAction from '@/components/button/FormAction.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import type { ModalLandFormValues } from '../schema/land.schema'
import { ModalLandSchema } from '../schema/land.schema'
import { type PreAssetUpdateValues, useInitForm } from '../schema/pre-asset.schema'
import type { ModalVehicleFormValues } from '../schema/vehicle.schema'
import { ModalVehicleSchema } from '../schema/vehicle.schema'
import ImageSection from './ImageSection.vue'
import LandForm from './LandForm.vue'
import VehicleForm from './VehicleForm.vue'

interface IProps {
  asset: IPreAssetList
  contractId: TBaseParamsId
}

interface IEmits {
  saved: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>({ default: false })
const form = defineModel<PreAssetUpdateValues>('form', { required: true })

const formRef = useTemplateRef<InstanceType<typeof Form> | any>('formRef')

const vehicleResolver = zodResolver(ModalVehicleSchema)
const landResolver = zodResolver(ModalLandSchema)

const pendingClose = ref<(() => void) | null>(null)
const formKey = ref<number>(0)

const existingImages = ref<IMedia[]>([...(props.asset.images || [])])
const newFiles = ref<File[]>([])
const previewUrls = ref<string[]>([])
const removedImageIds = ref<string[]>([])

const activeResolver = computed((): ReturnType<typeof zodResolver> => isVehicle.value ? vehicleResolver : landResolver)
const activeForm = computed((): ModalVehicleFormValues | ModalLandFormValues => {
  if (isVehicle.value) {
    return {
      ...form.value.vehicleForm!,
      detail: form.value.detail,
      type: form.value.type
    }
  }
  return {
    ...form.value.realEstateForm!,
    detail: form.value.detail,
    type: form.value.type
  }
})
const isVehicle = computed((): boolean => isVehicleAsset(props.asset.type))
const isLand = computed((): boolean => isLandAsset(props.asset.type))


function buildVehicleForm (): ModalVehicleFormValues {
  return {
    ...props.asset.vehicleForm,
    plateNo: props.asset.vehicleForm?.plateNo || '',
    province: props.asset.vehicleForm?.province || '',
    manufactureYear: props.asset.vehicleForm?.manufactureYear || '',
    registrationYear: props.asset.vehicleForm?.registrationYear || '',
    vehicleIdentificationNo: props.asset.vehicleForm?.vehicleIdentificationNo || '',
    mileage: props.asset.vehicleForm?.mileage || 0,
    type: props.asset?.type,
    detail: props.asset?.detail || ''
  }
}

function buildLandForm (): ModalLandFormValues {
  return {
    ...props.asset?.realEstateForm,
    subDistrict: props.asset.realEstateForm?.subDistrict || '',
    district: props.asset.realEstateForm?.district || '',
    province: props.asset.realEstateForm?.province || '',
    postCode: props.asset.realEstateForm?.postCode || '',
    urlGoogleMap: props.asset.realEstateForm?.urlGoogleMap || '',
    type: props.asset?.type,
    detail: props.asset?.detail || '',
    landNo: props.asset.realEstateForm?.landNo || '',
    surveyNo: props.asset.realEstateForm?.surveyNo || '',
    aerialPhotoMapNo: props.asset.realEstateForm?.aerialPhotoMapNo || '',
    aerialPhotoSheet: props.asset.realEstateForm?.aerialPhotoSheet || '',
    landAreaRai: props.asset.realEstateForm?.landAreaRai || 0,
    landAreaNgan: props.asset.realEstateForm?.landAreaNgan || 0,
    landAreaSquareWah: props.asset.realEstateForm?.landAreaSquareWah || 0
  }
}

function onClear (): void {
  form.value = useInitForm()
  newFiles.value = []
  previewUrls.value = []
  removedImageIds.value = []
  existingImages.value = [...(props.asset.images || [])]
  toast.success('ล้างข้อมูลสำเร็จ')
  mount()
}

async function useSave (): Promise<void> {
  const formData = new FormData()
  const currentForm = isVehicle.value ? form.value.vehicleForm! : form.value.realEstateForm!

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
  emits('saved')
}

async function onSave (close: () => void): Promise<void> {
  pendingClose.value = close
  formRef.value?.submit()
}

function onSubmit (event: FormSubmitEvent): void {
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

function useInit (): void {
  form.value = {
    vehicleForm: buildVehicleForm(),
    realEstateForm: buildLandForm(),
    detail: props.asset.detail,
    type: props.asset.type,
    images: props.asset.images || []
  }
  mount()
}

function mount (): void {
  formKey.value++
}

onMounted((): void => {
  useInit()
})

watch((): IPreAssetList => props.asset, (): void => {
  form.value.vehicleForm = buildVehicleForm()
  form.value.realEstateForm = buildLandForm()
  existingImages.value = [...(props.asset.images || [])]
  newFiles.value = []
  previewUrls.value = []
  removedImageIds.value = []
  mount()
})
</script>
