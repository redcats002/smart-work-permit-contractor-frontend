<template>
  <BaseModal
    v-model="visible"
    class="md:w-200!"
    label="กรอกข้อมูลขอราคาประเมินหลักทรัพย์"
    @open="onClear(true)">
    <template
      #activator="{ open }">
      <ConfirmButton
        :label="requestNew ? 'ขอราคาประเมินใหม่' : 'ขอราคาประเมิน'"
        :outlined="requestNew"
        @click="open()" />
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
          label="กลุ่มผู้ตีราคา"
          name="evaluatorLevel"
          hide-error
          required>
          <EvaluatorLevelSelection
            v-model="form.evaluatorLevel"
            :existed-group="existedGroup"
            :invalid="invalid"
            name="evaluatorLevel" />
        </LabelField>
        <LabelField
          v-model="form.detail"
          :form="$form"
          label="รายละเอียดเพิ่มเติม"
          name="detail"
          hide-error
          required />
        <FormAction
          class="mt-6"
          confirm-label="ยืนยันขอราคา"
          @cancel="close()">
          <Button
            class="text-sm text-red-500 hover:text-red-700 transition-colors"
            type="button"
            text
            @click="onClear()">
            ล้างข้อมูล
          </Button>
        </FormAction>
      </Form>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { toast } from '@/plugins/toast'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import type { IRequestReappraisalPayload } from '@/models/request/pre-contract/PreContractReq.model'
import type { TEvaluatorLevel } from '@/enums/modules/contract/EvaluatorLevel.enum'
import ConfirmButton from '@/components/button/ConfirmButton.vue'
import FormAction from '@/components/button/FormAction.vue'
import LabelField from '@/components/input/LabelField.vue'
import BaseModal from '@/components/modal/BaseModal.vue'
import EvaluatorLevelSelection from '@/components/selection/modules/evaluator-level/EvaluatorLevelSelection.vue'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { AssetValuationSchema, useFormInitialValues } from '../schema/asset-valuation.schema'

interface IProps {
  requestNew?: boolean
  existedGroup?: TEvaluatorLevel[]
}
interface IEmits {
  submit: []
}

withDefaults(defineProps<IProps>(), {
  requestNew: false,
  existedGroup: (): TEvaluatorLevel[] => []
})
const emits = defineEmits<IEmits>()

const form = defineModel<IRequestReappraisalPayload>({ required: true })
const visible = defineModel<boolean>('visible', { default: false })
const resolver = zodResolver(AssetValuationSchema)

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
