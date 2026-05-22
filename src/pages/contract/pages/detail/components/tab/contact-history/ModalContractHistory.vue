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
          name="topic"
          tag="div"
          hide-error
          required>
          {{ formData.topic }}
          <ContractLoanPurposeSelection
            v-model:selected-name="formData.topic"
            :invalid="invalid"
            name="topic" />
        </LabelField>
        <LabelField
          v-slot="{invalid}"
          :form="$form"
          label="รายละเอียด"
          name="note"
          tag="div"
          hide-error
          required>
          <Textarea
            v-model="formData.note"
            :invalid="invalid"
            class="w-full"
            name="note"
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
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { handleLoading } from '@/utils/HandleLoading'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { ICreateContractHistory } from '@/models/request/contract-history/ContractHistoryReq.model'
import ContractHistoryProvider, { type IContractHistoryProvider } from '@/resources/provider/contract-history/ContractHistory.provider'
import CreateButton from '@/components/button/CreateButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import DatePickerInput from '@/components/input/DatePickerInput.vue'
import LabelField from '@/components/input/LabelField.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import ContractLoanPurposeSelection from '@/components/selection/modules/api/contract-loan-purpose/ContractLoanPurposeSelection.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { ContractHistorySchema, useFormInitialValues } from './schema/contract-history.schema'

interface IEmits {
  submit: []
}

const ContractHistoryService: IContractHistoryProvider = new ContractHistoryProvider()
const route = useRoute()
const contractId = computed((): number => route?.params?.id ? Number(route.params.id) : 0)

const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>('visible', { default: false })

const resolver = zodResolver(ContractHistorySchema)
const formData = ref<ICreateContractHistory>(useFormInitialValues())

function onOpen (): void {
  formData.value = useFormInitialValues()
}

async function useCreate (): Promise<void> {
  const payload = {
    date: formData.value.date,
    topic: formData.value.topic,
    note: formData.value.note
  }
  await ContractHistoryService.createContractHistory(contractId.value, payload)
  emits('submit')
}

function onSubmit (event: FormSubmitEvent, close: () => void): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  handleLoading(useCreate)
  close()
}
</script>
