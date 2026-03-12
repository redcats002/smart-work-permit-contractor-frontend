<template>
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
        :options="VehicleAssetTypeItems"
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
      hide-error
      required />
    <LabelField
      v-model="model.licensePlate"
      :form="props.form"
      label="เลขทะเบียนรถ"
      name="licensePlate"
      placeholder="กรอกเลขทะเบียนรถ"
      hide-error
      required />
    <LabelField
      v-slot="{ invalid }"
      :form="props.form"
      label="จังหวัด"
      name="vehicleProvince"
      tag="div"
      hide-error
      required>
      <AddressFieldInput
        v-model="model.vehicleProvince"
        :invalid="invalid"
        address-type="province"
        placeholder="เลือกจังหวัด"
        @select="model.vehicleProvince = $event.province" />
    </LabelField>
    <LabelField
      v-slot="{ invalid }"
      :form="props.form"
      label="ปีที่ผลิต"
      name="yearManufactured"
      tag="div"
      hide-error
      required>
      <SelectInput
        v-model="model.yearManufactured"
        :invalid="invalid"
        :options="yearOptions"
        option-label="label"
        option-value="value"
        placeholder="เลือกปีที่ผลิต" />
    </LabelField>
    <LabelField
      v-slot="{ invalid }"
      :form="props.form"
      label="ปีที่จดทะเบียน"
      name="yearRegistered"
      tag="div"
      hide-error
      required>
      <SelectInput
        v-model="model.yearRegistered"
        :invalid="invalid"
        :options="yearOptions"
        option-label="label"
        option-value="value"
        placeholder="เลือกปีที่จดทะเบียน" />
    </LabelField>
    <LabelField
      v-model="model.chassisNumber"
      :form="props.form"
      label="หมายเลขตัวถัง"
      name="chassisNumber"
      placeholder="กรอกหมายเลขตัวถัง"
      hide-error
      required />
    <LabelField
      v-slot="{ invalid }"
      :form="props.form"
      label="เลขไมล์ (กม.)"
      name="mileage"
      tag="div"
      hide-error
      required>
      <InputNumber
        v-model="model.mileage"
        :invalid="invalid"
        :use-grouping="true"
        class="h-9! shadow-none!"
        placeholder="กรอกเลขไมล์"
        fluid />
    </LabelField>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IFormState } from '@/models/Form.model'
import { VehicleAssetTypeItems } from '@/enums/modules/contract/AssetType.enum'
import AddressFieldInput from '@/components/input/AddressFieldInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import type { VehicleFormValues } from '../schema/vehicle.schema'

interface IProps {
  form?: IFormState
}

const props = withDefaults(defineProps<IProps>(), {
  form: undefined
})

const model = defineModel<VehicleFormValues>({ required: true })

const currentYear = new Date().getFullYear()

interface IYearOption {
  label: string
  value: number
}

const yearOptions = computed((): IYearOption[] =>
  Array.from({ length: currentYear - 1979 }, (_: unknown, i: number): IYearOption => ({
    label: String(currentYear - i),
    value: currentYear - i
  }))
)
</script>
