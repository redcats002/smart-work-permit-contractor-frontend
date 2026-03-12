<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LabelField
        v-slot="{ invalid }"
        :form="props.form"
        label="ประเภทหลักทรัพย์"
        name="assetType"
        tag="div"
        hide-error
        required>
        <SelectInput
          v-model="model.assetType"
          :invalid="invalid"
          :options="LandAssetTypeItems"
          option-label="label"
          option-value="value"
          placeholder="เลือกประเภทหลักทรัพย์" />
      </LabelField>
      <LabelField
        v-model="model.detail"
        :form="props.form"
        label="รายละเอียดหลักทรัพย์"
        name="detail"
        placeholder="กรอกรายละเอียด"
        hide-error />
      <LabelField
        v-model="model.landNumber"
        :form="props.form"
        label="เลขที่ดิน"
        name="landNumber"
        placeholder="กรอกเลขที่ดิน"
        hide-error
        required />
      <LabelField
        v-model="model.surveyPageNumber"
        :form="props.form"
        label="เลขหน้าสำรวจ"
        name="surveyPageNumber"
        placeholder="กรอกเลขหน้าสำรวจ"
        hide-error />
    </div>
    <LabelField
      v-model="model.landLocation"
      :form="props.form"
      label="ตำแหน่งที่ดิน"
      name="landLocation"
      placeholder="กรอกตำแหน่งที่ดิน"
      hide-error />
    <Divider />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LabelField
        v-slot="{ invalid }"
        :form="props.form"
        label="ตำบล"
        name="subDistrict"
        tag="div"
        hide-error>
        <AddressFieldInput
          v-model="model.subDistrict"
          :invalid="invalid"
          address-type="sub-district"
          placeholder="เลือกตำบล"
          @select="onAddressSelect($event)" />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="props.form"
        label="อำเภอ"
        name="district"
        tag="div"
        hide-error>
        <AddressFieldInput
          v-model="model.district"
          :invalid="invalid"
          address-type="district"
          placeholder="เลือกอำเภอ"
          @select="onAddressSelect($event)" />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="props.form"
        label="จังหวัด"
        name="province"
        tag="div"
        hide-error>
        <AddressFieldInput
          v-model="model.province"
          :invalid="invalid"
          address-type="province"
          placeholder="เลือกจังหวัด"
          @select="onAddressSelect($event)" />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="props.form"
        label="รหัสไปรษณีย์"
        name="postCode"
        tag="div"
        hide-error>
        <AddressFieldInput
          v-model="model.postCode"
          :invalid="invalid"
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
        v-model="model.aerialPhotoNumber"
        :form="props.form"
        label="หมายเลข"
        name="aerialPhotoNumber"
        placeholder="กรอกหมายเลข"
        hide-error />
      <LabelField
        v-model="model.aerialPhotoSheet"
        :form="props.form"
        label="แผ่นที่"
        name="aerialPhotoSheet"
        placeholder="กรอกแผ่นที่"
        hide-error />
    </div>
    <Divider>
      <span class="text-sm font-bold text-surface-600">เนื้อที่</span>
    </Divider>
    <div class="grid grid-cols-3 gap-4">
      <LabelField
        v-slot="{ invalid }"
        :form="props.form"
        label="ไร่"
        name="areaRai"
        tag="div"
        hide-error>
        <InputNumber
          v-model="model.areaRai"
          :invalid="invalid"
          class="h-9! shadow-none!"
          placeholder="0"
          fluid />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="props.form"
        label="งาน"
        name="areaRgan"
        tag="div"
        hide-error>
        <InputNumber
          v-model="model.areaRgan"
          :invalid="invalid"
          class="h-9! shadow-none!"
          placeholder="0"
          fluid />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="props.form"
        label="ตารางวา"
        name="areaTarangWa"
        tag="div"
        hide-error>
        <InputNumber
          v-model="model.areaTarangWa"
          :invalid="invalid"
          class="h-9! shadow-none!"
          placeholder="0"
          fluid />
      </LabelField>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IFormState } from '@/models/Form.model'
import { LandAssetTypeItems } from '@/enums/modules/contract/AssetType.enum'
import AddressFieldInput, { type IAddressData } from '@/components/input/AddressFieldInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import type { LandFormValues } from '../schema/land.schema'

interface IProps {
  form?: IFormState
}

const props = withDefaults(defineProps<IProps>(), {
  form: undefined
})

const model = defineModel<LandFormValues>({ required: true })

function onAddressSelect (data: IAddressData): void {
  model.value.subDistrict = data.subDistrict
  model.value.district = data.district
  model.value.province = data.province
  model.value.postCode = data.postalCode
}
</script>
