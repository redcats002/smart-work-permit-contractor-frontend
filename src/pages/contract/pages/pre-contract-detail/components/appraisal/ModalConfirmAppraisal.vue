<template>
  <BaseModal
    v-model="visible"
    class="md:w-200!"
    label="กรอกข้อมูลขอราคาประเมินหลักทรัพย์"
    @open="onClear(true)">
    <template
      #activator="{ open }">
      <ConfirmButton
        label="ยืนยันราคาประเมิน"
        @click="onActivatorClick(open)" />
    </template>
    <template #default="{ close }">
      <Form
        v-slot="$form"
        :initial-values="form"
        :resolver="resolver"
        class="grid grid-cols-1 gap-6"
        @submit="onSubmit($event, close)">
        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          label="ราคา"
          name="loanAmount"
          hide-error
          required>
          <InputNumber
            v-model="form.loanAmount"
            :invalid="invalid"
            class="h-9! shadow-none! w-full"
            name="loanAmount" />
        </LabelField>
        <FormAction
          class="mt-6"
          @cancel="close()" />
      </Form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { toast } from '@/plugins/toast'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IConfirmAppraisalPayload } from '@/models/request/pre-contract/PreContractReq.model'
import type { IEmployeeList } from '@/models/response/employee/EmployeeRes.model'
import { EmployeeRoleEnum } from '@/enums/modules/employee/EmployeeRole.enum'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import LabelField from '@/components/input/LabelField.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import { useAuthStore } from '@/stores/Auth'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { ConfirmAppraisalSchema, useFormInitialValues } from '../../schema/confirm-appraisal.schema'

interface IProps {
  sellMan?: IEmployeeList
}
interface IEmits {
  submit: []
}

const props = withDefaults(defineProps<IProps>(), {
  sellMan: undefined
})
const emits = defineEmits<IEmits>()

const form = defineModel<IConfirmAppraisalPayload>({ required: true })
const visible = defineModel<boolean>('visible', { default: false })
const resolver = zodResolver(ConfirmAppraisalSchema)
const authStore = useAuthStore()

const canConfirm = computed((): boolean => {
  return props.sellMan?.id === authStore.user.id
    || authStore.user.role === EmployeeRoleEnum.SUPER_ADMIN
    || authStore.user.role === EmployeeRoleEnum.ADMIN
})

function onActivatorClick (open: () => void): void {
  if (!canConfirm.value) {
    toast.warn('คุณไม่ใช่พนักงานประเมินของสัญญานี้ ไม่สามารถยืนยันราคาประเมินได้')
    return
  }
  open()
}

async function onSubmit (event: FormSubmitEvent, close: () => void): Promise<void> {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  emits('submit')
  if (close) close()
}

function onClear (suppress: boolean = false): void {
  form.value = useFormInitialValues()
  if (!suppress) toast.success('ล้างข้อมูลเรียบร้อย')
}
</script>

<style scoped>

</style>
