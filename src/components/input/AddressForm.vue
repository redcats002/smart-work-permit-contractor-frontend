<template>
  <div>
    <div class="flex flex-col gap-5">
      <div>
        <LabelField
          :label="labelType"
          hide-error
          required>
          <div v-if="type !== 'MAIN'">
            <CheckboxInput
              v-model="model.isSameCitizenAddress"
              label="ใช้ที่อยู่เดียวกับตามบัตรประจำตัวประชาชน"
              variant="primary"
              @update:model-value="onUseSameCitizenAddress($event)" />
            <CheckboxInput
              v-if="type === 'WORK'"
              v-model="model.isSameCurrentAddress"
              label="ใช้ที่อยู่เดียวกับที่อยู่ปัจจุบัน"
              variant="primary"
              @update:model-value="onUseSameCurrentAddress($event)" />
          </div>
          <div v-else />
        </LabelField>
        <LabelField
          v-model="model.address"
          :disabled="isLocked"
          :form="form"
          :name="address"
          placeholder="กรอกที่อยู่"
          hide-error
          @blur="emits('mount')" />
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <LabelField
          v-if="showVillageNo"
          v-model="model.villageNo"
          :disabled="isLocked"
          :form="form"
          :name="villageNo"
          label="หมู่"
          placeholder="กรอกหมู่"
          hide-error
          @blur="emits('mount')" />
        <LabelField
          v-slot="{ invalid }"
          :form="form"
          :name="subDistrict"
          label="แขวง/ตำบล"
          hide-error
          required>
          <AddressFieldInput
            v-model="model.subDistrict"
            :disabled="isLocked"
            :invalid="invalid"
            :name="subDistrict"
            address-type="sub-district"
            placeholder="เลือกแขวง/ตำบล"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          v-slot="{ invalid }"
          :form="form"
          :name="district"
          label="เขต/อำเภอ"
          hide-error
          required>
          <AddressFieldInput
            v-model="model.district"
            :disabled="isLocked"
            :invalid="invalid"
            :name="district"
            address-type="district"
            placeholder="เลือกเขต/อำเภอ"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          v-slot="{ invalid }"
          :form="form"
          :name="province"
          label="จังหวัด"
          hide-error
          required>
          <AddressFieldInput
            v-model="model.province"
            :disabled="isLocked"
            :invalid="invalid"
            :name="province"
            address-type="province"
            placeholder="เลือกจังหวัด"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          v-slot="{ invalid }"
          :form="form"
          :name="postCode"
          label="รหัสไปรษณีย์"
          hide-error
          required>
          <AddressFieldInput
            v-model="model.postCode"
            :disabled="isLocked"
            :invalid="invalid"
            :name="postCode"
            address-type="zipcode"
            placeholder="รหัสไปรษณีย์"
            @select="onAddressSelect($event)" />
        </LabelField>
        <LabelField
          v-if="type !== 'MAIN' || personalType === 'CORPORATE'"
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
import { computed, inject, watch } from 'vue'
import type { IFormState } from '@/models/Form.model'
import type { IAddressRequest } from '@/models/request/AddressReq.model'
import type { TPersonalType } from '@/enums/modules/customer/PersonalType.enum'
import AddressFieldInput, { type IAddressData } from '@/components/input/AddressFieldInput.vue'
import CheckboxInput from '@/components/input/CheckboxInput.vue'
import LabelField from '@/components/input/LabelField.vue'

interface IProps {
  form?: IFormState
  type?: 'MAIN' | 'CURRENT' | 'WORK'
  personalType?: TPersonalType
  hideError?: boolean
  citizenAddress?: IAddressRequest
  currentAddressRef?: IAddressRequest
  showVillageNo?: boolean
}
interface IEmits {
  mount: []
  useSameCitizenAddress: []
  useSameCurrentAddress: []
}

const props = withDefaults(defineProps<IProps>(), {
  form: undefined,
  type: 'CURRENT',
  hideError: false,
  citizenAddress: undefined,
  currentAddressRef: undefined,
  personalType: 'INDIVIDUAL',
  showVillageNo: false
})
const emits = defineEmits<IEmits>()

const model = defineModel<IAddressRequest>({
  default: (): IAddressRequest => ({
    villageNo: '',
    address: '',
    subDistrict: '',
    district: '',
    province: '',
    postCode: '',
    urlGoogleMap: '',
    isSameCitizenAddress: false,
    isSameCurrentAddress: false
  })
})

const BLANK_ADDRESS = {
  villageNo: '',
  address: '',
  subDistrict: '',
  district: '',
  province: '',
  postCode: ''
}

const $pcForm = inject<any>('$pcForm', null)

const isLocked = computed((): boolean => !!(model.value.isSameCitizenAddress || model.value.isSameCurrentAddress))

const labelType = computed((): string => {
  if (props.type === 'CURRENT') return 'ที่อยู่ปัจจุบัน'
  if (props.type === 'MAIN') return props.personalType === 'CORPORATE' ? 'ที่อยู่' : 'ที่อยู่ตามบัตรประชาชน'
  return 'ที่อยู่ที่ทำงาน'
})
const villageNo = computed((): string => {
  if (props.type === 'CURRENT') return 'currentAddress.villageNo'
  if (props.type === 'MAIN') return 'mainAddress.villageNo'
  return 'workAddress.villageNo'
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

function syncPcFormValues (data: Partial<IAddressRequest>): void {
  if (!$pcForm?.setValues) return
  $pcForm.setValues({
    [villageNo.value]: data.villageNo ?? '',
    [address.value]: data.address ?? '',
    [subDistrict.value]: data.subDistrict ?? '',
    [district.value]: data.district ?? '',
    [province.value]: data.province ?? '',
    [postCode.value]: data.postCode ?? ''
  })
}

watch(
  (): IAddressRequest | undefined => props.citizenAddress, (newVal: IAddressRequest | undefined): void => {
    if (model.value.isSameCitizenAddress && newVal) {
      model.value = {
        ...model.value,
        villageNo: newVal.villageNo,
        address: newVal.address,
        subDistrict: newVal.subDistrict,
        district: newVal.district,
        province: newVal.province,
        postCode: newVal.postCode
      }
      syncPcFormValues(newVal)
    }
  }, { deep: true }
)

watch(
  (): IAddressRequest | undefined => props.currentAddressRef, (newVal: IAddressRequest | undefined): void => {
    if (model.value.isSameCurrentAddress && newVal) {
      model.value = {
        ...model.value,
        villageNo: newVal.villageNo,
        address: newVal.address,
        subDistrict: newVal.subDistrict,
        district: newVal.district,
        province: newVal.province,
        postCode: newVal.postCode
      }
      syncPcFormValues(newVal)
    }
  }, { deep: true }
)

function onAddressSelect (address: Partial<IAddressData>): void {
  model.value = {
    ...model.value,
    ...address,
    postCode: address?.postalCode || ''
  }
}

function onUseSameCitizenAddress (isChecked: boolean): void {
  if (isChecked && props.citizenAddress) {
    model.value = {
      ...model.value,
      isSameCitizenAddress: true,
      isSameCurrentAddress: false,
      villageNo: props.citizenAddress.villageNo,
      address: props.citizenAddress.address,
      subDistrict: props.citizenAddress.subDistrict,
      district: props.citizenAddress.district,
      province: props.citizenAddress.province,
      postCode: props.citizenAddress.postCode
    }
    syncPcFormValues(props.citizenAddress)
  } else {
    model.value = { ...model.value, ...BLANK_ADDRESS }
    syncPcFormValues(BLANK_ADDRESS)
  }
  emits('useSameCitizenAddress')
}

function onUseSameCurrentAddress (isChecked: boolean): void {
  if (isChecked && props.currentAddressRef) {
    model.value = {
      ...model.value,
      isSameCurrentAddress: true,
      isSameCitizenAddress: false,
      villageNo: props.currentAddressRef.villageNo,
      address: props.currentAddressRef.address,
      subDistrict: props.currentAddressRef.subDistrict,
      district: props.currentAddressRef.district,
      province: props.currentAddressRef.province,
      postCode: props.currentAddressRef.postCode
    }
    syncPcFormValues(props.currentAddressRef)
  } else {
    model.value = { ...model.value, ...BLANK_ADDRESS }
    syncPcFormValues(BLANK_ADDRESS)
  }
  emits('useSameCurrentAddress')
}

function onUpdate (): void {
  model.value = { ...model.value }
}
</script>

<style scoped></style>
