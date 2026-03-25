<template>
  <section id="expenses-create-page">
    <PageTitle />
    <BaseTop>
      <BackButton />
    </BaseTop>
    <BasePage>
      <Form
        :initial-values="form"
        :resolver="resolver"
        class="flex flex-col gap-5 pb-10"
        @submit="onSubmit($event)">
        <BaseContainer class="h-dvh">
          <div class="grid grid-cols-2 gap-2">
            <LabelField
              v-slot="{ invalid }"
              label="ประเภทค่าใช้จ่าย"
              name="expensesType"
              hide-error
              required>
              <div
                class="grid grid-cols-4 gap-2">
                <ExpensesTypeSelection
                  v-model="form.expensesType"
                  :invalid="invalid"
                  dropdown />
                <ExpensesTypeSelection
                  v-model="form.expensesType"
                  :invalid="invalid"
                  class="col-span-3"
                  dropdown />
              </div>
            </LabelField>
            <LabelField
              v-slot="{ invalid }"
              label="หมวดหมู่ค่าใช้จ่าย"
              tag="div"
              required>
              <ExpensesTypeSelection
                v-model="form.expensesType"
                :invalid="invalid"
                dropdown />
            </LabelField>
            <LabelField
              label="จำนวนเงิน (บาท)"
              tag="div"
              required>
              <InputNumber
                v-model="form.amount"
                :use-grouping="true"
                class="h-9! shadow-none!"
                placeholder="กรอกจำนวนเงิน"
                fluid />
            </LabelField>
            <LabelField
              label="ไฟล์"
              tag="div"
              required>
              <!-- TODO -->
              <FileInput />
            </LabelField>
            <LabelField
              label="วันที่จ่าย"
              tag="div"
              required>
              <DatePickerInput v-model="form.payDate" />
            </LabelField>
            <LabelField
              class="col-span-2 w-full"
              label="หมายเหตุ"
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
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import BaseContainer from '@/components/base/BaseContainer.vue'
import BasePage from '@/components/base/BasePage.vue'
import BaseTop from '@/components/base/BaseTop.vue'
import BackButton from '@/components/button/BackButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import FileInput from '@/components/input/FileInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import PageTitle from '@/components/nav/PageTitle.vue'
import ExpensesTypeSelection from '@/components/selection/expense-type/ExpensesTypeSelection.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { type ExpensesFormValues, ExpensesSchema, useFormInitialValues } from '../schema/expenses.schema'

const router = useRouter()
const form = ref<ExpensesFormValues>(useFormInitialValues())
const resolver = zodResolver(ExpensesSchema)

function onCancel (): void {
  router.push({ name: 'ExpenseListPage' })
}

async function useSubmit (): Promise<void> {
  // await EmployeeService.createEmployee(usePayload(form.value))
  // toast.success('ดำเนินการสำเร็จ')
  // router.push({ name: 'EmployeeListPage' })
}

async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  await handleLoading(useSubmit)
}

onMounted((): void => {
  // fetch()
})
</script>
