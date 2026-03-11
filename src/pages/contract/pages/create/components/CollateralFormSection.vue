<template>
  <BaseContainer>
    <template #topright>
      <button
        class="flex items-center justify-center"
        type="button"
        @click="emits('delete')">
        <Icon
          class="size-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
          icon="solar:trash-bin-minimalistic-bold" />
      </button>
    </template>
    <h3 class="text-base font-bold mb-5">
      หลักทรัพย์
    </h3>
    <div class="flex flex-col gap-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <LabelField
          label="ประเภทหลักทรัพย์"
          tag="div"
          required>
          <SelectInput
            v-model="model.collateralType"
            :options="CollateralTypeItems"
            option-label="label"
            option-value="value"
            placeholder="เลือกประเภทหลักทรัพย์" />
        </LabelField>
        <LabelField
          v-model="model.detail"
          label="รายละเอียดหลักทรัพย์"
          placeholder="กรอกรายละเอียด"
          required />
      </div>
      <LabelField
        v-model="model.address"
        label="ที่อยู่"
        placeholder="กรอกที่อยู่" />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <LabelField
          label="ตำบล"
          tag="div"
          required>
          <AddressFieldInput
            v-model="model.subDistrict"
            address-type="sub-district"
            placeholder="เลือกตำบล"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          label="อำเภอ"
          tag="div"
          required>
          <AddressFieldInput
            v-model="model.district"
            address-type="district"
            placeholder="เลือกอำเภอ"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          label="จังหวัด"
          tag="div"
          required>
          <AddressFieldInput
            v-model="model.province"
            address-type="province"
            placeholder="เลือกจังหวัด"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          label="รหัสไปรษณีย์"
          tag="div"
          required>
          <AddressFieldInput
            v-model="model.postCode"
            address-type="zipcode"
            placeholder="รหัสไปรษณีย์"
            @select="onAddressSelect($event)" />
        </LabelField>
      </div>
      <LabelField
        v-model="model.urlGoogleMap"
        label="URL Google Map"
        placeholder="https://maps.app.goo.gl/"
        required />
    </div>
  </BaseContainer>
</template>

<script setup lang="ts">
import { CollateralTypeItems } from '@/enums/modules/contract/CollateralType.enum'
import BaseContainer from '@/components/base/BaseContainer.vue'
import AddressFieldInput, { type IAddressData } from '@/components/input/AddressFieldInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import { Icon } from '@iconify/vue'

export interface ICollateralFormItem {
  key: string
  collateralType: string
  detail: string
  address: string
  subDistrict: string
  district: string
  province: string
  postCode: string
  urlGoogleMap: string
}

interface IEmits {
  delete: []
}

const emits = defineEmits<IEmits>()

const model = defineModel<ICollateralFormItem>({ required: true })

function onAddressSelect (data: IAddressData): void {
  model.value.subDistrict = data.subDistrict
  model.value.district = data.district
  model.value.province = data.province
  model.value.postCode = data.postalCode
}
</script>
