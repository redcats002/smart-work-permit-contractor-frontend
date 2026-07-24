<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="หมวดหมู่หลักทรัพย์"
        name="type"
        hide-error
        required>
        <SelectInput
          v-model="type"
          :invalid="invalid"
          :options="ApartmentAssetTypeItems"
          name="type"
          option-label="label"
          option-value="value"
          placeholder="เลือกหมวดหมู่หลักทรัพย์" />
      </LabelField>
      <LabelField
        v-model="detail"
        :form="form"
        label="รายละเอียดหลักทรัพย์"
        name="detail"
        placeholder="กรอกรายละเอียด"
        hide-error
        required />
    </div>
    <Divider />
    <label class="text-sm font-bold">ตำแหน่งที่ดิน</label>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LabelField
        v-model="model.landNo"
        :form="form"
        class="col-span-2"
        label="โฉนดที่ดินเลขที่"
        name="landNo"
        placeholder="กรอกโฉนดที่ดินเลขที่"
        hide-error
        required />
      <LabelField
        v-model="model.address"
        :form="form"
        class="col-span-2"
        label="ที่อยู่"
        name="address"
        placeholder="กรอกที่อยู่"
        hide-error />
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="แขวง/ตำบล"
        name="subDistrict"
        hide-error
        required>
        <AddressFieldInput
          v-model="model.subDistrict"
          :invalid="invalid"
          address-type="sub-district"
          name="subDistrict"
          placeholder="เลือกแขวง/ตำบล"
          @select="onAddressSelect($event)" />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="เขต/อำเภอ"
        name="district"
        hide-error
        required>
        <AddressFieldInput
          v-model="model.district"
          :invalid="invalid"
          address-type="district"
          name="district"
          placeholder="เลือกเขต/อำเภอ"
          @select="onAddressSelect($event)" />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="จังหวัด"
        name="province"
        hide-error
        required>
        <AddressFieldInput
          v-model="model.province"
          :invalid="invalid"
          address-type="province"
          name="province"
          placeholder="เลือกจังหวัด"
          @select="onAddressSelect($event)" />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="รหัสไปรษณีย์"
        name="postCode"
        hide-error
        required>
        <AddressFieldInput
          v-model="model.postCode"
          :invalid="invalid"
          address-type="zipcode"
          name="postCode"
          placeholder="รหัสไปรษณีย์"
          @select="onAddressSelect($event)" />
      </LabelField>
      <LabelField
        v-model="model.urlGoogleMap"
        :form="form"
        class="col-span-2"
        label="URL Google Map"
        name="urlGoogleMap"
        placeholder="กรอก URL Google Map"
        hide-error />
    </div>
    <div class="grid grid-cols-3 gap-4">
      <LabelField
        v-model="model.landAreaRai"
        :form="form"
        label="ไร่"
        name="landAreaRai"
        placeholder="กรุณากรอกไร่"
        hide-error
        required
        @keypress="keypress.number"
        @paste="paste.number" />
      <LabelField
        v-model="model.landAreaNgan"
        :form="form"
        label="งาน"
        name="landAreaNgan"
        placeholder="กรุณากรอกงาน"
        hide-error
        required
        @keypress="keypress.number"
        @paste="paste.number" />
      <LabelField
        v-model="model.landAreaSquareWah"
        :form="form"
        label="ตารางวา"
        name="landAreaSquareWah"
        placeholder="กรุณากรอกตารางวา"
        hide-error
        required
        @keypress="keypress.number"
        @paste="paste.number" />
    </div>
    <Divider />
    <span class="text-sm font-bold text-surface-600">ที่ตั้งห้องชุด</span>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LabelField
        v-model="model.unitNumber"
        :form="form"
        label="ห้องชุดเลขที่"
        name="unitNumber"
        placeholder="กรอกห้องชุดเลขที่"
        hide-error
        required />
      <LabelField
        v-model="model.floorNumber"
        :form="form"
        label="ชั้นที่"
        name="floorNumber"
        placeholder="กรอกชั้นที่"
        hide-error
        required />
      <LabelField
        v-model="model.buildingNumber"
        :form="form"
        label="อาคารเลขที่"
        name="buildingNumber"
        placeholder="กรอกอาคารเลขที่"
        hide-error
        required />
      <LabelField
        v-model="model.buildingName"
        :form="form"
        label="ชื่ออาคารชุด"
        name="buildingName"
        placeholder="กรอกชื่ออาคารชุด"
        hide-error
        required />
    </div>
    <LabelField
      v-model="model.buildingRegistrationNumber"
      :form="form"
      label="ทะเบียนอาคารชุดเลขที่"
      name="buildingRegistrationNumber"
      placeholder="กรอกทะเบียนอาคารชุดเลขที่"
      hide-error
      required />
    <Divider />
    <span class="text-sm font-bold text-surface-600">รายละเอียดห้อง</span>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <LabelField
        v-model="model.roomAreaSquareMeter"
        :form="form"
        label="เนื้อที่(ตารางเมตร)"
        name="roomAreaSquareMeter"
        placeholder="กรอกเนื้อที่"
        hide-error
        required
        @keypress="keypress.number"
        @paste="paste.number" />
      <LabelField
        v-model="model.roomHeightMeter"
        :form="form"
        label="ความสูง (เมตร)"
        name="roomHeightMeter"
        placeholder="กรอกความสูง"
        hide-error
        required
        @keypress="keypress.number"
        @paste="paste.number" />
      <LabelField
        v-model="model.commonPropertyOwnershipRatio"
        :form="form"
        label="อัตราส่วนแห่งกรรมสิทธิ์ในทรัพย์ส่วนกลาง"
        name="commonPropertyOwnershipRatio"
        placeholder="กรอกอัตราส่วนกรรมสิทธิ์"
        hide-error
        required />
    </div>
  </div>
</template>

<script setup lang="ts">
import keypress from '@/utils/Keypress'
import paste from '@/utils/Paste'
import type { IFormState } from '@/models/Form.model'
import { ApartmentAssetTypeItems, type TAssetType } from '@/enums/modules/asset/AssetType.enum'
import AddressFieldInput, { type IAddressData } from '@/components/input/AddressFieldInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import type { ModalApartmentFormValues } from '../../schema/apartment.schema'

interface IProps {
  form?: IFormState
}

withDefaults(defineProps<IProps>(), {
  form: undefined
})

const model = defineModel<ModalApartmentFormValues>({ required: true })
const type = defineModel<TAssetType>('type', { required: true })
const detail = defineModel<string>('detail', { required: true })

function onAddressSelect (data: IAddressData): void {
  model.value.subDistrict = data.subDistrict
  model.value.district = data.district
  model.value.province = data.province
  model.value.postCode = data.postalCode
}
</script>
