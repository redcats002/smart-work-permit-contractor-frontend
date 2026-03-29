<template>
  <BaseModal
    v-model="visible"
    :label="modalLabel"
    :style="{ width: 'min(95vw, 500px)' }"
    @open="onOpen()">
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
            name="url" />
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
        v-else-if="currentMode === 'read'"
        class="grid gap-4">
        <div class="flex justify-end">
          <BaseActionMenu :items="readMenuItems" />
        </div>
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
        <img
          v-if="formRead?.file.length"
          :src="formRead.file[0]?.fileUrl"
          alt="หลักฐานการชำระ"
          class="w-full rounded-lg object-contain max-h-80">
      </div>

      <!-- DELETE MODE -->
      <div
        v-else-if="currentMode === 'delete'"
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
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { ICreateExpense } from '@/models/request/contract/ContractReq.model'
import type { IContractExpenseList } from '@/models/response/contract/ContractRes.model'
import { EVatType, formatTitle as formatVatTitle, VatTypeItems } from '@/enums/modules/Vat.enum'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import UploadProvider, {
  type IMedia,
  type IUploadProvider
} from '@/resources/provider/Upload.provider'
import type { IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import BaseActionMenu from '@/components/base/BaseActionMenu.vue'
import FormAction from '@/components/button/FormAction.vue'
import LabelField from '@/components/input/LabelField.vue'
import UploadInput from '@/components/input/UploadInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import FinanceExpenseCategorySelection from '@/components/selection/modules/api/finance-expense-category/FinanceExpenseCategorySelection.vue'
import FinanceExpenseTypeSelection from '@/components/selection/modules/api/finance-expense-type/FinanceExpenseTypeSelection.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useInitDetail } from './composables/useInitExpense'
import { type ExpenseFormValues, ExpenseSchema, useFormInitialValues } from './schema/expense.schema'

export type TExpenseModalMode = 'create' | 'read' | 'edit' | 'delete'

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

const ContractService: IContractProvider = new ContractProvider()
const UploadService: IUploadProvider = new UploadProvider()

const dayjs = useDayjs()

const formKey = ref<number>(0)
const currentMode = ref<TExpenseModalMode>(props.mode)
const formRead = useInitDetail()
const formData = ref<ExpenseFormValues>(useFormInitialValues())
const resolver = zodResolver(ExpenseSchema)

const vatTypeItems = VatTypeItems

const isFormMode = computed((): boolean => currentMode.value === 'create' || currentMode.value === 'edit')

const modalLabel = computed((): string => {
  const labels: Record<TExpenseModalMode, string> = {
    create: 'บันทึกค่าใช้จ่าย',
    edit: 'แก้ไขค่าใช้จ่าย',
    read: 'รายละเอียด',
    delete: 'ยืนยันการลบ'
  }
  return labels[currentMode.value]
})

function switchToEdit (): void {
  currentMode.value = 'edit'
  populateForm()
}

function switchToDelete (): void {
  currentMode.value = 'delete'
}

const readMenuItems = computed((): IMenuItemAction[] => [
  { label: 'แก้ไข', key: 'edit', type: 'TEXT', action: switchToEdit },
  { label: 'ลบ', key: 'delete', type: 'TEXT', action: switchToDelete }
])

async function populateForm (): Promise<void> {
  if (!props.item) return
  formData.value = {
    expenseCategoryId: formRead.value.expenseCategory?.id ? Number(formRead.value.expenseCategory.id) : undefined,
    expenseTypeId: formRead.value.expenseType?.id ? Number(formRead.value.expenseType.id) : undefined,
    note: formRead.value.note || '',
    amount: formRead.value.amount || 0,
    file: formRead.value.file || [],
    vatType: formRead.value.vatType ? EVatType[formRead.value.vatType] : EVatType.VAT
  }
  formData.value.file = []
  formData.value.expenseCategoryId = Number(formRead.value.expenseCategory?.id)
  await nextTick()
  formData.value.expenseTypeId = Number(formRead.value.expenseType?.id)
  await nextTick()
  formKey.value++
}

async function onOpen (): Promise<void> {
  currentMode.value = props.mode
  if (props.mode === 'create') {
    formData.value = useFormInitialValues()
    formData.value.file = []
    return
  }

  if (props.item?.id) {
    const { data } = await ContractService.getExpenseById(Number(props.item.id))
    formRead.value = data
    if (props.mode === 'edit') {
      populateForm()
    }
  }
}

watch((): TExpenseModalMode => props.mode, async (val: TExpenseModalMode): Promise<void> => {
  currentMode.value = val
})

function onCategoryChange (): void {
  formData.value.expenseTypeId = undefined
}

async function uploadAndSetFile (file?: File): Promise<void> {
  if (!file) return
  const response = await UploadService.uploadFile(file)
  formData.value.file = [response.data]
}

watch(formData.value.file, (e: IMedia[]): void => {
  if (e.length === 0) {
    formData.value.file = []
    return
  }
  handleLoading((): Promise<void> => uploadAndSetFile(e[e.length - 1]?.file))
}, { deep: true })

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
    if (currentMode.value === 'create') {
      await ContractService.createExpense(props.contractId, values)
    } else if (currentMode.value === 'edit' && itemId) {
      await ContractService.updateExpense(itemId, values)
    }
    emits('update')
    close()
  })
}

function onDelete (close: () => void): void {
  const id = props.item?.id
  if (!id) return
  handleLoading(async (): Promise<void> => {
    await ContractService.deleteExpense(id)
    emits('update')
    close()
  })
}
</script>
