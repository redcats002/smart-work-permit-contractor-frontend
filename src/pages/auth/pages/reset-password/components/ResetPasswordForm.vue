<template>
  <Form
    v-slot="$form"
    :initial-values="form"
    :resolver="resolver"
    class="grid grid-cols-1 gap-4"
    @submit="onSubmit($event)">
    <LabelField
      v-slot="{ invalid }"
      :form="$form"
      label="รหัสผ่านใหม่"
      name="newPassword"
      required>
      <PasswordInput
        v-model="form.newPassword"
        :invalid="invalid"
        name="newPassword" />
    </LabelField>
    <Progress
      :items="progressItems"
      class="mb-4 mt-2"
      dense />
    <LabelField
      v-slot="{ invalid }"
      :form="$form"
      label="ยืนยันรหัสผ่านใหม่"
      name="confirmNewPassword"
      required>
      <PasswordInput
        v-model="form.confirmNewPassword"
        :invalid="invalid"
        name="confirmNewPassword" />
    </LabelField>
    <ConfirmButton
      class="w-full mt-4"
      label="ยืนยัน"
      fluid />
  </Form>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import { regex } from '@/utils/Regex'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import LabelField from '@/components/input/LabelField.vue'
import PasswordInput from '@/components/input/PasswordInput.vue'
import Progress, { type IProgress } from '@/components/progress/Progress.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import type { ResetPasswordFormValues } from '../schema/reset-password.schema'
import { useResetPasswordResolver } from '../schema/reset-password.schema'

interface IEmits {
  submit: []
}

const form = defineModel<ResetPasswordFormValues>({ required: true })
const resolver = useResetPasswordResolver()
const emits = defineEmits<IEmits>()

const progressItems = computed((): IProgress[] => {
  const isContainEng = regex.upperCaseOneCharRegex.test(form.value.newPassword)
  const isFullPassword = regex.fullPassword.test(form.value.newPassword)
  const isContainNumber = regex.atLeastOneNumber.test(form.value.newPassword)

  return [
    { label: 'ต้องมีตัวอักษรภาษาอังกฤษ และตัวเลข รวมกันอย่างน้อย 8 ถึง 16 ตัว', valid: isFullPassword },
    { label: 'ต้องมีอักษรภาษาอังกฤษพิมพ์ใหญ่อย่างน้อย 1 ตัว', valid: isContainEng },
    { label: 'ต้องมี 0-9 อย่างน้อย 1 ตัว', valid: isContainNumber }
  ]
})

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
