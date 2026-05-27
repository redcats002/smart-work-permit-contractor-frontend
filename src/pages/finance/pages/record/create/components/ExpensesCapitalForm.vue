<template>
  <div class="grid grid-cols-2 gap-x-4 gap-y-5">
    <LabelField
      v-slot="{ invalid }"
      :form="form"
      label="รับ/จ่าย"
      name="type"
      tag="div"
      required>
      <ExpensesTypeSelection
        v-model="model.type"
        :invalid="invalid"
        name="type"
        placeholder="เลือกประเภทรับ/จ่าย"
        dropdown
        show-clear />
    </LabelField>
    <LabelField
      v-slot="{ invalid }"
      :form="form"
      label="สาขา"
      name="branchId"
      tag="div"
      required>
      <FinanceExpenseCategorySelection
        v-model="model.branchId"
        :invalid="invalid"
        name="branchId"
        placeholder="กรุณาเลือกสาขา" />
    </LabelField>
    <LabelField
      v-slot="{ invalid }"
      :form="form"
      label="วันที่จ่าย"
      name="expenseDate"
      tag="div"
      required>
      <DatePickerInput
        v-model="model.expenseDate"
        :invalid="invalid"
        name="expenseDate"
        placeholder="เลือกวันที่จ่าย" />
    </LabelField>
    <LabelField
      v-slot="{ invalid }"
      :form="form"
      label="จำนวนเงิน (บาท)"
      name="amount"
      tag="div"
      required>
      <InputNumber
        v-model="model.amount"
        :invalid="invalid"
        :use-grouping="true"
        class="h-9! shadow-none!"
        name="amount"
        placeholder="กรอกจำนวนเงิน"
        fluid />
    </LabelField>
    <FormField
      name="files">
      <LabelField
        v-slot="{ invalid }"
        :form="form"
        label="ไฟล์"
        name="files"
        tag="div"
        required>
        <FileInput
          v-model="model.files"
          :invalid="invalid"
          name="files"
          @update:model-value="emits('mount')" />
      </LabelField>
    </FormField>
    <LabelField
      v-slot="{ invalid }"
      :form="form"
      class="col-span-2 w-full"
      label="หมายเหตุ"
      name="reason"
      tag="div">
      <div class="flex w-full">
        <Textarea
          v-model="model.reason"
          :invalid="invalid"
          class="resize-none"
          cols="130"
          name="reason"
          rows="3" />
      </div>
    </LabelField>
  </div>
</template>

<script setup lang="ts">
import { type IFormState } from '@/models/Form.model'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import FileInput from '@/components/input/FileInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import FinanceExpenseCategorySelection from '@/components/selection/modules/api/finance-expense-category/FinanceExpenseCategorySelection.vue'
import ExpensesTypeSelection from '@/components/selection/modules/static/expense-type/ExpensesTypeSelection.vue'
import { FormField } from '@primevue/forms'
import { type ExpensesFormValues } from '../schema/expenses.schema'

interface IProps {
  form: IFormState
}
interface IEmits {
  mount: []
}

withDefaults(defineProps<IProps>(), {})
const emits = defineEmits<IEmits>()

const model = defineModel<ExpensesFormValues>({ required: true })
</script>

<style scoped>

</style>
