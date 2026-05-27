<template>
  <section id="expenses-edit-page">
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
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from '@/plugins/toast'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IExpensesFile } from '@/models/request/expenses/ExpensesReq.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import { isCapitalExpense, isPaymentExpense } from '@/enums/modules/finance/ExpenseType.enum'
import ExpensesProvider, { type IExpensesProvider } from '@/resources/provider/expenses/Expenses.provider'
import UploadProvider, {
  type IMedia,
  type IUploadProvider
} from '@/resources/provider/Upload.provider'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { type FormInstance } from '@primevue/forms/form'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import ExpensesCapitalForm from '../../create/components/ExpensesCapitalForm.vue'
import ExpensesPaymentForm from '../../create/components/ExpensesPaymentForm.vue'
import { type ExpensesFormValues, ExpensesSchema, useFormInitialValues } from '../../create/schema/expenses.schema'
import { useInitForm } from '../composables/useInitForm'
import { usePayload } from '../composables/usePayload.ts'

const route = useRoute()
const router = useRouter()

const ExpensesService: IExpensesProvider = new ExpensesProvider()
const UploadService: IUploadProvider = new UploadProvider()

const formKey = ref<number>(0)
const formRef = ref<FormInstance | null>(null)
const form = ref<ExpensesFormValues>(useFormInitialValues())
const resolver = zodResolver(ExpensesSchema)

const expensesId = computed((): TBaseParamsId => route?.params?.id as string ?? '')

function onCancel (): void {
  router.push({ name: 'ExpenseDetailPage', params: { id: expensesId.value } })
}

function onCategoryChange (): void {
  form.value.expenseTypeId = undefined
  formRef.value?.setFieldValue('expenseTypeId', undefined)
}

function mount (): void {
  formKey.value++
}

async function useFetch (): Promise<void> {
  const { data } = await ExpensesService.getExpensesById(expensesId.value)
  useInitForm(form, data)
  form.value.files = data.files.map((f: IExpensesFile): IMedia => ({ name: f.name, url: f.url, path: f.path }))
  mount()
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

async function useUpdate (event: FormSubmitEvent): Promise<void> {
  await handleLoading(async (): Promise<void> => {
    const uploadedFiles = await uploadFiles()
    const categoryState = event.states?.expenseCategoryId?.value
    const expensesState = event.states?.expenseTypeId?.value
    const payload = usePayload({
      ...form.value,
      expenseTypeId: expensesState?.id ? Number(expensesState.id) : Number(form.value.expenseTypeId ?? 0),
      expenseCategoryId: categoryState?.id ? Number(categoryState.id) : Number(form.value.expenseCategoryId ?? 0),
      files: uploadedFiles
    })
    await ExpensesService.updateExpenses(expensesId.value, payload)
    toast.success('ดำเนินการสำเร็จ')
    router.push({ name: 'ExpenseDetailPage', params: { id: expensesId.value } })
  })
}

async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  await useUpdate(event)
}

onMounted((): void => {
  handleLoading(useFetch)
})
</script>
