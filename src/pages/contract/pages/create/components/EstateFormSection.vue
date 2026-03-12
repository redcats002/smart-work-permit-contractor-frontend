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
          required>
          <EstateTypeSelection
            v-model="model.collateralType"
            :invalid="invalid"
            :name="`${namePrefix}.collateralType`"
            :options="EstateTypeItems"
            option-label="label"
            option-value="value"
            placeholder="เลือกประเภทหลักทรัพย์" />
        </LabelField>
        <LabelField
          v-model="model.detail"
          :form="form"
          :name="`${namePrefix}.detail`"
          label="รายละเอียดหลักทรัพย์"
          placeholder="กรอกรายละเอียด"
          required />
      </div>
      <LabelField
        v-model="model.address"
        :form="form"
        :name="`${namePrefix}.address`"
        label="ที่อยู่"
        placeholder="กรอกที่อยู่" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <LabelField
          v-slot="{ invalid }"
          :form="form"
          :name="`${namePrefix}.subDistrict`"
          label="ตำบล"
          tag="div"
          required>
          <AddressFieldInput
            v-model="model.subDistrict"
            :invalid="invalid"
            :name="`${namePrefix}.subDistrict`"
            address-type="sub-district"
            placeholder="เลือกตำบล"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          v-slot="{ invalid }"
          :form="form"
          :name="`${namePrefix}.district`"
          label="อำเภอ"
          tag="div"
          required>
          <AddressFieldInput
            v-model="model.district"
            :invalid="invalid"
            :name="`${namePrefix}.district`"
            address-type="district"
            placeholder="เลือกอำเภอ"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          v-slot="{ invalid }"
          :form="form"
          :name="`${namePrefix}.province`"
          label="จังหวัด"
          tag="div"
          required>
          <AddressFieldInput
            v-model="model.province"
            :invalid="invalid"
            :name="`${namePrefix}.province`"
            address-type="province"
            placeholder="เลือกจังหวัด"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          v-slot="{ invalid }"
          :form="form"
          :name="`${namePrefix}.postCode`"
          label="รหัสไปรษณีย์"
          tag="div"
          required>
          <AddressFieldInput
            v-model="model.postCode"
            :invalid="invalid"
            :name="`${namePrefix}.postCode`"
            address-type="zipcode"
            placeholder="รหัสไปรษณีย์"
            @select="onAddressSelect($event)" />
        </LabelField>
      </div>
      <LabelField
        v-model="model.urlGoogleMap"
        :form="form"
        :name="`${namePrefix}.urlGoogleMap`"
        label="URL Google Map"
        placeholder="https://maps.app.goo.gl/" />
    </div>
  </BaseContainer>
</template>

<script setup lang="ts">
import type { IFormState } from '@/models/Form.model'
import { EstateTypeItems } from '@/enums/modules/contract/EstateType.enum'
import BaseContainer from '@/components/base/BaseContainer.vue'
import AddressFieldInput, { type IAddressData } from '@/components/input/AddressFieldInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import EstateTypeSelection from '@/components/selection/modules/estate-type/EstateTypeSelection.vue'
import { Icon } from '@iconify/vue'
import type { IEstateFormItem } from '../schema/pre-contract.schema'

interface IProps {
  form?: IFormState
  namePrefix?: string
}

interface IEmits {
  delete: []
}

withDefaults(defineProps<IProps>(), {
  form: undefined,
  namePrefix: ''
})

const emits = defineEmits<IEmits>()

const model = defineModel<IEstateFormItem>({ required: true })

function onAddressSelect (data: IAddressData): void {
  model.value.subDistrict = data.subDistrict
  model.value.district = data.district
  model.value.province = data.province
  model.value.postCode = data.postalCode
}
</script>
