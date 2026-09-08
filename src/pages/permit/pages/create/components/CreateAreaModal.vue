<template>
  <BaseModal
    v-model="visible"
    :label="t('permit.create.steps.position.area.proposeModal.title')">
    <template #default="{ close }">
      <Form
        v-slot="$form"
        :initial-values="formData"
        :resolver="resolver"
        class="grid grid-cols-1 gap-4"
        @submit="onSubmit($event, close)">
        <LabelField
          v-model="formData.name"
          :form="$form"
          :label="t('permit.create.steps.position.area.proposeModal.field.name')"
          name="name"
          required />

        <!-- wayfinder ticket 037, same rule as CreateCertificateModal: failures render inline, never a toast. -->
        <p
          v-if="submitErrorMessage"
          class="rounded-lg border border-status-rejected-border bg-status-rejected-bg px-3.5 py-2.5
            text-[12.5px] font-semibold text-status-rejected-fg-emphasis"
          role="alert">
          <span aria-hidden="true">⛔</span> {{ submitErrorMessage }}
        </p>

        <ConfirmButton
          :label="t('permit.create.steps.position.area.proposeModal.submit')"
          class="w-full!"
          type="submit" />
      </Form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import { handleLoading } from '@/utils/HandleLoading'
import { useApiError } from '@/composables/useApiError'
import BaseModal from '@/components/modal/BaseModal.vue'
import LabelField from '@/components/input/LabelField.vue'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import type { IArea } from '@/models/modules/area/Area.model'
import AreaProvider, { type IAreaProvider } from '@/resources/provider/area/Area.provider'
import {
  CreateAreaSchema, useCreateAreaInitialValues, type ICreateAreaFormState, type TCreateAreaFormValues
} from '@/pages/permit/pages/create/schema/CreateArea.schema'

/**
 * wayfinder ticket 037 — "propose a new area without leaving the wizard", same shape ticket 004
 * used for `CreateCertificateModal.vue` and for the same reason (leaving the wizard to create
 * master data is how a form gets abandoned).
 *
 * Name only — deliberately NOT collecting a default `position` here even though
 * `POST /v1/areas` accepts one: this modal has no plan image to click on, and a mis-placed
 * default pin on a brand-new area is a worse outcome than no default at all. A safety officer
 * (or a later revision) can still set one; this modal never claims to.
 *
 * The created area is `PENDING` — unusable by any permit until approved — so, unlike
 * `CreateCertificateModal`, the caller must NOT select it. `AreaPicker.vue` instead adds it to a
 * visible "awaiting approval" list so proposing one is never silently invisible.
 */
interface IEmits {
  created: [area: IArea]
}

const emits = defineEmits<IEmits>()

const { t } = useI18n()
const { mapError } = useApiError()

const AreaService: IAreaProvider = new AreaProvider()

const visible = defineModel<boolean>({ default: false })
const resolver = zodResolver(CreateAreaSchema)
const formData: Ref<ICreateAreaFormState> = ref(useCreateAreaInitialValues())
const submitErrorMessage: Ref<string | undefined> = ref(undefined)

function resetForm (): void {
  formData.value = useCreateAreaInitialValues()
  submitErrorMessage.value = undefined
}

function onSubmit (event: FormSubmitEvent, close: () => void): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  submitErrorMessage.value = undefined
  handleLoading(async (): Promise<void> => {
    const values = event.values as TCreateAreaFormValues
    const response = await AreaService.create({ name: values.name })
    emits('created', response.data)
    resetForm()
    close()
  }, {}, (error: unknown): void => {
    submitErrorMessage.value = mapError(error).message
  })
}
</script>

<style scoped>
</style>
