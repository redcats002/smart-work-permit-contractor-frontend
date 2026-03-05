<template>
  <Form
    v-slot="$form"
    :initial-values="form"
    :resolver="resolver"
    class="grid grid-cols-1 gap-4"
    @submit="onSubmit($event)">
    <LabelField
      v-model="form.email"
      :form="$form"
      label="อีเมล"
      name="email"
      required />
    <ConfirmButton
      class="w-full mt-4"
      label="ถัดไป" />
  </Form>
</template>

<script setup lang="ts">
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IActionLoginPayload } from '@/models/request/auth/public/AuthReq.public.model'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import LabelField from '@/components/input/LabelField.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { PreLoginSchema } from '../../../schema/pre-login.schema'

interface IEmits {
  submit: []
}

const form = defineModel<IActionLoginPayload>({ required: true })
const resolver = zodResolver(PreLoginSchema)

const emits = defineEmits<IEmits>()

async function onSubmit (event: FormSubmitEvent): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  emits('submit')
}
</script>

<style scoped>

</style>
