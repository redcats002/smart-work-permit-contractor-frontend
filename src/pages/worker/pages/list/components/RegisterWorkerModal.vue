<template>
  <BaseModal
    v-model="visible"
    :label="t('worker.form.createTitle')">
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
          :label="t('worker.form.fieldName')"
          name="name"
          required />
        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          :label="t('worker.form.fieldRole')"
          name="role"
          tag="div"
          required>
          <Select
            v-model="formData.role"
            :invalid="invalid"
            :option-label="'label'"
            :option-value="'value'"
            :options="roleOptions"
            :placeholder="t('worker.form.fieldRole')"
            class="h-10.5 w-full"
            name="role" />
        </LabelField>
        <LabelField
          v-model="formData.idCardNo"
          :form="$form"
          :label="t('worker.form.fieldIdCardNo')"
          name="idCardNo" />
        <LabelField
          v-model="formData.phone"
          :form="$form"
          :label="t('worker.form.fieldPhone')"
          name="phone" />

        <p
          v-if="submitErrorMessage"
          class="rounded-lg border border-status-rejected-border bg-status-rejected-bg px-3.5 py-2.5
            text-[12.5px] font-semibold text-status-rejected-fg-emphasis"
          role="alert">
          <span aria-hidden="true">⛔</span> {{ submitErrorMessage }}
        </p>

        <ConfirmButton
          :label="t('worker.form.submit')"
          class="w-full!"
          type="submit" />
      </Form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import { handleLoading } from '@/utils/HandleLoading'
import { toast } from '@/plugins/toast'
import { useApiError } from '@/composables/useApiError'
import { EWorkerRole } from '@/enums/modules/permit/WorkerRole.enum'
import BaseModal from '@/components/modal/BaseModal.vue'
import LabelField from '@/components/input/LabelField.vue'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import type { IWorker } from '@/models/modules/worker/Worker.model'
import WorkerProvider, { type IWorkerProvider } from '@/resources/provider/worker/Worker.provider'
import {
  RegisterWorkerSchema, useRegisterWorkerInitialValues, type TRegisterWorkerFormValues
} from '../../../schema/RegisterWorker.schema'

/**
 * wayfinder 062 — "registering a new worker starts here" (the `/workers` list page). A worker's
 * own `role` offers the full `EWorkerRole` set (059 ruling 6), unlike `roleOnPermit`, which is
 * filtered per permit type.
 */
interface IEmits {
  created: [worker: IWorker]
}

const emits = defineEmits<IEmits>()

const { t } = useI18n()
const { mapError } = useApiError()

const WorkerService: IWorkerProvider = new WorkerProvider()

const visible = defineModel<boolean>({ default: false })
const resolver = zodResolver(RegisterWorkerSchema)
const formData: Ref<TRegisterWorkerFormValues> = ref(useRegisterWorkerInitialValues())
const submitErrorMessage: Ref<string | undefined> = ref(undefined)

const roleOptions: ComputedRef<{ label: string, value: string }[]> = computed(
  (): { label: string, value: string }[] => Object.values(EWorkerRole).map(
    (role: EWorkerRole): { label: string, value: string } => ({ label: role, value: role })
  )
)

function resetForm (): void {
  formData.value = useRegisterWorkerInitialValues()
  submitErrorMessage.value = undefined
}

async function useCreate (values: TRegisterWorkerFormValues): Promise<IWorker> {
  const response = await WorkerService.create({
    name: values.name,
    role: values.role,
    idCardNo: values.idCardNo || undefined,
    phone: values.phone || undefined
  })
  return response.data
}

function onSubmit (event: FormSubmitEvent, close: () => void): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  submitErrorMessage.value = undefined
  handleLoading(async (): Promise<void> => {
    const worker = await useCreate(event.values as TRegisterWorkerFormValues)
    emits('created', worker)
    resetForm()
    close()
    toast.success(t('worker.form.submit'))
  }, {}, (error: unknown): void => {
    // A duplicate name lands here too (`WORKER_ALREADY_EXISTS`) — this modal has no "adopt the
    // existing one" affordance the way `WorkerPicker` does, so it surfaces inline instead.
    submitErrorMessage.value = mapError(error).message
  })
}
</script>

<style scoped></style>
