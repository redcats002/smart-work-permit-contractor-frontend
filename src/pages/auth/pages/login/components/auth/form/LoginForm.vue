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
      :label="t('platform.auth.email')"
      name="email"
      required />
    <LabelField
      v-slot="{ invalid }"
      :form="$form"
      :label="t('platform.auth.password')"
      name="password"
      required>
      <PasswordInput
        v-model="form.password"
        :invalid="invalid"
        name="password" />
    </LabelField>
    <ConfirmButton
      id="login-button"
      :label="t('platform.auth.submit')"
      class="w-full! mt-4" />
  </Form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { ILoginPayload } from '@/models/request/auth/public/AuthReq.public.model'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import LabelField from '@/components/input/LabelField.vue'
import PasswordInput from '@/components/input/PasswordInput.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { LoginSchema } from '../../../schema/login.schema'

interface IEmits {
  submit: []
}

const form = defineModel<ILoginPayload>({ required: true })
const resolver = zodResolver(LoginSchema)

const emits = defineEmits<IEmits>()
const { t } = useI18n()

async function onSubmit (event: FormSubmitEvent): Promise<void> {
  event.originalEvent.preventDefault()
  event.originalEvent.stopPropagation()
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  emits('submit')
}
</script>

<style scoped>

</style>
