<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="ประเภทหลักทรัพย์"
        name="type"
        tag="div"
        hide-error
        required>
        <SelectInput
          v-model="type"
          :invalid="invalid"
          :options="LandAssetTypeItems"
          name="type"
          option-label="label"
          option-value="value"
          placeholder="เลือกประเภทหลักทรัพย์" />
      </LabelField>
      <LabelField
        v-model="detail"
        :form="form"
        label="รายละเอียดหลักทรัพย์"
        name="detail"
        placeholder="กรอกรายละเอียด"
        hide-error />
      <LabelField
        v-model="model.landNo"
        :form="form"
        label="เลขที่ดิน"
        name="landNo"
        placeholder="กรอกเลขที่ดิน"
        hide-error
        required />
      <LabelField
        v-model="model.surveyNo"
        :form="form"
        label="เลขหน้าสำรวจ"
        name="surveyNo"
        placeholder="กรอกเลขหน้าสำรวจ"
        hide-error />
    </div>
    <LabelField
      v-model="model.address"
      :form="form"
      label="ตำแหน่งที่ดิน"
      name="address"
      placeholder="กรอกตำแหน่งที่ดิน"
      hide-error />
    <Divider />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="ตำบล"
        name="subDistrict"
        tag="div"
        hide-error>
        <AddressFieldInput
          v-model="model.subDistrict"
          :invalid="invalid"
          address-type="sub-district"
          name="subDistrict"
          placeholder="เลือกตำบล"
          @select="onAddressSelect($event)" />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="อำเภอ"
        name="district"
        tag="div"
        hide-error>
        <AddressFieldInput
          v-model="model.district"
          :invalid="invalid"
          address-type="district"
          name="district"
          placeholder="เลือกอำเภอ"
          @select="onAddressSelect($event)" />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="จังหวัด"
        name="province"
        tag="div"
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
        v-slot="{ invalid }"
        :form="form"
        label="รหัสไปรษณีย์"
        name="postCode"
        tag="div"
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
    <Divider>
      <span class="text-sm font-bold text-surface-600">ระวางรูปถ่ายทางอากาศ</span>
    </Divider>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LabelField
        v-model="model.aerialPhotoMapNo"
        :form="form"
        label="หมายเลข"
        name="aerialPhotoMapNo"
        placeholder="กรอกหมายเลข"
        hide-error />
      <LabelField
        v-model="model.aerialPhotoSheet"
        :form="form"
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
        :form="form"
        label="ไร่"
        name="landAreaRai"
        tag="div"
        hide-error>
        <InputNumber
          v-model="model.landAreaRai"
          :invalid="invalid"
          class="h-9! shadow-none!"
          name="landAreaRai"
          placeholder="0"
          fluid />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="งาน"
        name="landAreaNgan"
        tag="div"
        hide-error>
        <InputNumber
          v-model="model.landAreaNgan"
          :invalid="invalid"
          class="h-9! shadow-none!"
          name="landAreaNgan"
          placeholder="0"
          fluid />
      </LabelField>
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="ตารางวา"
        name="landAreaSquareWah"
        tag="div"
        hide-error>
        <InputNumber
          v-model="model.landAreaSquareWah"
          :invalid="invalid"
          class="h-9! shadow-none!"
          name="landAreaSquareWah"
          placeholder="0"
          fluid />
      </LabelField>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IFormState } from '@/models/Form.model'
import { LandAssetTypeItems, type TAssetType } from '@/enums/modules/contract/AssetType.enum'
import AddressFieldInput, { type IAddressData } from '@/components/input/AddressFieldInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import type { LandFormValues } from '../schema/land.schema'

interface IProps {
  form?: IFormState
}

withDefaults(defineProps<IProps>(), {
  form: undefined
})

const model = defineModel<LandFormValues>({ required: true })
const type = defineModel<TAssetType>('type', { required: true })
const detail = defineModel<string>('detail', { required: true })

function onAddressSelect (data: IAddressData): void {
  model.value.subDistrict = data.subDistrict
  model.value.district = data.district
  model.value.province = data.province
  model.value.postCode = data.postalCode
}
</script>
