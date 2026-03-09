<template>
  <BaseModal
    v-model="visible"
    :label="props.type==='CREATE' ? 'เพิ่มประเภทรายได้ใหม่' : 'แก้ไขประเภทรายได้'"
    class="md:w-200!"
    @open="clear()">
    <template
      v-if="props.type === 'CREATE'"
      #activator="{ open }">
      <CreateButton
        :disabled="props.disabled"
        icon="weui:add-outlined"
        rounded
        @click="open()" />
    </template>
    <template #default="{ close }">
      <Form
        v-slot="$form"
        :initial-values="form"
        :resolver="resolver"
        class="grid grid-cols-1 gap-4"
        @submit="onSubmit($event, close)">
        <LabelField
          v-model="form.name"
          :form="$form"
          label="ประเภทรายได้"
          name="name"
          required />
        <FormAction
          class="mt-6"
          @cancel="close()" />
      </Form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IActionFinanceIncomeTypePayload } from '@/models/request/finance-income-type/FinanceIncomeTypeReq.model'
import CreateButton from '@/components/button/CreateButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import LabelField from '@/components/input/LabelField.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { FinanceIncomeTypeSchema, useFormInitialValues } from '../../schema/finance-income-type.schema'

interface IProps {
  type?: 'CREATE' | 'EDIT'
  id?: number
  disabled?: boolean
}
interface IEmits {
  create: []
  edit: [id: number]
}

const props = withDefaults(defineProps<IProps>(), {
  type: 'CREATE',
  id: undefined,
  disabled: false
})
const emits = defineEmits<IEmits>()

const form = defineModel<IActionFinanceIncomeTypePayload>({ required: true })
const visible = defineModel<boolean>('visible', { default: false })
const resolver = zodResolver(FinanceIncomeTypeSchema)

async function onSubmit (event: FormSubmitEvent, close: () => void): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  if (props.type === 'CREATE') emits('create')
  else if (props.type === 'EDIT' && !!props.id) emits('edit', props.id)
  if (close) close()
}

function clear (): void {
  form.value = useFormInitialValues()
}
</script>

<style scoped>

</style>
