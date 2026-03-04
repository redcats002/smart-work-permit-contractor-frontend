<template>
  <div>
    <div class="flex flex-col gap-5">
      <div>
        <LabelField
          :label="labelType"
          required>
          <div v-if="type!=='CITIZEN'">
            <CheckboxInput
              v-model="model.isSameCitizenAddress"
              label="ใช้ที่อยู่เดียวกับตามบัตรประจำตัวประชาชน"
              variant="primary" />
            <CheckboxInput
              v-if="type==='WORK'"
              v-model="model.isSameCurrentAddress"
              label="ใช้ที่อยู่เดียวกับที่อยู่ปัจจุบัน"
              variant="primary" />
          </div>
          <div v-else />
        </LabelField>
        <LabelField
          v-model="model.address"
          :name="address"
          placeholder="กรอกที่อยู่" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <LabelField
          label="แขวง/ตำบล"
          required>
          <AddressFieldInput
            v-model="model.subDistrict"
            :name="subDistrict"
            address-type="sub-district"
            placeholder="เลือกแขวง/ตำบล"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          label="เขต/อำเภอ"
          required>
          <AddressFieldInput
            v-model="model.district"
            :name="district"
            address-type="district"
            placeholder="เลือกเขต/อำเภอ"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          label="จังหวัด"
          required>
          <AddressFieldInput
            v-model="model.province"
            :name="province"
            address-type="province"
            placeholder="เลือกจังหวัด"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          label="รหัสไปรษณีย์"
          required>
          <AddressFieldInput
            v-model="model.postalCode"
            :name="postalCode"
            address-type="zipcode"
            placeholder="รหัสไปรษณีย์"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          v-if="type!=='CITIZEN'"
          :name="googleMapUrl"
          class="md:col-span-2"
          label="URL Google Map"
          placeholder="https://maps.app.goo.gl/"
          required />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IFormState } from '@/models/Form.model'
import type { IAddress } from '@/models/request/AddressReq.model'
import AddressFieldInput from '@/components/input/AddressFieldInput.vue'
import CheckboxInput from '@/components/input/CheckboxInput.vue'
import LabelField from '@/components/input/LabelField.vue'

interface IProps {
  form?: IFormState
  type?: 'CITIZEN' | 'CURRENT' | 'WORK'
}

const props = withDefaults(defineProps<IProps>(), {
  form: undefined,
  type: 'CURRENT'
})

const model = defineModel<IAddress>({ default: (): IAddress => ({
  address: '',
  subDistrict: '',
  district: '',
  province: '',
  postalCode: '',
  isSameCitizenAddress: false,
  isSameCurrentAddress: false
}) })

const labelType = computed((): string => {
  if (props.type === 'CURRENT') return 'ที่อยู่ปัจจุบัน'
  if (props.type === 'CITIZEN') return 'ที่อยู่ตามบัตรประชาชน'
  return 'ที่อยู่ที่ทำงาน'
})
const address = computed((): string => {
  if (props.type === 'CURRENT') return 'currentAddress'
  if (props.type === 'CITIZEN') return 'citizenAddress'
  return 'workAddress'
})
const subDistrict = computed((): string => {
  if (props.type === 'CURRENT') return 'currentSubDistrict'
  if (props.type === 'CITIZEN') return 'subDistrict'
  return 'workSubDistrict'
})
const district = computed((): string => {
  if (props.type === 'CURRENT') return 'currentDistrict'
  if (props.type === 'CITIZEN') return 'district'
  return 'workDistrict'
})
const province = computed((): string => {
  if (props.type === 'CURRENT') return 'currentProvince'
  if (props.type === 'CITIZEN') return 'province'
  return 'workProvince'
})
const postalCode = computed((): string => {
  if (props.type === 'CURRENT') return 'currentPostalCode'
  if (props.type === 'CITIZEN') return 'postalCode'
  return 'workPostalCode'
})
const googleMapUrl = computed((): string => {
  if (props.type === 'CURRENT') return 'currentUrl'
  if (props.type === 'CITIZEN') return 'citizenUrl'
  return 'workUrl'
})

function onAddressSelect (address: Partial<IAddress>): void {
  model.value.subDistrict = address?.subDistrict || ''
  model.value.district = address?.district || ''
  model.value.province = address?.province || ''
  model.value.postalCode = address?.postalCode || ''
}
</script>

<style scoped>

</style>
