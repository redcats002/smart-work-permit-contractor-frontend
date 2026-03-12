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
          icon="solar:trash-bin-minimalistic-bold" />
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
          :name="`${namePrefix}.collateralType`"
          label="ประเภทหลักทรัพย์"
          tag="div"
          hide-error
          required>
          <EstateTypeSelection
            v-model="model.collateralType"
            :category="estateCategory"
            :invalid="invalid"
            :name="`${namePrefix}.collateralType`"
            show-clear />
        </LabelField>
        <LabelField
          v-if="isVehicle"
          v-model="model.brand"
          :form="form"
          :name="`${namePrefix}.brand`"
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
        v-model="model"
        :form="form"
        :name-prefix="namePrefix" />

      <LandForm
        v-if="isLand"
        v-model="model"
        :form="form"
        :name-prefix="namePrefix" />
    </div>
  </BaseContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IFormState } from '@/models/Form.model'
import { isLandEstate, isVehicleEstate } from '@/enums/modules/contract/EstateType.enum'
import BaseContainer from '@/components/base/BaseContainer.vue'
import LabelField from '@/components/input/LabelField.vue'
import EstateTypeSelection from '@/components/selection/modules/estate-type/EstateTypeSelection.vue'
import { Icon } from '@iconify/vue'
import type { IEstateFormItem } from '../schema/pre-contract.schema'
import LandForm from './LandForm.vue'
import VehicleForm from './VehicleForm.vue'

type TEstateCategory = 'VEHICLE' | 'LAND'

interface IProps {
  form?: IFormState
  namePrefix?: string
  estateCategory?: TEstateCategory | null
}

interface IEmits {
  delete: []
}

withDefaults(defineProps<IProps>(), {
  form: undefined,
  namePrefix: '',
  estateCategory: null
})

const emits = defineEmits<IEmits>()

const model = defineModel<IEstateFormItem>({ required: true })

const isVehicle = computed((): boolean => isVehicleEstate(model.value.collateralType))
const isLand = computed((): boolean => isLandEstate(model.value.collateralType))

</script>
