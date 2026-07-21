<template>
  <BaseModal
    v-model="visible"
    :style="{ width: 'min(95vw, 500px)' }">
    <template #default="{ close }">
      <Form
        :key="formKey"
        v-slot="$form"
        :initial-values="formData"
        :resolver="resolver"
        class="grid grid-cols-1 gap-4"
        @submit="onSubmit($event, close)">
        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          label="หมวดหมู่ค่าใช้จ่าย"
          name="expenseCategoryId"
          tag="div"
          hide-error
          required>
          <FinanceExpenseCategorySelection
            v-model="formData.expenseCategoryId"
            :invalid="invalid"
            name="expenseCategoryId"
            @update:model-value="onCategoryChange()" />
        </LabelField>

        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          label="ประเภทค่าใช้จ่าย"
          name="expenseTypeId"
          tag="div"
          hide-error
          required>
          <FinanceExpenseTypeSelection
            v-model="formData.expenseTypeId"
            :expense-category-id="formData.expenseCategoryId"
            :invalid="invalid"
            name="expenseTypeId" />
        </LabelField>

        <LabelField
          v-model="formData.note"
          :form="$form"
          label="คำอธิบาย"
          name="note"
          required />

        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          label="จำนวนเงิน"
          name="amount"
          tag="div"
          hide-error
          required>
          <InputNumber
            v-model="formData.amount"
            :invalid="invalid"
            :max-fraction-digits="2"
            :min="0"
            name="amount"
            fluid />
        </LabelField>

        <LabelField
          :form="$form"
          label="หลักฐานการชำระ"
          name="file"
          tag="div"
          hide-error
          required>
          <UploadInput
            v-model="formData.file"
            class="border border-dashed border-gray-700 rounded-md"
            detail=""
            icon="material-symbols-light:upload-file-outline"
            icon-class="size-20"
            name="file"
            remove-button-class="text-(--p-gray-4)! border rounded-full border-(--p-gray-4)! p-1"
            remove-icon="solar:trash-bin-2-linear"
            hide-button
            touchable>
            <template #label>
              <span>
                ลากและวางไฟล์ที่นี่ หรือ
                <span class="font-bold underline">เลือกไฟล์</span>
              </span>
            </template>
          </UploadInput>
        </LabelField>

        <LabelField
          :form="$form"
          label="ประเภท VAT"
          name="vatType"
          hide-error>
          <div class="flex gap-6">
            <label
              v-for="vatOption in vatTypeItems"
              :key="vatOption.value as string"
              class="flex items-center gap-2 cursor-pointer">
              <input
                v-model="(formData.vatType as string)"
                :value="vatOption.value"
                class="accent-red-500 size-4"
                name="vatType"
                type="radio">
              <span class="text-sm">{{ vatOption.label }}</span>
            </label>
          </div>
        </LabelField>

        <FormAction
          class="mt-2"
          @cancel="close()" />
      </Form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { toast } from '@/plugins/toast'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IMedia } from '@/resources/provider/Upload.provider'
import FormAction from '@/components/button/FormAction.vue'
import LabelField from '@/components/input/LabelField.vue'
import UploadInput from '@/components/input/UploadInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import FinanceExpenseCategorySelection from '@/components/selection/modules/api/finance-expense-category/FinanceExpenseCategorySelection.vue'
import FinanceExpenseTypeSelection from '@/components/selection/modules/api/finance-expense-type/FinanceExpenseTypeSelection.vue'
import { type EVatType, VatTypeItems } from '@/enums/modules/Vat.enum'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { type SaveExpenseFormValues, SaveExpenseSchema, useFormInitialValues } from '../schema/saveExpense.schema'
import type { IRefinanceExpense } from '@/models/request/refinance/RefinanceReq.model'
import type { ICloseContractFile } from '@/models/request/close-contract/CloseContractReq.model'

interface IEmits {
  submit: [data: IRefinanceExpense]
  edit: [payload: { index: number, data: IRefinanceExpense }]
}

interface IProps {
  editIndex?: number | null
  editData?: IRefinanceExpense | null
}

const props = withDefaults(defineProps<IProps>(), {
  editIndex: null,
  editData: null
})

const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>({ default: false })
const formKey = ref<number>(0)
const formData = ref<SaveExpenseFormValues>(useFormInitialValues())
const resolver = zodResolver(SaveExpenseSchema)
const vatTypeItems = VatTypeItems

watch(visible, (val: boolean): void => {
  if (val && props.editData) {
    formData.value = {
      expenseCategoryId: props.editData.expenseCategoryId,
      expenseTypeId: props.editData.expenseTypeId,
      note: props.editData.remark ?? '',
      amount: props.editData.amount,
      file: (props.editData.files as IMedia[]) ?? [],
      vatType: props.editData.vatType
    }
    formKey.value++
  }
})

function onCategoryChange (): void {
  formData.value.expenseTypeId = undefined
}

function onSubmit (event: FormSubmitEvent, close: () => void): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }

  const submitData: IRefinanceExpense = {
    expenseCategoryId: event.states?.expenseCategoryId?.value?.id ?? formData.value.expenseCategoryId as number,
    expenseTypeId: event.states?.expenseTypeId?.value?.id ?? formData.value.expenseTypeId as number,
    remark: event.states?.note?.value ?? formData.value.note,
    amount: event.states?.amount?.value ?? formData.value.amount,
    files: formData.value.file as ICloseContractFile[],
    vatType: formData.value.vatType as EVatType
  }

  if (props.editIndex !== null && props.editIndex !== undefined) {
    emits('edit', { index: props.editIndex, data: submitData })
    toast.success('แก้ไขรายการค่าใช้จ่ายสำเร็จ')
  } else {
    emits('submit', submitData)
    toast.success('เพิ่มรายการค่าใช้จ่ายสำเร็จ')
  }

  formData.value = useFormInitialValues()
  formKey.value++
  close()
}
</script>
