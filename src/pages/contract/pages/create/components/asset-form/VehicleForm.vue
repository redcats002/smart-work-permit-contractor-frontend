<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
    <LabelField
      v-model="model.model"
      :form="form"
      :name="`${namePrefix}.model`"
      label="รุ่น"
      placeholder="กรอกรุ่น"
      hide-error
      required />
    <LabelField
      v-model="model.color"
      :form="form"
      :name="`${namePrefix}.color`"
      label="สี"
      placeholder="กรอกสี"
      hide-error
      required />
    <LabelField
      v-model="model.plateNo"
      :form="form"
      :name="`${namePrefix}.plateNo`"
      label="เลขทะเบียนรถ"
      placeholder="กรอกเลขทะเบียนรถ"
      hide-error
      required />
    <LabelField
      v-slot="{ invalid }"
      :form="form"
      :name="`${namePrefix}.province`"
      label="จังหวัด"
      tag="div"
      hide-error
      required>
      <ProvinceSelection
        v-model="model.province"
        :invalid="invalid"
        :name="`${namePrefix}.province`"
        address-type="province"
        placeholder="เลือกจังหวัด"
        @select="model.province = $event.province" />
    </LabelField>
    <LabelField
      v-slot="{ invalid }"
      :form="form"
      :name="`${namePrefix}.manufactureYear`"
      label="ปีที่ผลิต"
      tag="div"
      hide-error
      required>
      <SelectInput
        v-model="model.manufactureYear"
        :invalid="invalid"
        :name="`${namePrefix}.manufactureYear`"
        :options="yearOptions"
        option-label="label"
        option-value="value"
        placeholder="เลือกปีที่ผลิต" />
    </LabelField>
    <LabelField
      v-slot="{ invalid }"
      :form="form"
      :name="`${namePrefix}.registrationYear`"
      label="ปีที่จดทะเบียน"
      tag="div"
      hide-error
      required>
      <SelectInput
        v-model="model.registrationYear"
        :invalid="invalid"
        :name="`${namePrefix}.registrationYear`"
        :options="yearOptions"
        option-label="label"
        option-value="value"
        placeholder="เลือกปีที่จดทะเบียน" />
    </LabelField>
    <LabelField
      v-model="model.vehicleIdentificationNo"
      :form="form"
      :name="`${namePrefix}.vehicleIdentificationNo`"
      label="หมายเลขตัวถัง"
      placeholder="กรอกหมายเลขตัวถัง"
      hide-error
      required />
    <LabelField
      v-model="model.engineNumber"
      :form="form"
      :name="`${namePrefix}.engineNumber`"
      label="หมายเลขเครื่อง"
      placeholder="กรอกหมายเลขเครื่อง"
      hide-error
      required />
    <LabelField
      v-slot="{ invalid }"
      :form="form"
      :name="`${namePrefix}.mileage`"
      label="เลขไมล์ (กม.)"
      tag="div"
      hide-error
      required>
      <InputNumber
        v-model="model.mileage"
        :invalid="invalid"
        :name="`${namePrefix}.mileage`"
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
import LabelField from '@/components/input/LabelField.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import ProvinceSelection from '@/components/selection/modules/static/province/ProvinceSelection.vue'
import type { VehicleFormValues } from '../../schema/pre-contract.schema'

interface IProps {
  form: IFormState
  namePrefix?: string
}

interface IYearOption {
  label: string
  value: string
}

withDefaults(defineProps<IProps>(), {
  namePrefix: ''
})

const model = defineModel<VehicleFormValues>({ required: true })

const currentYear = new Date().getFullYear()

const yearOptions = computed((): IYearOption[] =>
  Array.from({ length: currentYear - 1979 }, (_: unknown, i: number): IYearOption => ({
    label: String(currentYear - i),
    value: String(currentYear - i)
  }))
)
</script>
