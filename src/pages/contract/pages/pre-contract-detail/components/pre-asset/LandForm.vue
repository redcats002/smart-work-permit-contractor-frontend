<template>
  <div class="flex flex-col gap-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="ประเภทหลักทรัพย์"
        name="type"
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
        hide-error
        required />
    </div>
    <Divider />
    <span class="text-sm font-bold text-surface-600">ตำแหน่งที่ดิน</span>
    <LabelField
      v-if="isTitleDeed"
      v-model="model.aerialPhotoSheet"
      :form="form"
      label="ระวางรูปถ่ายทางอากาศ"
      name="aerialPhotoSheet"
      placeholder="กรอกระวางรูปถ่ายทางอากาศ"
      hide-error />
    <LabelField
      v-model="model.address"
      :form="form"
      label="ที่อยู่"
      name="address"
      placeholder="กรอกที่อยู่"
      hide-error />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="ตำบล"
        name="subDistrict"
        hide-error
        required>
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
        hide-error
        required>
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
    </div>
    <LabelField
      v-model="model.urlGoogleMap"
      :form="form"
      label="URL Google Map"
      name="urlGoogleMap"
      placeholder="กรอก URL Google Map"
      hide-error />
    <Divider />
    <span class="text-sm font-bold text-surface-600">ทะเบียน</span>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LabelField
        v-model="model.landNo"
        :form="form"
        label="เลขที่ดิน"
        name="landNo"
        placeholder="กรอกเลขที่ดิน"
        hide-error
        required />
      <div
        v-if="isTitleDeed"
        class="invisible md:visible" />
      <LabelField
        v-model="model.surveyNo"
        :form="form"
        label="หน้าสำรวจ"
        name="surveyNo"
        placeholder="กรอกเลขหน้าสำรวจ"
        hide-error
        required />
      <template v-if="isTitleDeed">
        <LabelField
          v-model="model.titleDeedNo"
          :form="form"
          label="โฉนดเลขที่"
          name="titleDeedNo"
          placeholder="กรอกโฉนดเลขที่"
          hide-error
          required />
      </template>
      <template v-else>
        <LabelField
          v-model="model.aerialPhotoMapNo"
          :form="form"
          label="หมายเลข"
          name="aerialPhotoMapNo"
          placeholder="กรอกหมายเลข"
          hide-error
          required />
        <LabelField
          v-model="model.aerialPhotoSheet"
          :form="form"
          label="แผ่นที่"
          name="aerialPhotoSheet"
          placeholder="กรอกแผ่นที่"
          hide-error
          required />
      </template>
    </div>
    <Divider />
    <span class="text-sm font-bold text-surface-600">เนื้อที่</span>
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import keypress from '@/utils/Keypress'
import paste from '@/utils/Paste'
import type { IFormState } from '@/models/Form.model'
import { LandAssetTypeItems, type TAssetType } from '@/enums/modules/asset/AssetType.enum'
import AddressFieldInput, { type IAddressData } from '@/components/input/AddressFieldInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import type { ModalLandFormValues } from '../../schema/land.schema'

interface IProps {
  form?: IFormState
}

withDefaults(defineProps<IProps>(), {
  form: undefined
})

const model = defineModel<ModalLandFormValues>({ required: true })
const type = defineModel<TAssetType>('type', { required: true })
const detail = defineModel<string>('detail', { required: true })

const isTitleDeed = computed((): boolean =>
  type.value === 'TITLE_DEED_WITH_BUILDING' || type.value === 'TITLE_DEED_VACANT_LAND'
)

function onAddressSelect (data: IAddressData): void {
  model.value.subDistrict = data.subDistrict
  model.value.district = data.district
  model.value.province = data.province
  model.value.postCode = data.postalCode
}
</script>
