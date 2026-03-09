<template>
  <BaseModal
    v-model="visible"
    :label="type==='CREATE' ? 'เพิ่มหมวดหมู่รายได้ใหม่' : 'แก้ไขหมวดหมู่รายได้'"
    class="md:w-200!"
    @open="clear()">
    <template
      v-if="type === 'CREATE'"
      #activator="{ open }">
      <CreateButton
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
          label="หมวดหมู่รายได้"
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
import type { IActionFinanceIncomeCategoryPayload } from '@/models/request/finance-income-category/FinanceIncomeCategoryReq.model'
import CreateButton from '@/components/button/CreateButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import LabelField from '@/components/input/LabelField.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { FinanceIncomeCategorySchema, useFormInitialValues } from '../../schema/finance-income-category.schema'

interface IProps {
  type?: 'CREATE' | 'EDIT'
  id?: number
}
interface IEmits {
  create: []
  edit: [id: number]
}

const props = withDefaults(defineProps<IProps>(), {
  type: 'CREATE',
  id: undefined
})
const emits = defineEmits<IEmits>()

const form = defineModel<IActionFinanceIncomeCategoryPayload>({ required: true })
const visible = defineModel<boolean>('visible', { default: false })
const resolver = zodResolver(FinanceIncomeCategorySchema)

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
