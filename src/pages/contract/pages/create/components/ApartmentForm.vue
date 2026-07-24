<template>
  <div class="grid grid-cols-1 gap-5">
    <LabelField
      v-model="model.address"
      :form="form"
      :name="`${namePrefix}.address`"
      label="ที่อยู่"
      placeholder="กรอกที่อยู่"
      hide-error />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        :name="`${namePrefix}.subDistrict`"
        label="แขวง/ตำบล"
        tag="div"
        hide-error
        required>
        <AddressFieldInput
          v-model="model.subDistrict"
          :invalid="invalid"
          :name="`${namePrefix}.subDistrict`"
          address-type="sub-district"
          placeholder="เลือกแขวง/ตำบล"
          @select="onAddressSelect($event)" />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        :name="`${namePrefix}.district`"
        label="เขต/อำเภอ"
        tag="div"
        hide-error
        required>
        <AddressFieldInput
          v-model="model.district"
          :invalid="invalid"
          :name="`${namePrefix}.district`"
          address-type="district"
          placeholder="เลือกเขต/อำเภอ"
          @select="onAddressSelect($event)" />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        :name="`${namePrefix}.province`"
        label="จังหวัด"
        tag="div"
        hide-error
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
        hide-error
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
      placeholder="กรอก URL Google Map"
      hide-error />
  </div>
</template>

<script setup lang="ts">
import type { IFormState } from '@/models/Form.model'
import AddressFieldInput, { type IAddressData } from '@/components/input/AddressFieldInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import type { ApartmentCondoFormValues } from '../schema/pre-contract.schema'

interface IProps {
  form: IFormState
  namePrefix?: string
}

withDefaults(defineProps<IProps>(), {
  namePrefix: ''
})

const model = defineModel<ApartmentCondoFormValues>({ required: true })

function onAddressSelect (data: IAddressData): void {
  model.value.subDistrict = data.subDistrict
  model.value.district = data.district
  model.value.province = data.province
  model.value.postCode = data.postalCode
}
</script>
