<template>
  <div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Switch
        v-model="isActive"
        class="col-span-3"
        false-label="ปิดใช้งาน"
        true-label="ใช้งาน"
        handle />
      <LabelField
        v-model="model.name"
        :form="form"
        label="ชื่อสาขา"
        name="name"
        hide-error
        required />
      <LabelField
        v-model="model.idNo"
        :form="form"
        label="Branch Code"
        name="idNo"
        hide-error
        required />
      <LabelField
        v-model="model.taxId"
        :form="form"
        label="เลขประจำตัวผู้เสียภาษี"
        name="taxId"
        hide-error
        required />
      <LabelField
        v-slot="{invalid}"
        :form="form"
        label="วันที่เปิดสาขา"
        name="openAt"
        hide-error
        required>
        <DatePickerInput
          v-model="model.openAt"
          :invalid="invalid"
          :max-date="dayjs().toDate()"
          name="openAt" />
      </LabelField>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import type { IFormState } from '@/models/Form.model'
import { BranchStatusEnum } from '@/enums/modules/branch/BranchStatus.enum'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import Switch from '@/components/input/Switch.vue'
import { type BranchFormValues, useFormInitialValues } from '../schema/branch.schema'

interface IProps {
  form?: IFormState
}

defineProps<IProps>()

const dayjs = useDayjs()

const model = defineModel<BranchFormValues>({
  default: useFormInitialValues()
})

const isActive = computed({
  get (): boolean {
    return model.value?.status === BranchStatusEnum.ACTIVE ? true : false
  },
  set (value: boolean): void {
    model.value.status = value ? BranchStatusEnum.ACTIVE : BranchStatusEnum.INACTIVE
  }
})
</script>

<style scoped>

</style>
