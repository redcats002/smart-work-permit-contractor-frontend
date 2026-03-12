<template>
  <div class="flex flex-col gap-5">
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
      placeholder="กรอก URL Google Map" />
  </div>
</template>

<script setup lang="ts">
import type { IFormState } from '@/models/Form.model'
import AddressFieldInput, { type IAddressData } from '@/components/input/AddressFieldInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import type { LandFormValues } from '../schema/pre-contract.schema'

interface IProps {
  form?: IFormState
  namePrefix?: string
}

withDefaults(defineProps<IProps>(), {
  form: undefined,
  namePrefix: ''
})

const model = defineModel<LandFormValues>({ required: true })

function onAddressSelect (data: IAddressData): void {
  model.value.subDistrict = data.subDistrict
  model.value.district = data.district
  model.value.province = data.province
  model.value.postCode = data.postalCode
}
</script>
