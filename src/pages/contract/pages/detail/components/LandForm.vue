<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LabelField
        label="ประเภทหลักทรัพย์"
        tag="div"
        required>
        <SelectInput
          v-model="form.assetType"
          :options="LandAssetTypeItems"
          option-label="label"
          option-value="value"
          placeholder="เลือกประเภทหลักทรัพย์" />
      </LabelField>
      <LabelField
        v-model="form.detail"
        label="รายละเอียดหลักทรัพย์"
        placeholder="กรอกรายละเอียด"
        required />
      <LabelField
        v-model="form.landNumber"
        label="เลขที่ดิน"
        placeholder="กรอกเลขที่ดิน"
        required />
      <LabelField
        v-model="form.surveyPageNumber"
        label="เลขหน้าสำรวจ"
        placeholder="กรอกเลขหน้าสำรวจ"
        required />
    </div>
    <LabelField
      v-model="form.landLocation"
      label="ตำแหน่งที่ดิน"
      placeholder="กรอกตำแหน่งที่ดิน" />
    <Divider />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LabelField
        label="ตำบล"
        tag="div"
        required>
        <AddressFieldInput
          v-model="form.subDistrict"
          address-type="sub-district"
          placeholder="เลือกตำบล"
          @select="onAddressSelect($event)" />
      </LabelField>
      <LabelField
        label="อำเภอ"
        tag="div"
        required>
        <AddressFieldInput
          v-model="form.district"
          address-type="district"
          placeholder="เลือกอำเภอ"
          @select="onAddressSelect($event)" />
      </LabelField>
      <LabelField
        label="จังหวัด"
        tag="div"
        required>
        <AddressFieldInput
          v-model="form.province"
          address-type="province"
          placeholder="เลือกจังหวัด"
          @select="onAddressSelect($event)" />
      </LabelField>
      <LabelField
        label="รหัสไปรษณีย์"
        tag="div"
        required>
        <AddressFieldInput
          v-model="form.postCode"
          address-type="zipcode"
          placeholder="รหัสไปรษณีย์"
          @select="onAddressSelect($event)" />
      </LabelField>
    </div>
    <Divider>
      <span class="text-sm font-bold text-surface-600">ระวางรูปถ่ายทางอากาศ</span>
    </Divider>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LabelField
        v-model="form.aerialPhotoNumber"
        label="หมายเลข"
        placeholder="กรอกหมายเลข"
        required />
      <LabelField
        v-model="form.aerialPhotoSheet"
        label="แผ่นที่"
        placeholder="กรอกแผ่นที่"
        required />
    </div>
    <Divider>
      <span class="text-sm font-bold text-surface-600">เนื้อที่</span>
    </Divider>
    <div class="grid grid-cols-3 gap-4">
      <LabelField
        label="ไร่"
        tag="div"
        required>
        <InputNumber
          v-model="form.areaRai"
          class="h-9! shadow-none!"
          placeholder="0"
          fluid />
      </LabelField>
      <LabelField
        label="งาน"
        tag="div"
        required>
        <InputNumber
          v-model="form.areaRgan"
          class="h-9! shadow-none!"
          placeholder="0"
          fluid />
      </LabelField>
      <LabelField
        label="ตารางวา"
        tag="div"
        required>
        <InputNumber
          v-model="form.areaTarangWa"
          class="h-9! shadow-none!"
          placeholder="0"
          fluid />
      </LabelField>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LandAssetTypeItems } from '@/enums/modules/contract/AssetType.enum'
import AddressFieldInput, { type IAddressData } from '@/components/input/AddressFieldInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import type { LandFormValues } from '../schema/land.schema'

const form = defineModel<LandFormValues>({ required: true })

function onAddressSelect (data: IAddressData): void {
  form.value.subDistrict = data.subDistrict
  form.value.district = data.district
  form.value.province = data.province
  form.value.postCode = data.postalCode
}
</script>
