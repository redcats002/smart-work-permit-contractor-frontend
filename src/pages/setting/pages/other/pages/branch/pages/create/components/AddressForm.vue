<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
    <LabelField
      v-model="model.address"
      :form="form"
      class="col-span-2"
      name="address"
      placeholder="กรอกที่อยู่"
      hide-error />
    <LabelField
      v-slot="{invalid}"
      :form="form"
      label="แขวง/ตำบล"
      name="subDistrict"
      hide-error>
      <AddressFieldInput
        v-model="model.subDistrict"
        :invalid="invalid"
        address-type="sub-district"
        name="subDistrict"
        placeholder="เลือกแขวง/ตำบล"
        @select="onAddressSelect($event)" />
    </LabelField>
    <LabelField
      v-slot="{invalid}"
      :form="form"
      label="เขต/อำเภอ"
      name="district"
      hide-error>
      <AddressFieldInput
        v-model="model.district"
        :invalid="invalid"
        address-type="district"
        name="district"
        placeholder="เลือกเขต/อำเภอ"
        @select="onAddressSelect($event)" />
    </LabelField>
    <LabelField
      v-slot="{invalid}"
      :form="form"
      label="จังหวัด"
      name="province"
      hide-error>
      <AddressFieldInput
        v-model="model.province"
        :invalid="invalid"
        address-type="province"
        name="province"
        placeholder="เลือกจังหวัด"
        @select="onAddressSelect($event)" />
    </LabelField>
    <LabelField
      v-slot="{invalid}"
      :form="form"
      label="รหัสไปรษณีย์"
      name="postCode"
      hide-error>
      <AddressFieldInput
        v-model="model.postCode"
        :invalid="invalid"
        address-type="zipcode"
        name="postCode"
        placeholder="รหัสไปรษณีย์"
        @select="onAddressSelect($event)" />
    </LabelField>
  </div>
</template>

<script setup lang="ts">
import type { IFormState } from '@/models/Form.model'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import AddressFieldInput, { type IAddressData } from '@/components/input/AddressFieldInput.vue'
import LabelField from '@/components/input/LabelField.vue'

interface IProps {
  form?: IFormState
  hideError?: boolean
}

withDefaults(defineProps<IProps>(), {
  form: undefined,
  hideError: false
})

const model = defineModel<IAddressRequest>({ default: (): IAddressRequest => ({
  address: '',
  subDistrict: '',
  district: '',
  province: '',
  postCode: ''
}) })

function onAddressSelect (address: Partial<IAddressData>): void {
  model.value = {
    ...model.value,
    ...address,
    postCode: address?.postalCode || ''
  }
}
</script>

<style scoped>

</style>
