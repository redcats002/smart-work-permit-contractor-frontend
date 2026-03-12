<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <LabelField
      label="ประเภทหลักทรัพย์"
      tag="div"
      required>
      <SelectInput
        v-model="form.collateralType"
        :options="VehicleEstateTypeItems"
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
      v-model="form.licensePlate"
      label="เลขทะเบียนรถ"
      placeholder="กรอกเลขทะเบียนรถ"
      required />
    <LabelField
      label="จังหวัด"
      tag="div"
      required>
      <AddressFieldInput
        v-model="form.vehicleProvince"
        address-type="province"
        placeholder="เลือกจังหวัด"
        @select="form.vehicleProvince = $event.province" />
    </LabelField>
    <LabelField
      label="ปีที่ผลิต"
      tag="div"
      required>
      <SelectInput
        v-model="form.yearManufactured"
        :options="yearOptions"
        option-label="label"
        option-value="value"
        placeholder="เลือกปีที่ผลิต" />
    </LabelField>
    <LabelField
      label="ปีที่จดทะเบียน"
      tag="div"
      required>
      <SelectInput
        v-model="form.yearRegistered"
        :options="yearOptions"
        option-label="label"
        option-value="value"
        placeholder="เลือกปีที่จดทะเบียน" />
    </LabelField>
    <LabelField
      v-model="form.chassisNumber"
      label="หมายเลขตัวถัง"
      placeholder="กรอกหมายเลขตัวถัง"
      required />
    <LabelField
      label="เลขไมล์ (กม.)"
      tag="div"
      required>
      <InputNumber
        v-model="form.mileage"
        :use-grouping="true"
        class="h-9! shadow-none!"
        placeholder="กรอกเลขไมล์"
        fluid />
    </LabelField>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { VehicleEstateTypeItems } from '@/enums/modules/contract/EstateType.enum'
import AddressFieldInput from '@/components/input/AddressFieldInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import SelectInput from '@/components/input/SelectInput.vue'

export interface IVehicleFormState {
  collateralType: string
  detail: string
  licensePlate: string
  vehicleProvince: string
  yearManufactured: number | null
  yearRegistered: number | null
  chassisNumber: string
  mileage: number | null
}

const form = defineModel<IVehicleFormState>({ required: true })

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
