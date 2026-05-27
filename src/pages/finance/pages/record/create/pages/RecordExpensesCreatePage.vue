<template>
  <section id="expenses-create-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <BasePage>
      <Form
        :key="formKey"
        ref="formRef"
        v-slot="$form"
        :initial-values="form"
        :resolver="resolver"
        class="flex flex-col gap-5 pb-10"
        @submit="onSubmit($event)">
        <BaseContainer>
          <div
            v-if="!form.type"
            class="grid grid-cols-2">
            <LabelField
              v-slot="{ invalid }"
              :form="$form"
              label="รับ/จ่าย"
              name="type"
              tag="div"
              required>
              <ExpensesTypeSelection
                v-model="form.type"
                :invalid="invalid"
                name="type"
                placeholder="เลือกประเภทรับ/จ่าย"
                dropdown
                show-clear
                @update:model-value="mount()" />
            </LabelField>
          </div>
          <Transition
            mode="out-in"
            name="fade">
            <ExpensesPaymentForm
              v-if="isPaymentExpense(form.type)"
              v-model="form"
              :form="$form"
              @mount="mount()"
              @update-category="onCategoryChange()" />
          </Transition>
          <Transition
            mode="out-in"
            name="fade">
            <ExpensesCapitalForm
              v-if="isCapitalExpense(form.type)"
              v-model="form"
              :form="$form"
              @mount="mount()" />
          </Transition>
        </BaseContainer>
        <FormAction @cancel="onCancel()" />
      </Form>
    </BasePage>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IExpensesFile } from '@/models/request/expenses/ExpensesReq.model'
import { isCapitalExpense, isPaymentExpense } from '@/enums/modules/finance/ExpenseType.enum'
import ExpensesProvider, { type IExpensesProvider } from '@/resources/provider/expenses/Expenses.provider'
import UploadProvider, { type IUploadProvider } from '@/resources/provider/Upload.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import LabelField from '@/components/input/LabelField.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import ExpensesTypeSelection from '@/components/selection/modules/static/expense-type/ExpensesTypeSelection.vue'
import ExpensesCapitalForm from '../components/ExpensesCapitalForm.vue'
import ExpensesPaymentForm from '../components/ExpensesPaymentForm.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { type FormInstance } from '@primevue/forms/form'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { usePayload } from '../composables/usePayload.ts'
import { type ExpensesFormValues, ExpensesSchema, useFormInitialValues } from '../schema/expenses.schema'

const router = useRouter()
const formRef = ref<FormInstance | null>(null)
const form = ref<ExpensesFormValues>(useFormInitialValues())
const formKey = ref<number>(0)
const resolver = zodResolver(ExpensesSchema)

const ExpensesService: IExpensesProvider = new ExpensesProvider()
const UploadService: IUploadProvider = new UploadProvider()

function onCancel (): void {
  router.push({ name: 'ExpenseListPage' })
}

function onCategoryChange (): void {
  form.value.expenseTypeId = undefined
  formRef.value?.setFieldValue('expenseTypeId', undefined)
}

function mount (): void {
  formKey.value++
}

async function uploadFiles (): Promise<IExpensesFile[]> {
  const uploaded: IExpensesFile[] = []
  for (const media of form.value.files) {
    if (media.isNew && media.file) {
      const { data } = await UploadService.uploadFile(media.file)
      uploaded.push({ name: data.originalName, url: data.fileUrl, path: data.filePath })
    } else {
      uploaded.push({ name: media.name, url: media.url, path: media.path })
    }
  }
  return uploaded
}

async function useCreate (event: FormSubmitEvent): Promise<void> {
  await handleLoading(async (): Promise<void> => {
    const uploadedFiles = await uploadFiles()
    const categoryState = event.states?.expenseCategoryId?.value
    const expensesState = event.states?.expenseTypeId?.value
    const payload = usePayload({
      type: form.value.type,
      expenseTypeId: expensesState?.id ? Number(expensesState.id) : Number(form.value.expenseTypeId ?? 0),
      expenseCategoryId: categoryState?.id ? Number(categoryState.id) : Number(form.value.expenseCategoryId ?? 0),
      amount: form.value.amount,
      branchId: form.value.branchId,
      expenseDate: form.value.expenseDate,
      reason: form.value.reason ?? '',
      files: uploadedFiles
    })
    const response = await ExpensesService.createExpenses(payload)
    toast.success('บันทึกข้อมูลสำเร็จ')
    router.push({ name: 'ExpenseDetailPage', params: { id: response.data.id } })
  })
}

async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  await useCreate(event)
}
</script>
