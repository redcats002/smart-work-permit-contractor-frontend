<template>
  <div>
    <div class="flex flex-col gap-5">
      <div>
        <LabelField
          :label="labelType"
          hide-error
          required>
          <div v-if="type!=='MAIN'">
            <CheckboxInput
              v-model="model.isSameCitizenAddress"
              label="ใช้ที่อยู่เดียวกับตามบัตรประจำตัวประชาชน"
              variant="primary"
              @update:model-value="onUseSameCitizenAddress($event)" />
            <CheckboxInput
              v-if="type==='WORK'"
              v-model="model.isSameCurrentAddress"
              label="ใช้ที่อยู่เดียวกับที่อยู่ปัจจุบัน"
              variant="primary"
              @update:model-value="onUseSameCurrentAddress($event)" />
          </div>
          <div v-else />
        </LabelField>
        <LabelField
          v-model="model.address"
          :form="form"
          :name="address"
          placeholder="กรอกที่อยู่"
          hide-error />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <LabelField
          v-slot="{invalid}"
          :form="form"
          :name="subDistrict"
          label="แขวง/ตำบล"
          hide-error
          required>
          <AddressFieldInput
            v-model="model.subDistrict"
            :invalid="invalid"
            :name="subDistrict"
            address-type="sub-district"
            placeholder="เลือกแขวง/ตำบล"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          v-slot="{invalid}"
          :form="form"
          :name="district"
          label="เขต/อำเภอ"
          hide-error
          required>
          <AddressFieldInput
            v-model="model.district"
            :invalid="invalid"
            :name="district"
            address-type="district"
            placeholder="เลือกเขต/อำเภอ"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          v-slot="{invalid}"
          :form="form"
          :name="province"
          label="จังหวัด"
          hide-error
          required>
          <AddressFieldInput
            v-model="model.province"
            :invalid="invalid"
            :name="province"
            address-type="province"
            placeholder="เลือกจังหวัด"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          v-slot="{invalid}"
          :form="form"
          :name="postCode"
          label="รหัสไปรษณีย์"
          hide-error
          required>
          <AddressFieldInput
            v-model="model.postCode"
            :invalid="invalid"
            :name="postCode"
            address-type="zipcode"
            placeholder="รหัสไปรษณีย์"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          v-if="type!=='MAIN'"
          v-model="model.urlGoogleMap"
          :form="form"
          :name="googleMapUrl"
          class="md:col-span-2"
          label="URL Google Map"
          placeholder="https://maps.app.goo.gl/"
          hide-error
          @update:model-value="onUpdate()" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { isSameAddress } from '@/utils/Address'
import type { IFormState } from '@/models/Form.model'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import AddressFieldInput, { type IAddressData } from '@/components/input/AddressFieldInput.vue'
import CheckboxInput from '@/components/input/CheckboxInput.vue'
import LabelField from '@/components/input/LabelField.vue'

interface IProps {
  form?: IFormState
  type?: 'MAIN' | 'CURRENT' | 'WORK'
  hideError?: boolean
  citizenAddress?: IAddressRequest
  currentAddressRef?: IAddressRequest
}
interface IEmits {
  useSameCitizenAddress: []
  useSameCurrentAddress: []
}

const props = withDefaults(defineProps<IProps>(), {
  form: undefined,
  type: 'CURRENT',
  hideError: false,
  citizenAddress: undefined,
  currentAddressRef: undefined
})
const emits = defineEmits<IEmits>()

const model = defineModel<IAddressRequest>({ default: (): IAddressRequest => ({
  address: '',
  subDistrict: '',
  district: '',
  province: '',
  postCode: '',
  urlGoogleMap: '',
  isSameCitizenAddress: false,
  isSameCurrentAddress: false
}) })

const labelType = computed((): string => {
  if (props.type === 'CURRENT') return 'ที่อยู่ปัจจุบัน'
  if (props.type === 'MAIN') return 'ที่อยู่ตามบัตรประชาชน'
  return 'ที่อยู่ที่ทำงาน'
})
const address = computed((): string => {
  if (props.type === 'CURRENT') return 'currentAddress.address'
  if (props.type === 'MAIN') return 'mainAddress.address'
  return 'workAddress.address'
})
const subDistrict = computed((): string => {
  if (props.type === 'CURRENT') return 'currentAddress.subDistrict'
  if (props.type === 'MAIN') return 'mainAddress.subDistrict'
  return 'workAddress.subDistrict'
})
const district = computed((): string => {
  if (props.type === 'CURRENT') return 'currentAddress.district'
  if (props.type === 'MAIN') return 'mainAddress.district'
  return 'workAddress.district'
})
const province = computed((): string => {
  if (props.type === 'CURRENT') return 'currentAddress.province'
  if (props.type === 'MAIN') return 'mainAddress.province'
  return 'workAddress.province'
})
const postCode = computed((): string => {
  if (props.type === 'CURRENT') return 'currentAddress.postCode'
  if (props.type === 'MAIN') return 'mainAddress.postCode'
  return 'workAddress.postCode'
})
const googleMapUrl = computed((): string => {
  if (props.type === 'CURRENT') return 'currentAddress.urlGoogleMap'
  if (props.type === 'MAIN') return 'mainAddress.urlGoogleMap'
  return 'workAddress.urlGoogleMap'
})

watch(
  (): string[] => [
    model.value.address,
    model.value.subDistrict,
    model.value.district,
    model.value.province,
    model.value.postCode
  ], (): void => {
    if (props.citizenAddress) {
      model.value.isSameCitizenAddress = isSameAddress(model.value, props.citizenAddress)
    }
    if (props.currentAddressRef) {
      model.value.isSameCurrentAddress = isSameAddress(model.value, props.currentAddressRef)
    }
  }
)

function onAddressSelect (address: Partial<IAddressData>): void {
  model.value = {
    ...model.value,
    ...address,
    postCode: address?.postalCode || ''
  }
}

function onUseSameCitizenAddress (isChecked: boolean): void {
  if (isChecked) emits('useSameCitizenAddress')
}
function onUseSameCurrentAddress (isChecked: boolean): void {
  if (isChecked) emits('useSameCurrentAddress')
}
function onUpdate (): void {
  model.value = { ...model.value }
}
</script>

<style scoped>

</style>
