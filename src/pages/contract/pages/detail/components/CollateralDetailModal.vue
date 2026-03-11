<template>
  <BaseModal
    v-model="visible"
    class="md:w-240!"
    label="กรอกข้อมูลหลักทรัพย์">
    <template #default>
      <div class="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-8">
        <!-- Left: type-specific form -->
        <div>
          <p class="text-base font-bold mb-5">
            รายละเอียดหลักทรัพย์
          </p>
          <VehicleForm
            v-if="isVehicle"
            v-model="vehicleForm" />
          <LandForm
            v-else-if="isLand"
            v-model="landForm" />
        </div>

        <!-- Right: image upload -->
        <div>
          <p class="text-base font-bold mb-5">
            รูปหลักทรัพย์
          </p>

          <!-- Upload dropzone -->
          <div
            class="border border-dashed border-surface-300 rounded-md p-6 flex flex-col
              items-center gap-2 mb-4">
            <Icon
              class="size-12 text-surface-400"
              icon="solar:gallery-add-bold" />
            <p class="text-sm text-surface-600 text-center">
              อัปโหลดรูปภาพสินค้า
            </p>
            <p class="text-xs text-surface-400 text-center">
              ไฟล์สามารถอัปโหลดได้ JPG, JPEG และ PNG
            </p>
          </div>

          <!-- Upload button -->
          <button
            class="flex items-center justify-center gap-2 w-full border border-primary
              text-primary rounded-sm h-9 text-sm font-medium hover:bg-primary
              hover:text-white transition-colors mb-4"
            type="button"
            @click="fileInputRef?.click()">
            <Icon icon="mdi:plus" />
            อัปโหลดรูปภาพ
          </button>
          <input
            ref="fileInputRef"
            accept=".jpg,.jpeg,.png"
            type="file"
            hidden
            multiple
            @change="onFileChange($event)">

          <!-- Existing images -->
          <div class="space-y-2">
            <div
              v-for="img in existingImages"
              :key="`existing-${img.id}`"
              class="flex items-center gap-2 border border-surface-200 rounded-md p-2">
              <img
                :src="img.url"
                class="size-10 object-cover rounded shrink-0">
              <span class="flex-1 text-sm truncate text-surface-700">{{ img.name }}</span>
              <button
                class="shrink-0"
                type="button"
                @click="removeExistingImage(img.id)">
                <Icon
                  class="size-5 text-red-400 hover:text-red-600 transition-colors"
                  icon="solar:trash-bin-minimalistic-bold" />
              </button>
            </div>

            <!-- New files -->
            <div
              v-for="(file, i) in newFiles"
              :key="`new-${i}`"
              class="flex items-center gap-2 border border-surface-200 rounded-md p-2">
              <img
                :src="previewUrls[i]"
                class="size-10 object-cover rounded shrink-0">
              <span class="flex-1 text-sm truncate text-surface-700">{{ file.name }}</span>
              <button
                class="shrink-0"
                type="button"
                @click="removeNewFile(i)">
                <Icon
                  class="size-5 text-red-400 hover:text-red-600 transition-colors"
                  icon="solar:trash-bin-minimalistic-bold" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer="{ close }">
      <div class="flex items-center gap-3">
        <ConfirmButton
          label="บันทึก"
          @click="onSave(close)" />
        <SecondaryButton
          label="ยกเลิก"
          @click="close()" />
        <button
          class="text-sm text-red-500 hover:text-red-700 transition-colors"
          type="button"
          @click="onClear()">
          ล้างข้อมูล
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import type { ICollateralDetailInfo, ICollateralImage } from '@/models/response/contract/ContractRes.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import { isLandCollateral, isVehicleCollateral } from '@/enums/modules/contract/CollateralType.enum'
import type { IContractProvider } from '@/resources/provider/contract/Contract.provider'
import ContractProvider from '@/resources/provider/contract/Contract.provider'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import { Icon } from '@iconify/vue'
import LandForm, { type ILandFormState } from './LandForm.vue'
import VehicleForm, { type IVehicleFormState } from './VehicleForm.vue'

interface IProps {
  collateral: ICollateralDetailInfo
  contractId: TBaseParamsId
}

interface IEmits {
  saved: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>({ default: false })

const contractService: IContractProvider = new ContractProvider()

/* ─── Type detection ─── */

const isVehicle = computed((): boolean => isVehicleCollateral(props.collateral.collateralType))
const isLand = computed((): boolean => isLandCollateral(props.collateral.collateralType))

/* ─── Form state ─── */

function buildVehicleForm (): IVehicleFormState {
  return {
    collateralType: props.collateral.collateralType || '',
    detail: props.collateral.detail || '',
    licensePlate: props.collateral.licensePlate || '',
    vehicleProvince: props.collateral.vehicleProvince || '',
    yearManufactured: props.collateral.yearManufactured,
    yearRegistered: props.collateral.yearRegistered,
    chassisNumber: props.collateral.chassisNumber || '',
    mileage: props.collateral.mileage
  }
}

function buildLandForm (): ILandFormState {
  return {
    collateralType: props.collateral.collateralType || '',
    detail: props.collateral.detail || '',
    landNumber: props.collateral.landNumber || '',
    surveyPageNumber: props.collateral.surveyPageNumber || '',
    landLocation: props.collateral.landLocation || '',
    subDistrict: props.collateral.subDistrict || '',
    district: props.collateral.district || '',
    province: props.collateral.province || '',
    postCode: props.collateral.postCode || '',
    aerialPhotoNumber: props.collateral.aerialPhotoNumber || '',
    aerialPhotoSheet: props.collateral.aerialPhotoSheet || '',
    areaRai: props.collateral.areaRai,
    areaRgan: props.collateral.areaRgan,
    areaTarangWa: props.collateral.areaTarangWa
  }
}

const vehicleForm = ref<IVehicleFormState>(buildVehicleForm())
const landForm = ref<ILandFormState>(buildLandForm())

watch((): ICollateralDetailInfo => props.collateral, (): void => {
  vehicleForm.value = buildVehicleForm()
  landForm.value = buildLandForm()
  existingImages.value = [...(props.collateral.images || [])]
  newFiles.value = []
  previewUrls.value = []
  removedImageIds.value = []
})

/* ─── Images ─── */

const fileInputRef = ref<HTMLInputElement | null>(null)
const existingImages = ref<ICollateralImage[]>([...(props.collateral.images || [])])
const newFiles = ref<File[]>([])
const previewUrls = ref<string[]>([])
const removedImageIds = ref<number[]>([])

function onFileChange (event: Event): void {
  const input = event.target as HTMLInputElement
  if (!input.files) return
  Array.from(input.files).forEach((file: File): void => {
    newFiles.value.push(file)
    previewUrls.value.push(URL.createObjectURL(file))
  })
  input.value = ''
}

function removeExistingImage (id: number | null): void {
  if (id !== null) removedImageIds.value.push(id)
  existingImages.value = existingImages.value.filter((img: ICollateralImage): boolean => img.id !== id)
}

function removeNewFile (index: number): void {
  URL.revokeObjectURL(previewUrls.value[index])
  newFiles.value.splice(index, 1)
  previewUrls.value.splice(index, 1)
}

/* ─── Actions ─── */

function onClear (): void {
  vehicleForm.value = buildVehicleForm()
  landForm.value = buildLandForm()
  newFiles.value = []
  previewUrls.value = []
  removedImageIds.value = []
  existingImages.value = [...(props.collateral.images || [])]
}

async function useSave (): Promise<void> {
  const formData = new FormData()
  const currentForm = isVehicle.value ? vehicleForm.value : landForm.value

  Object.entries(currentForm).forEach(([key, val]: [string, unknown]): void => {
    if (val !== null && val !== undefined) {
      formData.append(key, String(val))
    }
  })

  removedImageIds.value.forEach((id: number): void => {
    formData.append('removedImageIds[]', String(id))
  })
  newFiles.value.forEach((file: File): void => {
    formData.append('images', file)
  })

  await contractService.saveCollateralDetail(props.contractId, props.collateral.id!, formData)
  toast.success('บันทึกข้อมูลสำเร็จ')
  emits('saved')
}

function onSave (close: () => void): void {
  handleLoading(async (): Promise<void> => {
    await useSave()
    close()
  })
}
</script>
