<template>
  <BaseContainer>
    <div
      :class="{
        'grid-cols=1 md:grid-cols-[180px_1fr]': isMultiTab,
        'grid-cols-1': !isMultiTab
      }"
      class="grid gap-6 min-h-80">
      <div
        v-if="isMultiTab"
        class="flex flex-col border-r border-surface-200 pr-4 gap-1">
        <Button
          v-for="(col, i) in preAssets"
          :key="col.id ?? i"
          :class="activeIndex === i ? 'border-primary! font-bold text-font-gray!' : 'border-transparent text-surface-500!'"
          class="border-b-2! border-l-0 border-t-0 border-r-0 text-sm text-left py-2 hover:text-primary transition-colors rounded-b-none!"
          type="button"
          text
          @click="onActiveAsset(i)">
          หลักทรัพย์ที่{{ i + 1 }}
        </Button>
      </div>
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
        mode="out-in">
        <div
          v-if="activeAsset"
          class="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          <div>
            <BaseGalleria
              v-if="activeAsset.images?.length"
              :images="activeAsset.images" />
            <AssetEmpty v-else />
          </div>
          <div>
            <div class="mb-4">
              <p class="font-bold text-xl text-surface-800 mb-2">
                {{ formatTitle(activeAsset.type) }}
              </p>
              <DisplayList
                :items="items"
                class="mb-2"
                label-class="text-font-gray! col-span-2"
                row-class="grid-cols-2 md:grid-cols-5" />
              <LabelField
                v-if="activeAsset?.files?.length"
                label="เอกสารหลักทรัพย์">
                <FileAttachment
                  :files="activeAsset?.files" />
              </LabelField>
              <template v-if="status === 'PENDING_CONTRACT'">
                <AssetWarehouseForm
                  v-if="activeIndex !== undefined && activeIndex !== null"
                  ref="assetWarehouseFormRef"
                  v-model="preAssets"
                  :active-index="activeIndex"
                  :form-key="formKey"
                  class="mt-4"
                  @submit="submit()" />
              </template>
            </div>
            <Button
              v-if="isShowEdit"
              class="flex items-center gap-1.5 border border-surface-700! rounded-sm px-4 h-9 text-sm text-surface-700! hover:bg-surface-50! transition-colors w-fit"
              type="button"
              outlined
              @click="onOpen(activeAsset)">
              {{ btnText }}
            </Button>
          </div>
        </div>
      </Transition>
    </div>
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import type { IPreAssetList } from '@/models/modules/pre-contract/PreAsset.model'
import { formatTitle } from '@/enums/modules/asset/AssetType.enum'
import type { TPreContractStatus } from '@/enums/modules/contract/PreContractStatus.enum'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BaseGalleria from '@/components/base/BaseGalleria.vue'
import DisplayList from '@/components/display/DisplayList.vue'
import FileAttachment from '@/components/display/FileAttachment.vue'
import LabelField from '@/components/input/LabelField.vue'
import { type IAssetDisplayItemsInput, useAssetDisplayItems } from '@/pages/contract/pages/pre-contract-detail/composables/useAssetDisplayItems.ts'
import type { TAssetCategory } from '../../create/schema/pre-contract.schema'
import { readyForApartmentAppraisal } from '../schema/apartment.schema'
import { readyForAppraisal as readyForLandAppraisal } from '../schema/land.schema'
import type { PreAssetWarehouseFormValues } from '../schema/make-contract.schema'
import { readyForAppraisal as readyForVehicleAppraisal } from '../schema/vehicle.schema'
import AssetEmpty from './AssetEmpty.vue'
import AssetWarehouseForm from './AssetWarehouseForm.vue'

interface IProps {
  formKey?: number
  activeIndex?: number
  activeAsset?: IPreAssetList | null
  assetCategory?: TAssetCategory
  status?: TPreContractStatus
}
interface IEmits {
  active: [index?: number]
  open: [assets: IPreAssetList]
}
interface IExposes {
  submit: () => Promise<boolean>
}

const props = withDefaults(defineProps<IProps>(), {
  formKey: 0,
  activeAsset: undefined,
  activeIndex: undefined,
  assetCategory: null,
  status: undefined
})

const emits = defineEmits<IEmits>()

const assetWarehouseFormRef = useTemplateRef<InstanceType<typeof AssetWarehouseForm>>('assetWarehouseFormRef')

const preAssets = defineModel<PreAssetWarehouseFormValues[]>('preAssets', { required: true })

const isLand = computed((): boolean => props.assetCategory === 'LAND')
const isApartment = computed((): boolean => props.assetCategory === 'APARTMENT')
const isMultiTab = computed((): boolean => isLand.value || isApartment.value)
const btnText = computed((): string => {
  if (readyForVehicleAppraisal(props.activeAsset) && props.assetCategory === 'VEHICLE') return 'แก้ไขรายละเอียดสินทรัพย์'
  if (readyForLandAppraisal(props.activeAsset) && isLand.value) return 'แก้ไขรายละเอียดสินทรัพย์'
  if (readyForApartmentAppraisal(props.activeAsset) && isApartment.value) return 'แก้ไขรายละเอียดสินทรัพย์'
  return `ใส่รายละเอียดสินทรัพย์`
})
const isShowEdit = computed((): boolean => {
  const editableStatus: TPreContractStatus[] = ['DRAFT', 'PENDING_EVALUATION']
  return props.activeAsset !== undefined && props.status !== undefined && editableStatus.includes(props.status)
})

const items = useAssetDisplayItems(computed((): IAssetDisplayItemsInput | null => {
  if (!props.activeAsset) return null
  return {
    type: props.activeAsset.type,
    detail: props.activeAsset.detail,
    locationName: props.activeAsset.location?.name,
    realEstateForm: props.activeAsset.realEstateForm,
    vehicleForm: {
      manufactureYear: props.activeAsset.vehicleForm?.manufactureYear || '',
      mileage: props.activeAsset.vehicleForm?.mileage || 0,
      plateNo: props.activeAsset.vehicleForm?.plateNo || '',
      registrationYear: props.activeAsset.vehicleForm?.registrationYear || '',
      vehicleIdentificationNo: props.activeAsset.vehicleForm?.vehicleIdentificationNo || ''
    },
    apartmentForm: props.activeAsset.apartmentCondoForm
  }
}))

function onActiveAsset (index: number): void {
  emits('active', undefined)
  setTimeout((): void => {
    emits('active', index)
  }, 200)
}

function onOpen (asset: IPreAssetList): void {
  emits('open', asset)
}

async function submit (): Promise<boolean> {
  const valid = await assetWarehouseFormRef.value?.submit()
  return valid || false
}

defineExpose<IExposes>({ submit })
</script>

<style scoped></style>
