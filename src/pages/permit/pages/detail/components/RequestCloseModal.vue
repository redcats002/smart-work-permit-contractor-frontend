<template>
  <BaseModal
    v-model="visible"
    :label="t('permit.detail.requestClose.title')">
    <template #default>
      <p class="mb-4.5 text-[13px] text-text-secondary">
        {{ t('permit.detail.requestClose.subtitle') }}
      </p>

      <p
        v-if="isAlreadyRequested"
        class="mb-4 rounded-[10px] border border-status-pending-border bg-status-pending-bg px-4 py-3 text-[12.5px] text-status-pending-fg"
        data-test="request-close-already">
        {{ t('permit.detail.requestClose.alreadyRequested') }}
      </p>

      <!--
        The server's verdict, localized off `errorCode` — never the backend's own `message`. The
        client does NOT pre-empt this: the call is always attempted and this banner only ever
        renders what came back. In practice the only errorCode this route can answer is the
        already-declared PERMIT_NOT_ACTIVE (a permit that is no longer ACTIVE/FIRE_MONITOR); an
        ownership 403 carries none and falls back to the generic unknown-error string.
      -->
      <div
        v-if="blockMessage"
        class="mb-4 rounded-[10px] bg-primary px-4 py-3.5 text-white"
        data-test="request-close-block">
        <p class="text-sm font-bold">
          ⛔ {{ blockMessage }}
        </p>
      </div>

      <Form
        ref="formRef"
        v-slot="$form"
        :initial-values="formData"
        :resolver="resolver"
        @submit="onSubmit($event)">
        <LabelField
          :form="$form"
          :label="t('permit.detail.requestClose.field.reason')"
          name="reason"
          tag="div">
          <Textarea
            v-model="formData.reason"
            :placeholder="t('permit.detail.requestClose.field.reasonPlaceholder')"
            name="reason"
            rows="3"
            fluid />
        </LabelField>
      </Form>
    </template>

    <template #footer="{ close: closeModal }">
      <div class="flex flex-wrap gap-2.5">
        <button
          class="h-11.5 cursor-pointer rounded-[9px] border border-border-input bg-white px-4.5 text-sm font-semibold text-text-primary"
          type="button"
          @click="closeModal()">
          {{ t('permit.detail.requestClose.cancel') }}
        </button>
        <button
          :class="submitting
            ? 'bg-disabled text-white cursor-not-allowed'
            : 'bg-status-active-fg text-white cursor-pointer'"
          :disabled="submitting"
          class="h-11.5 flex-1 rounded-[9px] px-4.5 text-sm font-bold"
          data-test="request-close-confirm"
          type="button"
          @click="submit()">
          {{ submitting
            ? t('permit.detail.requestClose.submitting')
            : (isAlreadyRequested ? t('permit.detail.requestClose.again') : t('permit.detail.requestClose.confirm')) }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, useTemplateRef, watch, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form, type FormSubmitEvent } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import BaseModal from '@/components/modal/BaseModal.vue'
import LabelField from '@/components/input/LabelField.vue'
import { scrollToFirstError } from '@/utils/HandleSubmit'
import { handleLoading } from '@/utils/HandleLoading'
import { toast } from '@/plugins/toast'
import { useApiError } from '@/composables/useApiError'
import {
  RequestCloseSchema,
  useRequestCloseInitialValues,
  type TRequestCloseFormValues
} from '@/pages/permit/pages/detail/schema/RequestClose.schema'
import type { IRequestClosePermitPayload } from '@/models/request/permit/PermitReq.model'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import PermitProvider, { type IPermitProvider } from '@/resources/provider/permit/Permit.provider'

/**
 * wayfinder 098 (reopened 2026-09-11) — reverses ticket 020/PMT-011's own closure checklist.
 * The contractor no longer closes a permit; this raises `POST /permits/:id/close-request` and
 * leaves the permit exactly as it was (ACTIVE/FIRE_MONITOR) for a Safety Officer to review.
 *
 * The old checklist's yes/no items and e-signature are deliberately NOT carried over: neither has
 * a field on `close-request`'s wire body (`{ reason?: string }` only — see close-request.model.ts
 * on the api side), so keeping them would either silently drop what the contractor entered or
 * pretend a client-only tally was recorded server-side. `PermitClosureSection.vue` still renders
 * `closureChecklist` once Safety actually closes — that shape is unchanged, it is just no longer
 * built by this modal.
 *
 * Idempotent by design (close-request.service.ts's own comment: "a signal to safety, not a
 * lock") — a permit that already has a pending request may still open this modal and send again,
 * pre-filled with the existing reason, which simply refreshes who/when/why rather than being
 * refused as a conflict.
 */
interface IProps {
  permit: IPermitDetail
}

interface IEmits {
  requested: [permit: IPermitDetail]
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>({ default: false })

const { t } = useI18n()
const { mapError } = useApiError()

const PermitService: IPermitProvider = new PermitProvider()

const formRef = useTemplateRef<any>('formRef')
const resolver = zodResolver(RequestCloseSchema)
const submitting: Ref<boolean> = ref(false)
const blockMessage: Ref<string> = ref('')

/**
 * Same "awaiting Safety" gate `PermitUrgentSection.vue` uses: the flag is set once and never
 * cleared, so it only still means something while the permit is ACTIVE/FIRE_MONITOR.
 */
const isAlreadyRequested: ComputedRef<boolean> = computed((): boolean =>
  Boolean(props.permit.closeRequestedAt)
  && (props.permit.status === 'ACTIVE' || props.permit.status === 'FIRE_MONITOR'))

/**
 * Seeded once at setup so a test (or a caller) that mounts already `visible` still sees the
 * pre-fill — the `watch(visible, …)` below only re-runs `reset()` on a later false→true toggle,
 * which real usage always does (the modal starts hidden) but a direct-`true` mount does not.
 */
const formData: Ref<TRequestCloseFormValues> = ref({
  ...useRequestCloseInitialValues(),
  reason: isAlreadyRequested.value ? (props.permit.closeRequestReason ?? '') : ''
})

async function useRequestClose (): Promise<void> {
  const payload: IRequestClosePermitPayload = { reason: formData.value.reason?.trim() || undefined }
  const response = await PermitService.requestClose(props.permit.id, payload)
  emits('requested', response.data)
  visible.value = false
  toast.success(t('permit.toast.closeRequested'))
}

function onSubmit (event: FormSubmitEvent): void {
  if (!event.valid) {
    scrollToFirstError(event.errors)
    return
  }
  blockMessage.value = ''
  handleLoading(useRequestClose, { loadingUnit: submitting }, (error: unknown): void => {
    // Never swallowed: whatever the server said is rendered here, in the user's language.
    blockMessage.value = mapError(error).message
  })
}

function submit (): void {
  formRef.value?.submit()
}

function reset (): void {
  formData.value = { ...useRequestCloseInitialValues(), reason: isAlreadyRequested.value ? (props.permit.closeRequestReason ?? '') : '' }
  blockMessage.value = ''
}

watch(visible, (value: boolean): void => {
  if (value) reset()
})
</script>

<style scoped>

</style>
