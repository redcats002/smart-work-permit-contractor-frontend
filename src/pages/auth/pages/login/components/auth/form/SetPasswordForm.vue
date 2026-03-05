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
    <Progress
      :items="progressItems"
      class="mb-4 mt-2"
      dense />
    <LabelField
      v-slot="{ invalid }"
      :form="$form"
      label="ยืนยันรหัสผ่าน"
      name="confirmPassword"
      required>
      <PasswordInput
        v-model="form.confirmPassword"
        :invalid="invalid"
        name="confirmPassword" />
    </LabelField>
    <ConfirmButton
      class="w-full mt-4"
      label="ถัดไป" />
  </Form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import { regex } from '@/utils/Regex'
import type { IActionLoginPayload } from '@/models/request/auth/public/AuthReq.public.model'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import LabelField from '@/components/input/LabelField.vue'
import PasswordInput from '@/components/input/PasswordInput.vue'
import Progress, { type IProgress } from '@/components/progress/Progress.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { useRegisterResolver } from '../../../schema/register.schema'

interface IEmits {
  submit: []
}

const form = defineModel<IActionLoginPayload>({ required: true })
const resolver = useRegisterResolver()

const emits = defineEmits<IEmits>()

const progressItems = computed((): IProgress[] => {
  const isContainEng = regex.upperCaseOneCharRegex.test(form.value.password)
  const isFullPassword = regex.fullPassword.test(form.value.password)
  const isContainNumber = regex.atLeastOneNumber.test(form.value.password)

  return [
    { label: 'ต้องมีตัวอักษรภาษาอังกฤษ และตัวเลข รวมกันอย่างน้อย 8 ถึง 16 ตัว', valid: isFullPassword },
    { label: 'ต้องมีอักษรภาษาอังกฤษพิมพ์ใหญ่อย่างน้อย 1 ตัว', valid: isContainEng },
    { label: 'ต้องมี 0-9 อย่างน้อย 1 ตัว', valid: isContainNumber }
  ]
})

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
