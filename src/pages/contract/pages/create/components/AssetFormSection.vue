<template>
  <BaseContainer>
    <template #topright>
      <Button
        class="flex items-center justify-center"
        type="button"
        text
        @click="emits('delete')">
        <Icon
          class="size-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
          icon="material-symbols:delete-outline" />
      </Button>
    </template>
    <h3 class="text-base font-bold mb-5">
      หลักทรัพย์
    </h3>
    <div class="flex flex-col gap-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <LabelField
          v-slot="{ invalid }"
          :form="form"
          :name="`${namePrefix}.type`"
          label="หมวดหมู่หลักทรัพย์"
          tag="div"
          hide-error
          required>
          <AssetTypeSelection
            v-model="model.type"
            :category="assetCategory"
            :invalid="invalid"
            :name="`${namePrefix}.type`"
            placeholder="เลือกหมวดหมู่หลักทรัพย์"
            show-clear />
        </LabelField>
        <LabelField
          v-if="isVehicle"
          v-model="model.vehicleForm!.brand"
          :form="form"
          :name="`${namePrefix}.vehicleForm.brand`"
          label="ยี่ห้อ"
          placeholder="กรอกยี่ห้อ"
          hide-error
          required />
        <LabelField
          v-else
          v-model="model.detail"
          :form="form"
          :name="`${namePrefix}.detail`"
          label="รายละเอียดหลักทรัพย์"
          placeholder="กรอกรายละเอียด"
          hide-error
          required />
      </div>
      <VehicleForm
        v-if="isVehicle"
        v-model="model.vehicleForm!"
        :form="form"
        :name-prefix="`${namePrefix}.vehicleForm`" />
      <LandForm
        v-if="isLand"
        v-model="model.realEstateForm!"
        :form="form"
        :name-prefix="`${namePrefix}.realEstateForm`" />
    </div>
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IFormState } from '@/models/Form.model'
import { isLandAsset, isVehicleAsset } from '@/enums/modules/asset/AssetType.enum'
import BaseContainer from '@/components/base/BaseContainer.vue'
import LabelField from '@/components/input/LabelField.vue'
import AssetTypeSelection from '@/components/selection/modules/asset-type/AssetTypeSelection.vue'
import { Icon } from '@iconify/vue'
import type { PreAssetFormValues } from '../schema/pre-contract.schema'
import LandForm from './LandForm.vue'
import VehicleForm from './VehicleForm.vue'

type TAssetCategory = 'VEHICLE' | 'LAND'

interface IProps {
  form?: IFormState
  namePrefix?: string
  assetCategory?: TAssetCategory | null
}

interface IEmits {
  delete: []
}

withDefaults(defineProps<IProps>(), {
  form: undefined,
  namePrefix: '',
  assetCategory: null
})

const emits = defineEmits<IEmits>()

const model = defineModel<PreAssetFormValues>({ required: true })

const isVehicle = computed((): boolean => isVehicleAsset(model.value.type))
const isLand = computed((): boolean => isLandAsset(model.value.type))

</script>
