<template>
  <BaseModal
    v-model="visible"
    :label="type==='CREATE' ? 'เพิ่มผู้จัดการเขตใหม่' : 'แก้ไขผู้จัดการเขต'"
    class="md:w-200!"
    @open="clear()">
    <template
      v-if="type === 'CREATE'"
      #activator="{ open }">
      <CreateButton
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
          label="ผู้จัดการเขต"
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
import type { IActionManagementStructureZoneManagerPayload } from '@/models/request/management-structure-zone-manager/ManagementStructureZoneManagerReq.model'
import type { TBaseParamsId } from '@/models/response/Response.model'
import CreateButton from '@/components/button/CreateButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import LabelField from '@/components/input/LabelField.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { ManagementStructureZoneManagerSchema, useFormInitialValues } from '../../schema/management-structure-zone-manager.schema'

interface IProps {
  type?: 'CREATE' | 'EDIT'
  id?: TBaseParamsId
}
interface IEmits {
  create: []
  edit: [id: TBaseParamsId]
}

const props = withDefaults(defineProps<IProps>(), {
  type: 'CREATE',
  id: undefined
})
const emits = defineEmits<IEmits>()

const form = defineModel<IActionManagementStructureZoneManagerPayload>({ required: true })
const visible = defineModel<boolean>('visible', { default: false })
const resolver = zodResolver(ManagementStructureZoneManagerSchema)

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
  if (props.type === 'CREATE') form.value = useFormInitialValues()
}
</script>

<style scoped>

</style>
