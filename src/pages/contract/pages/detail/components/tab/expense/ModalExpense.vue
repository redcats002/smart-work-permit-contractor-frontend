<template>
  <BaseModal
    v-model="visible"
    :label="modalLabel"
    :style="{ width: 'min(95vw, 500px)' }"
    @open="onOpen()">
    <template
      v-if="currentMode==='READ'"
      #menu>
      <div class="flex justify-end">
        <BaseActionMenu :items="readMenuItems" />
      </div>
    </template>
    <template #default="{ close }">
      <!-- FORM MODE: create / edit -->
      <Form
        v-if="isFormMode"
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
          name="url"
          tag="div"
          hide-error
          required>
          <UploadInput
            v-model="formData.file"
            class="border border-dashed border-gray-700 rounded-md"
            detail=""
            icon="material-symbols-light:upload-file-outline"
            icon-class="size-20"
            name="url"
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

      <!-- READ MODE -->
      <div
        v-else-if="currentMode === 'READ'"
        class="grid gap-4">
        <div class="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
          <span class="font-bold text-gray-700 whitespace-nowrap">วันที่</span>
          <span>: {{ dayjs.formatDate(props.item?.date || '') }}</span>
          <span class="font-bold text-gray-700 whitespace-nowrap">หมวดหมู่ค่าใช้จ่าย</span>
          <span>: {{ formRead?.expenseCategory?.name || '-' }}</span>
          <span class="font-bold text-gray-700 whitespace-nowrap">ประเภทค่าใช้จ่าย</span>
          <span>: {{ formRead?.expenseType?.name || '-' }}</span>
          <span class="font-bold text-gray-700 whitespace-nowrap">จำนวนเงิน</span>
          <span>: {{ formatter.thaiBaht(formRead?.amount || 0) }}</span>
          <span class="font-bold text-gray-700 whitespace-nowrap">ประเภท VAT</span>
          <span>: {{ formRead?.vatType ? formatVatTitle(formRead.vatType) : '-' }}</span>
        </div>
        <div v-if="formRead.file?.length">
          <FileAttachment :files="formRead.file" />
        </div>
      </div>

      <!-- DELETE MODE -->
      <div
        v-else-if="currentMode === 'DELETE'"
        class="grid gap-6">
        <div class="flex flex-col items-center justify-center text-sm text-gray-700 gap-1 py-4">
          <p>คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้</p>
          <p class="text-surface-500">
            หากลบแล้ว ข้อมูลนี้จะถูกลบอย่างถาวรไม่สามารถย้อนกลับได้
          </p>
        </div>
        <FormAction
          confirm-label="ใช่, ฉันต้องการลบ"
          mode="delete"
          @cancel="close()"
          @confirm="onDelete(close)" />
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { toast } from '@/plugins/toast'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { TActionMode } from '@/models/Global.model'
import type { ICreateExpense } from '@/models/request/contract-expense/ContractExpenseReq.model'
import type { IContractExpenseList } from '@/models/response/contract-expense/ContractExpenseRes.model'
import { EVatType, formatTitle as formatVatTitle, VatTypeItems } from '@/enums/modules/Vat.enum'
import ContractExpenseProvider, { type IContractExpenseProvider } from '@/resources/provider/contract-expense/ContractExpense.provider'
import type { IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import BaseActionMenu from '@/components/base/BaseActionMenu.vue'
import FormAction from '@/components/button/FormAction.vue'
import FileAttachment from '@/components/display/FileAttachment.vue'
import LabelField from '@/components/input/LabelField.vue'
import UploadInput from '@/components/input/UploadInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import FinanceExpenseCategorySelection from '@/components/selection/modules/api/finance-expense-category/FinanceExpenseCategorySelection.vue'
import FinanceExpenseTypeSelection from '@/components/selection/modules/api/finance-expense-type/FinanceExpenseTypeSelection.vue'
import useUpload from '@/composables/useUpload'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useInitDetail } from './composables/useInitExpense'
import { type ExpenseFormValues, ExpenseSchema, useFormInitialValues } from './schema/expense.schema'

export type TExpenseModalMode = TActionMode

interface IProps {
  mode: TExpenseModalMode
  item?: IContractExpenseList
  contractId: number
}

interface IEmits {
  update: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>('visible', { default: false })

const ContractExpenseService: IContractExpenseProvider = new ContractExpenseProvider()

const dayjs = useDayjs()

const formKey = ref<number>(0)
const currentMode = ref<TExpenseModalMode>(props.mode)
const formRead = useInitDetail()
const formData = ref<ExpenseFormValues>(useFormInitialValues())
const resolver = zodResolver(ExpenseSchema)

const vatTypeItems = VatTypeItems
const { getUploadImages } = useUpload()

const isFormMode = computed((): boolean => currentMode.value === 'CREATE' || currentMode.value === 'UPDATE')

const modalLabel = computed((): string => {
  const labels: Record<TExpenseModalMode, string> = {
    CREATE: 'บันทึกค่าใช้จ่าย',
    UPDATE: 'แก้ไขค่าใช้จ่าย',
    READ: 'รายละเอียด',
    DELETE: 'ยืนยันการลบ'
  }
  return labels[currentMode.value]
})

function switchToEdit (): void {
  currentMode.value = 'UPDATE'
  populateForm()
}

function switchToDelete (): void {
  currentMode.value = 'DELETE'
}

const readMenuItems = computed((): IMenuItemAction[] => [
  { label: 'แก้ไข', key: 'edit', type: 'TEXT', action: switchToEdit },
  { label: 'ลบ', key: 'delete', type: 'TEXT', action: switchToDelete }
])

async function populateForm (): Promise<void> {
  if (!props.item) return
  const expenseCategoryId = formRead.value.expenseCategory?.id != null ? Number(formRead.value.expenseCategory.id) : undefined
  const expenseTypeId = formRead.value.expenseType?.id != null ? Number(formRead.value.expenseType.id) : undefined
  formData.value.expenseCategoryId = expenseCategoryId
  await nextTick()
  formData.value = {
    expenseCategoryId,
    expenseTypeId,
    note: formRead.value.note || '',
    amount: formRead.value.amount || 0,
    file: formRead.value.file || [],
    vatType: formRead.value.vatType ? EVatType[formRead.value.vatType] : EVatType.VAT
  }
  formKey.value++
}

async function onOpen (): Promise<void> {
  currentMode.value = props.mode
  if (props.mode === 'CREATE') {
    formData.value = useFormInitialValues()
    formData.value.file = []
    formKey.value++
    return
  }

  if (props.item?.id) {
    const { data } = await ContractExpenseService.getExpenseById(Number(props.item.id))
    formRead.value = data
    if (props.mode === 'UPDATE') {
      populateForm()
    }
  }
}

function onCategoryChange (): void {
  formData.value.expenseTypeId = undefined
}

async function uploadAndSetFile (): Promise<void> {
  if (!formData.value.file.length) return
  formData.value.file = await getUploadImages(formData.value.file)
}

function onSubmit (event: FormSubmitEvent, close: () => void): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  const values = {
    expenseCategoryId: event.states?.expenseCategoryId?.value?.id ? event.states?.expenseCategoryId?.value?.id : formRead.value.expenseCategory.id,
    expenseTypeId: event.states?.expenseTypeId?.value?.id ? event.states?.expenseTypeId?.value?.id : formRead.value.expenseType.id,
    amount: event.states?.amount?.value ? event.states?.amount?.value : formRead.value.amount,
    file: formData.value.file,
    note: event.states?.note?.value ? event.states?.note?.value : formRead.value.note,
    vatType: formData.value.vatType
  } as ICreateExpense

  const itemId = props.item?.id
  handleLoading(async (): Promise<void> => {
    await uploadAndSetFile()
    if (currentMode.value === 'CREATE') {
      await ContractExpenseService.createExpense(props.contractId, values)
      toast.success('บันทึกค่าใช้จ่ายสำเร็จ')
    } else if (currentMode.value === 'UPDATE' && itemId) {
      await ContractExpenseService.updateExpense(itemId, values)
      toast.success('แก้ไขค่าใช้จ่ายสำเร็จ')
    }
    emits('update')
    close()
  })
}

function onDelete (close: () => void): void {
  const id = props.item?.id
  if (!id) return
  handleLoading(async (): Promise<void> => {
    await ContractExpenseService.deleteExpense(id)
    toast.success('ลบค่าใช้จ่ายสำเร็จ')
    emits('update')
    close()
  })
}

watch((): TExpenseModalMode => props.mode, async (val: TExpenseModalMode): Promise<void> => {
  currentMode.value = val
})
</script>
