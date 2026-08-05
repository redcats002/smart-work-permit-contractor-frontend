<template>
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
        :options="VehicleAssetTypeItems"
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
    <LabelField
      v-model="model.plateNo"
      :form="form"
      label="เลขทะเบียนรถ"
      name="plateNo"
      placeholder="กรอกเลขทะเบียนรถ"
      hide-error
      required />
    <LabelField
      v-slot="{ invalid }"
      :form="form"
      label="จังหวัด"
      name="province"
      tag="div"
      hide-error
      required>
      <ProvinceSelection
        v-model="model.province"
        :invalid="invalid"
        name="province"
        placeholder="เลือกจังหวัด" />
    </LabelField>
    <LabelField
      v-slot="{ invalid }"
      :form="form"
      label="ปีที่ผลิต"
      name="manufactureYear"
      tag="div"
      hide-error
      required>
      <SelectInput
        v-model="model.manufactureYear"
        :invalid="invalid"
        :options="yearOptions"
        name="manufactureYear"
        option-label="label"
        option-value="value"
        placeholder="เลือกปีที่ผลิต" />
    </LabelField>
    <LabelField
      v-slot="{ invalid }"
      :form="form"
      label="ปีที่จดทะเบียน"
      name="registrationYear"
      tag="div"
      hide-error
      required>
      <SelectInput
        v-model="model.registrationYear"
        :invalid="invalid"
        :options="yearOptions"
        name="registrationYear"
        option-label="label"
        option-value="value"
        placeholder="เลือกปีที่จดทะเบียน" />
    </LabelField>
    <LabelField
      v-model="model.vehicleIdentificationNo"
      :form="form"
      label="หมายเลขตัวถัง"
      name="vehicleIdentificationNo"
      placeholder="กรอกหมายเลขตัวถัง"
      hide-error
      required />
    <LabelField
      v-slot="{ invalid }"
      :form="form"
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
        name="mileage"
        placeholder="กรอกเลขไมล์"
        fluid />
    </LabelField>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { IFormState } from '@/models/Form.model'
import { type TAssetType, VehicleAssetTypeItems } from '@/enums/modules/asset/AssetType.enum'
import LabelField from '@/components/input/LabelField.vue'
import SelectInput from '@/components/input/SelectInput.vue'
import ProvinceSelection from '@/components/selection/modules/static/province/ProvinceSelection.vue'
import type { ModalVehicleFormValues } from '../../schema/pre-asset/vehicle.schema'

interface IProps {
  form?: IFormState
}


interface IYearOption {
  label: string
  value: string
}

withDefaults(defineProps<IProps>(), {
  form: undefined
})

const model = defineModel<ModalVehicleFormValues>({ required: true })
const type = defineModel<TAssetType>('type', { required: true })
const detail = defineModel<string>('detail', { required: true })

const currentYear = new Date().getFullYear()

const yearOptions = computed((): IYearOption[] =>
  Array.from({ length: currentYear - 1979 }, (_: unknown, i: number): IYearOption => ({
    label: String(currentYear - i),
    value: String(currentYear - i)
  }))
)
</script>
