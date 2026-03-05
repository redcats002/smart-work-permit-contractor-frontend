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
    <LabelField
      v-slot="{ invalid }"
      :form="$form"
      label="รหัสผ่าน"
      name="password"
      required>
      <PasswordInput
        v-model="form.password"
        :invalid="invalid"
        name="password" />
    </LabelField>
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
import PasswordInput from '@/components/input/PasswordInput.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { LoginSchema } from '../../../schema/login.schema'

interface IEmits {
  submit: []
}

const form = defineModel<IActionLoginPayload>({ required: true })
const resolver = zodResolver(LoginSchema)

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
