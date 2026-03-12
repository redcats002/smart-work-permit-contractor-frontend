<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
    <LabelField
      v-model="model.vehicleModel"
      :form="props.form"
      :name="`${props.namePrefix}.vehicleModel`"
      label="รุ่น"
      placeholder="กรอกรุ่น"
      required />
    <LabelField
      v-model="model.color"
      :form="props.form"
      :name="`${props.namePrefix}.color`"
      label="สี"
      placeholder="กรอกสี"
      required />
    <LabelField
      v-model="model.licensePlate"
      :form="props.form"
      :name="`${props.namePrefix}.licensePlate`"
      label="เลขทะเบียนรถ"
      placeholder="กรอกเลขทะเบียนรถ"
      required />
    <LabelField
      v-slot="{ invalid }"
      :form="props.form"
      :name="`${props.namePrefix}.vehicleProvince`"
      label="จังหวัด"
      tag="div"
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
      :name="`${props.namePrefix}.yearManufactured`"
      label="ปีที่ผลิต"
      tag="div"
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
      :name="`${props.namePrefix}.yearRegistered`"
      label="ปีที่จดทะเบียน"
      tag="div"
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
      :name="`${props.namePrefix}.chassisNumber`"
      label="หมายเลขตัวถัง"
      placeholder="กรอกหมายเลขตัวถัง"
      required />
    <LabelField
      v-model="model.engineNumber"
      :form="props.form"
      :name="`${props.namePrefix}.engineNumber`"
      label="หมายเลขเครื่อง"
      placeholder="กรอกหมายเลขเครื่อง"
      required />
    <LabelField
      v-slot="{ invalid }"
      :form="props.form"
      :name="`${props.namePrefix}.mileage`"
      label="เลขไมล์ (กม.)"
      tag="div"
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
import AddressFieldInput from '@/components/input/AddressFieldInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import type { VehicleFormValues } from '../schema/pre-contract.schema'

interface IProps {
  form?: IFormState
  namePrefix?: string
}

const props = withDefaults(defineProps<IProps>(), {
  form: undefined,
  namePrefix: ''
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
