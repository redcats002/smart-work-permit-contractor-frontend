<template>
  <section id="expenses-edit-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <BasePage>
      <Form
        :key="formKey"
        v-slot="$form"
        :initial-values="form"
        :resolver="resolver"
        class="flex flex-col gap-5 pb-10"
        @submit="onSubmit($event)">
        <BaseContainer>
          <div class="grid grid-cols-2 gap-x-4 gap-y-5">
            <div class="grid grid-cols-4 gap-2">
              <LabelField
                v-slot="{ invalid }"
                :form="$form"
                class="col-span-1"
                label="ประเภทค่าใช้จ่าย"
                name="expensesType"
                tag="div"
                required>
                <ExpensesTypeSelection
                  v-model="form.expensesType"
                  :invalid="invalid"
                  dropdown />
              </LabelField>
              <LabelField
                v-slot="{ invalid }"
                :form="$form"
                class="col-span-3 mt-6"
                name="expensesId"
                tag="div">
                <FinanceExpenseTypeSelection
                  v-model="form.expensesId"
                  :expense-category-id="form.categoryId"
                  :invalid="invalid"
                  name="expensesId" />
              </LabelField>
            </div>
            <LabelField
              v-slot="{ invalid }"
              :form="$form"
              label="หมวดหมู่ค่าใช้จ่าย"
              name="categoryId"
              tag="div"
              required>
              <FinanceExpenseCategorySelection
                v-model="form.categoryId"
                :invalid="invalid"
                name="categoryId"
                @update:model-value="onCategoryChange()" />
            </LabelField>
            <LabelField
              v-slot="{ invalid }"
              :form="$form"
              label="จำนวนเงิน (บาท)"
              name="amount"
              tag="div"
              required>
              <InputNumber
                v-model="form.amount"
                :invalid="invalid"
                :use-grouping="true"
                class="h-9! shadow-none!"
                placeholder="กรอกจำนวนเงิน"
                fluid />
            </LabelField>
            <LabelField
              v-slot="{ invalid }"
              :form="$form"
              label="วันที่จ่าย"
              name="payDate"
              tag="div"
              required>
              <DatePickerInput
                v-model="form.payDate"
                :invalid="invalid"
                name="payDate" />
            </LabelField>
            <LabelField
              label="ไฟล์"
              tag="div">
              <FileInput v-model="files" />
            </LabelField>
            <LabelField
              :form="$form"
              class="col-span-2 w-full"
              label="หมายเหตุ"
              name="note"
              tag="div">
              <div class="flex w-full">
                <Textarea
                  v-model="form.note"
                  class="resize-none"
                  cols="130"
                  rows="3" />
              </div>
            </LabelField>
          </div>
        </BaseContainer>
        <FormAction @cancel="onCancel()" />
      </Form>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IExpensesFile, IUpdateExpensesPayload } from '@/models/request/expenses/ExpensesReq.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import ExpensesProvider, { type IExpensesProvider } from '@/resources/provider/expenses/expenses.provider'
import type { IMedia } from '@/resources/provider/Upload.provider'
import UploadProvider, { type IUploadProvider } from '@/resources/provider/Upload.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import FileInput from '@/components/input/FileInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import FinanceExpenseCategorySelection from '@/components/selection/modules/api/finance-expense-category/FinanceExpenseCategorySelection.vue'
import FinanceExpenseTypeSelection from '@/components/selection/modules/api/finance-expense-type/FinanceExpenseTypeSelection.vue'
import ExpensesTypeSelection from '@/components/selection/modules/static/expense-type/ExpensesTypeSelection.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { type ExpensesFormValues, ExpensesSchema, useFormInitialValues } from '../../create/schema/expenses.schema'
import { useInitForm } from '../composables/useInitForm'

const route = useRoute()
const router = useRouter()

const expensesService: IExpensesProvider = new ExpensesProvider()
const uploadService: IUploadProvider = new UploadProvider()

const formKey = ref<number>(0)
const form = ref<ExpensesFormValues>(useFormInitialValues())
const files = ref<IMedia[]>([])
const resolver = zodResolver(ExpensesSchema)

const expensesId = computed((): TBaseParamsId => route?.params?.id as string ?? '')

function onCancel (): void {
  router.push({ name: 'ExpenseDetailPage', params: { id: expensesId.value } })
}

function onCategoryChange (): void {
  form.value.expensesId = undefined
}

async function useFetch (): Promise<void> {
  const { data } = await expensesService.getExpensesById(expensesId.value)
  useInitForm(form, data)
  files.value = data.files.map((f: IExpensesFile): IMedia => ({ name: f.name, url: f.url, path: f.path }))
  formKey.value++
}

async function uploadFiles (): Promise<IExpensesFile[]> {
  const uploaded: IExpensesFile[] = []
  for (const media of files.value) {
    if (media.isNew && media.file) {
      const { data } = await uploadService.uploadFile(media.file)
      uploaded.push({ name: data.originalName, url: data.fileUrl, path: data.filePath })
    } else {
      uploaded.push({ name: media.name, url: media.url, path: media.path })
    }
  }
  return uploaded
}

async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  await handleLoading(async (): Promise<void> => {
    const uploadedFiles = await uploadFiles()
    const categoryState = event.states?.categoryId?.value
    const expensesState = event.states?.expensesId?.value
    const payload: IUpdateExpensesPayload = {
      type: form.value.expensesType,
      expenseTypeId: expensesState?.id ? Number(expensesState.id) : Number(form.value.expensesId ?? 0),
      expenseCategoryId: categoryState?.id ? Number(categoryState.id) : Number(form.value.categoryId ?? 0),
      amount: form.value.amount,
      expenseDate: form.value.payDate,
      reason: form.value.note ?? '',
      files: uploadedFiles
    }
    await expensesService.updateExpenses(expensesId.value, payload)
    toast.success('ดำเนินการสำเร็จ')
    router.push({ name: 'ExpenseDetailPage', params: { id: expensesId.value } })
  })
}

onMounted((): void => {
  handleLoading(useFetch)
})
</script>
