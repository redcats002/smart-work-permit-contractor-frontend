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
          name="incomeCategoryId"
          tag="div"
          hide-error
          required>
          <FinanceIncomeCategorySelection
            v-model="formData.incomeCategoryId"
            :invalid="invalid"
            name="incomeCategoryId"
            @update:model-value="onCategoryChange()" />
        </LabelField>

        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          label="ประเภทค่าใช้จ่าย"
          name="incomeTypeId"
          tag="div"
          hide-error
          required>
          <FinanceIncomeTypeSelection
            v-model="formData.incomeTypeId"
            :income-category-id="formData.incomeCategoryId"
            :invalid="invalid"
            name="incomeTypeId" />
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

        <div class="grid grid-cols-1 gap-1">
          <span class="text-sm font-bold">ประเภท VAT</span>
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
        </div>
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
          <span class="font-bold text-gray-700 whitespace-nowrap">หมวดหมู่รายได้</span>
          <span>: {{ formRead?.incomeCategory?.name || '-' }}</span>
          <span class="font-bold text-gray-700 whitespace-nowrap">ประเภทรายได้</span>
          <span>: {{ formRead?.incomeType?.name || '-' }}</span>
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
import { toast } from '@/plugins/toast'
import { useDayjs } from '@/utils/Dayjs'
import { formatter } from '@/utils/Formatter'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { ICreateIncome } from '@/models/request/contract/ContractReq.model'
import type { IContractIncomeList } from '@/models/response/contract/ContractRes.model'
import { EVatType, formatTitle as formatVatTitle, VatTypeItems } from '@/enums/modules/Vat.enum'
import ContractProvider, { type IContractProvider } from '@/resources/provider/contract/Contract.provider'
import type { IMenuItemAction } from '@/components/base/BaseActionMenu.vue'
import BaseActionMenu from '@/components/base/BaseActionMenu.vue'
import FormAction from '@/components/button/FormAction.vue'
import FileAttachment from '@/components/display/FileAttachment.vue'
import LabelField from '@/components/input/LabelField.vue'
import UploadInput from '@/components/input/UploadInput.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import FinanceIncomeCategorySelection from '@/components/selection/modules/api/finance-income-category/FinanceIncomeCategorySelection.vue'
import FinanceIncomeTypeSelection from '@/components/selection/modules/api/finance-income-type/FinanceIncomeTypeSelection.vue'
import useUpload from '@/composables/useUpload'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { useInitDetail } from './composables/useInitIncome'
import { type IncomeFormValues, IncomeSchema, useFormInitialValues } from './schema/income.schema'

export type TIncomeModalMode = 'create' | 'read' | 'edit' | 'delete'

interface IProps {
  mode: TIncomeModalMode
  item?: IContractIncomeList
  contractId: number
}

interface IEmits {
  update: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>('visible', { default: false })

const ContractService: IContractProvider = new ContractProvider()
const { getUploadImages } = useUpload()

const dayjs = useDayjs()

const formKey = ref<number>(0)
const currentMode = ref<TIncomeModalMode>(props.mode)
const formRead = useInitDetail()
const resolver = zodResolver(IncomeSchema)
const formData = ref<IncomeFormValues>(useFormInitialValues())
const vatTypeItems = VatTypeItems

const isFormMode = computed((): boolean => currentMode.value === 'create' || currentMode.value === 'edit')
const modalLabel = computed((): string => {
  const labels: Record<TIncomeModalMode, string> = {
    create: 'บันทึกค่าใช้จ่าย',
    edit: 'แก้ไขค่าใช้จ่าย',
    read: 'รายละเอียด',
    delete: 'ยืนยันการลบ'
  }
  return labels[currentMode.value]
})
const readMenuItems = computed((): IMenuItemAction[] => [
  { label: 'แก้ไข', key: 'edit', type: 'TEXT', action: switchToEdit },
  { label: 'ลบ', key: 'delete', type: 'TEXT', action: switchToDelete }
])


function switchToEdit (): void {
  currentMode.value = 'edit'
  populateForm()
}

function switchToDelete (): void {
  currentMode.value = 'delete'
}

async function populateForm (): Promise<void> {
  if (!props.item) return
  const incomeCategoryId = formRead.value.incomeCategory?.id != null ? Number(formRead.value.incomeCategory.id) : undefined
  const incomeTypeId = formRead.value.incomeType?.id != null ? Number(formRead.value.incomeType.id) : undefined
  formData.value.incomeCategoryId = incomeCategoryId
  await nextTick()
  formData.value = {
    incomeCategoryId,
    incomeTypeId,
    note: formRead.value.note || '',
    amount: formRead.value.amount || 0,
    file: formRead.value.file || [],
    vatType: formRead.value.vatType ? EVatType[formRead.value.vatType] : EVatType.VAT
  }
  formKey.value++
}

async function onOpen (): Promise<void> {
  currentMode.value = props.mode
  if (props.mode === 'create') {
    formData.value = useFormInitialValues()
    formData.value.file = []
    formKey.value++
    return
  }

  if (props.item?.id) {
    const { data } = await ContractService.getIncomeById(Number(props.item.id))
    formRead.value = data

    if (props.mode === 'edit') {
      populateForm()
    }
  }
}


function onCategoryChange (): void {
  formData.value.incomeTypeId = undefined
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
    incomeCategoryId: event.states?.incomeCategoryId?.value?.id ? event.states?.incomeCategoryId?.value?.id : formRead.value.incomeCategory.id,
    incomeTypeId: event.states?.incomeTypeId?.value?.id ? event.states?.incomeTypeId?.value?.id : formRead.value.incomeType.id,
    amount: event.states?.amount?.value ? event.states?.amount?.value : formRead.value.amount,
    file: formData.value.file,
    note: event.states?.note?.value ? event.states?.note?.value : formRead.value.note,
    vatType: formData.value.vatType
  } as ICreateIncome

  const itemId = props.item?.id
  handleLoading(async (): Promise<void> => {
    await uploadAndSetFile()
    if (currentMode.value === 'create') {
      await ContractService.createIncome(props.contractId, values)
      toast.success('บันทึกรายได้สำเร็จ')
    } else if (currentMode.value === 'edit' && itemId) {
      await ContractService.updateIncome(itemId, values)
      toast.success('แก้ไขรายได้สำเร็จ')
    }
    emits('update')
    close()
  })
}

function onDelete (close: () => void): void {
  const id = props.item?.id
  if (!id) return
  handleLoading(async (): Promise<void> => {
    await ContractService.deleteIncome(id)
    toast.success('ลบรายได้สำเร็จ')
    emits('update')
    close()
  })
}

watch((): TIncomeModalMode => props.mode, (val: TIncomeModalMode): void => {
  currentMode.value = val
})
</script>
