<template>
  <BaseModal
    v-model="visible"
    :label="t('permit.detail.markComplete.title')">
    <template #default>
      <p class="text-sm leading-relaxed text-text-strong">
        {{ t('permit.detail.markComplete.body', { minutes: FIRE_WATCH_DURATION_MINUTES }) }}
      </p>
      <p class="mt-2.5 text-sm leading-relaxed text-text-strong">
        {{ t('permit.detail.markComplete.serverSide') }}
      </p>
      <p
        v-if="errorMessage"
        class="mt-3.5 rounded-lg bg-status-rejected-bg px-3.5 py-2.5 text-[13px] text-status-rejected-fg"
        data-test="mark-complete-error">
        {{ errorMessage }}
      </p>
    </template>

    <template #footer="{ close: closeModal }">
      <div class="flex flex-wrap gap-2.5">
        <button
          :class="submitting ? 'bg-disabled cursor-not-allowed' : 'bg-accent cursor-pointer hover:bg-accent-emphasis'"
          :disabled="submitting"
          class="h-11.5 flex-1 rounded-[9px] px-4.5 text-sm font-bold text-white"
          data-test="mark-complete-confirm"
          type="button"
          @click="submit()">
          {{ submitting
            ? t('permit.detail.markComplete.submitting')
            : t('permit.detail.markComplete.confirm', { minutes: FIRE_WATCH_DURATION_MINUTES }) }}
        </button>
        <button
          class="h-11.5 cursor-pointer rounded-[9px] border border-border-input bg-white px-4.5 text-sm font-semibold text-text-primary"
          type="button"
          @click="closeModal()">
          {{ t('permit.detail.markComplete.cancel') }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/modal/BaseModal.vue'
import { useApiError } from '@/composables/useApiError'
import { FIRE_WATCH_DURATION_MINUTES } from '@/pages/permit/pages/detail/composables/useFireWatch'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import PermitProvider, { type IPermitProvider } from '@/resources/provider/permit/Permit.provider'

/**
 * PMT-012 — the Hot-Work-only confirm step, design lines 549-559.
 *
 * SCOPE NOTE: the design also walks a GPS-tagged-photo verification after the countdown. No
 * endpoint models it in `00-SHARED-CONTEXT.md`, `01-backend-elysia-tasks.md` or `openapi.json`, so
 * per the item's stated default it is NOT built — and the copy here deliberately does not promise
 * it. See progress.md 2026-08-22.
 */
interface IProps {
  permitId: string
}

interface IEmits {
  completed: [permit: IPermitDetail]
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>({ default: false })

const { t } = useI18n()
const { mapError } = useApiError()

const PermitService: IPermitProvider = new PermitProvider()

const submitting: Ref<boolean> = ref(false)
const errorMessage: Ref<string> = ref('')

async function submit (): Promise<void> {
  if (submitting.value) return

  submitting.value = true
  errorMessage.value = ''
  try {
    const response = await PermitService.markComplete(props.permitId)
    emits('completed', response.data)
    visible.value = false
  } catch (error: unknown) {
    // NOT_HOT_WORK / PERMIT_NOT_ACTIVE come back here; rendered localized, never swallowed.
    errorMessage.value = mapError(error).message
  } finally {
    submitting.value = false
  }
}

watch(visible, (value: boolean): void => {
  if (value) errorMessage.value = ''
})
</script>

<style scoped>

</style>
