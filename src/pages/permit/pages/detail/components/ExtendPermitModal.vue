<template>
  <BaseModal
    v-model="visible"
    :label="t('permit.detail.extend.title')">
    <template #default>
      <p class="mb-4.5 text-[13px] text-text-secondary">
        {{ t('permit.detail.extend.subtitle') }}
      </p>

      <!--
        The server's verdict, localized off `errorCode` — never the backend's own `message`. The
        client does NOT pre-empt PERMIT_NOT_EXTENDABLE: the call is always attempted and this
        banner only ever renders what came back. A new-end-instant 400 carries no errorCode and
        falls back to the generic unknown-error string, same as RequestCloseModal.vue.
      -->
      <div
        v-if="blockMessage"
        class="mb-4 rounded-[10px] bg-primary px-4 py-3.5 text-white"
        data-test="extend-block">
        <p class="text-sm font-bold">
          ⛔ {{ blockMessage }}
        </p>
      </div>

      <Form
        ref="formRef"
        v-slot="$form"
        :initial-values="formData"
        :resolver="resolver"
        class="grid grid-cols-1 gap-4"
        @submit="onSubmit($event)">
        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          :label="t('permit.detail.extend.field.endDate')"
          name="endDate"
          tag="div"
          required>
          <DatePicker
            v-model="formData.endDate"
            :invalid="invalid"
            date-format="yy-mm-dd"
            name="endDate"
            fluid
            show-icon />
        </LabelField>

        <LabelField
          v-slot="{ invalid }"
          :form="$form"
          :label="t('permit.detail.extend.field.dailyEnd')"
          name="dailyEnd"
          tag="div"
          required>
          <DatePicker
            v-model="formData.dailyEnd"
            :invalid="invalid"
            hour-format="24"
            name="dailyEnd"
            fluid
            show-icon
            time-only />
        </LabelField>
      </Form>
    </template>

    <template #footer="{ close: closeModal }">
      <div class="flex flex-wrap gap-2.5">
        <button
          class="h-11.5 cursor-pointer rounded-[9px] border border-border-input bg-white px-4.5 text-sm font-semibold text-text-primary"
          type="button"
          @click="closeModal()">
          {{ t('permit.detail.extend.cancel') }}
        </button>
        <button
          :class="submitting
            ? 'bg-disabled text-white cursor-not-allowed'
            : 'bg-status-active-fg text-white cursor-pointer'"
          :disabled="submitting"
          class="h-11.5 flex-1 rounded-[9px] px-4.5 text-sm font-bold"
          data-test="extend-confirm"
          type="button"
          @click="submit()">
          {{ submitting ? t('permit.detail.extend.submitting') : t('permit.detail.extend.confirm') }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, useTemplateRef, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { dayjs } from '@/plugins/dayjs.plugin'
import BaseModal from '@/components/modal/BaseModal.vue'
import LabelField from '@/components/input/LabelField.vue'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import { handleLoading } from '@/utils/HandleLoading'
import { toast } from '@/plugins/toast'
import { useApiError } from '@/composables/useApiError'
import {
  combineEndInstant,
  createExtendPermitSchema,
  type IExtendPermitFormState,
  type TExtendPermitFormValues
} from '@/pages/permit/pages/detail/schema/ExtendPermit.schema'
import type { IExtendPermitPayload } from '@/models/request/permit/PermitReq.model'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import PermitProvider, { type IPermitProvider } from '@/resources/provider/permit/Permit.provider'

/**
 * The permit-timeout warning's "Extend" action — `POST /permits/:id/extend`. Offered from both
 * the warning banner (≤30 min left, still open) and the expired banner in `PermitUrgentSection.vue`.
 *
 * `endDate`/`dailyEnd` follow the exact same wire shapes and UTC-trap convention
 * `Step3WhereWhen.vue` uses for the create wizard (`endDate` a plain `YYYY-MM-DD`, `dailyEnd` a
 * full `1970-01-01`-anchored ISO datetime) — diverging here would shift the extended instant by
 * this deployment's UTC offset, silently, exactly the trap that convention exists to avoid.
 *
 * The server re-checks its own gate on submit (`PERMIT_NOT_EXTENDABLE`, and a plain 400 with no
 * errorCode when the new end is not after now or before the permit's own start) — this modal's
 * schema mirrors both for instant feedback but never gates beyond what the server itself decides.
 */
interface IProps {
  permit: IPermitDetail
}

interface IEmits {
  extended: [permit: IPermitDetail]
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>({ default: false })

const { t } = useI18n()
const { mapError } = useApiError()

const PermitService: IPermitProvider = new PermitProvider()

const formRef = useTemplateRef<any>('formRef')
const submitting: Ref<boolean> = ref(false)
const blockMessage: Ref<string> = ref('')

/** The permit's own start instant — same local-time splice as `combineEndInstant`. */
function permitStartAt (permit: IPermitDetail): number {
  return combineEndInstant(new Date(permit.startDate), new Date(permit.dailyStart))
}

const resolver = zodResolver(createExtendPermitSchema(permitStartAt(props.permit)))

const formData: Ref<IExtendPermitFormState> = ref({
  endDate: props.permit.endDate ? new Date(props.permit.endDate) : undefined,
  dailyEnd: props.permit.dailyEnd ? new Date(props.permit.dailyEnd) : undefined
})

/** Any fixed date works as the daily-end time carrier — matches Step3WhereWhen.vue's `1970-01-01`. */
const DAILY_TIME_CARRIER = new Date(1970, 0, 1)

function composeDailyEnd (time: Date): string {
  const combined = new Date(DAILY_TIME_CARRIER)
  combined.setHours(time.getHours(), time.getMinutes(), 0, 0)
  return combined.toISOString()
}

async function useExtend (values: TExtendPermitFormValues): Promise<void> {
  const payload: IExtendPermitPayload = {
    endDate: dayjs(values.endDate).format('YYYY-MM-DD'),
    dailyEnd: composeDailyEnd(values.dailyEnd)
  }
  const response = await PermitService.extend(props.permit.id, payload)
  emits('extended', response.data)
  visible.value = false
  toast.success(t('permit.toast.extended'))
}

function onSubmit (event: FormSubmitEvent): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  blockMessage.value = ''
  handleLoading(
    (): Promise<void> => useExtend(event.values as TExtendPermitFormValues), { loadingUnit: submitting }, (error: unknown): void => {
      // Never swallowed: whatever the server said is rendered here, in the user's language.
      blockMessage.value = mapError(error).message
    }
  )
}

function submit (): void {
  formRef.value?.submit()
}

function reset (): void {
  formData.value = {
    endDate: props.permit.endDate ? new Date(props.permit.endDate) : undefined,
    dailyEnd: props.permit.dailyEnd ? new Date(props.permit.dailyEnd) : undefined
  }
  blockMessage.value = ''
}

watch(visible, (value: boolean): void => {
  if (value) reset()
})
</script>

<style scoped>

</style>
