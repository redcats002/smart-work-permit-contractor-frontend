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
        required
        @keypress="keypress.number"
        @paste="handlePasteIdNo($event)" />
      <LabelField
        v-model="model.taxId"
        :form="form"
        label="เลขประจำตัวผู้เสียภาษี"
        name="taxId"
        hide-error
        required
        @keypress="keypress.thaiCitizenId"
        @paste="handlePasteTaxId($event)" />
      <LabelField
        v-slot="{invalid}"
        :form="form"
        label="วันที่เปิดสาขา"
        name="openAt"
        required>
        <DatePickerInput
          v-model="model.openAt"
          :invalid="invalid"
          :max-date="dayjs().toDate()"
          name="openAt" />
      </LabelField>
      <ManagementPositionLineHeadSelection
        v-model="model.managementPositionId"
        :form="form"
        label="หัวหน้าสาย"
        name="managementPositionId"
        placeholder="เลือกหัวหน้าสาย"
        required />
      <div>
        <div class="label-section mb-1">
          <span class="text-sm font-bold required">การคิด%ยอดเก็บ ในรายงาน</span>
        </div>
        <div class="flex gap-4 items-center">
          <label class="flex gap-2 items-center cursor-pointer">
            <input
              v-model="model.includeInReport"
              :checked="model.includeInReport === true"
              :value="true"
              class="accent-[#bd0102] size-4"
              name="includeInReport"
              type="radio">
            <span class="text-base text-[#333]">นับยอดเก็บ</span>
          </label>
          <label class="flex gap-2 items-center cursor-pointer">
            <input
              v-model="model.includeInReport"
              :checked="model.includeInReport === false"
              :value="false"
              class="accent-[#bd0102] size-4"
              name="includeInReport"
              type="radio">
            <span class="text-base text-[#333]">ไม่นับยอดเก็บ</span>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDayjs } from '@/utils/Dayjs'
import keypress from '@/utils/Keypress'
import paste from '@/utils/Paste'
import type { IFormState } from '@/models/Form.model'
import { BranchStatusEnum } from '@/enums/modules/branch/BranchStatus.enum'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import Switch from '@/components/input/Switch.vue'
import ManagementPositionLineHeadSelection from '@/components/selection/modules/api/management-position-line-head/ManagementPositionLineHeadSelection.vue'
import { type BranchFormValues, useFormInitialValues } from '../schema/branch.schema'

interface IProps {
  form?: IFormState
}

defineProps<IProps>()

const dayjs = useDayjs()

const model = defineModel<BranchFormValues>({
  default: useFormInitialValues()
})
const formKey = defineModel<number>('formKey', { required: true })

const isActive = computed({
  get (): boolean {
    return model.value?.status === BranchStatusEnum.ACTIVE ? true : false
  },
  set (value: boolean): void {
    model.value.status = value ? BranchStatusEnum.ACTIVE : BranchStatusEnum.INACTIVE
  }
})

function handlePasteNumber (evt: ClipboardEvent, key: Extract<keyof BranchFormValues, string>): void {
  (model.value as Record<string, unknown>)[key] = ''
  ;(model.value as Record<string, unknown>)[key] = paste.number(evt)
  formKey.value++
}

function handlePasteIdNo (evt: ClipboardEvent): void {
  handlePasteNumber(evt, 'idNo')
}
function handlePasteTaxId (evt: ClipboardEvent): void {
  handlePasteNumber(evt, 'taxId')
}
</script>

<style scoped>
.label-section > span.required::after {
  content: '*';
  color: var(--color-primary-500);
  margin-left: 4px;
}
</style>
