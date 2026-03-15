<template>
  <BaseModal
    v-model="visible"
    class="md:w-150!"
    label="บันทึกการติดต่อ"
    @open="onOpen()">
    <template #activator="{ open }">
      <CreateButton
        label="บันทึกการติดต่อ"
        @click="open()" />
    </template>
    <template #default="{ close }">
      <Form
        v-slot="$form"
        :initial-values="formData"
        :resolver="resolver"
        class="grid grid-cols-1 gap-4"
        @submit="onSubmit($event, close)">
        <LabelField
          v-slot="{invalid}"
          :form="$form"
          label="วันที่ติดต่อ"
          name="date"
          tag="div"
          hide-error
          required>
          <DatePickerInput
            v-model="(formData.date as unknown as Date)"
            :invalid="invalid"
            name="date" />
        </LabelField>
        <LabelField
          v-slot="{invalid}"
          :form="$form"
          label="เรื่อง"
          name="subjectId"
          tag="div"
          hide-error
          required>
          <ContractLoanPurposeSelection
            v-model="formData.subjectId"
            :invalid="invalid"
            name="subjectId" />
        </LabelField>
        <LabelField
          v-slot="{invalid}"
          :form="$form"
          label="รายละเอียด"
          name="detail"
          tag="div"
          hide-error
          required>
          <Textarea
            v-model="formData.detail"
            :invalid="invalid"
            class="w-full"
            name="detail"
            rows="4"
            fluid />
        </LabelField>
        <FormAction
          class="mt-2"
          @cancel="close()" />
      </Form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { ICreateContractHistory } from '@/models/request/contract/ContractReq.model'
import CreateButton from '@/components/button/CreateButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import ContractLoanPurposeSelection from '@/components/selection/modules/contract-loan-purpose/ContractLoanPurposeSelection.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { ContractHistorySchema, useFormInitialValues } from './schema/contract-history.schema'

interface IEmits {
  submit: [payload: ICreateContractHistory]
}

const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>('visible', { default: false })

const resolver = zodResolver(ContractHistorySchema)
const formData = ref<ICreateContractHistory>(useFormInitialValues())

function onOpen (): void {
  formData.value = useFormInitialValues()
}

function onSubmit (event: FormSubmitEvent, close: () => void): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  emits('submit', event.values as ICreateContractHistory)
  close()
}
</script>
