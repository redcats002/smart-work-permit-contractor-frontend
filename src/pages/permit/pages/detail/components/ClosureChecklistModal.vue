<template>
  <BaseModal
    v-model="visible"
    :label="t('permit.detail.closure.title')">
    <template #default>
      <p class="mb-4.5 text-[13px] text-text-secondary">
        {{ t('permit.detail.closure.subtitle') }}
      </p>

      <!--
        The server's verdict, localized off `errorCode` — never the backend's own `message`.
        The client does NOT pre-empt this: the call is always attempted and this banner only ever
        renders what came back.
      -->
      <div
        v-if="blockMessage"
        class="mb-4 rounded-[10px] bg-primary px-4 py-3.5 text-white"
        data-test="closure-block">
        <p class="text-sm font-bold">
          ⛔ {{ blockTitle }}
        </p>
        <p class="mt-1 text-[12.5px] leading-snug opacity-90">
          {{ blockMessage }}
        </p>
        <p
          v-if="blockDetail"
          class="mt-1.5 text-xs opacity-80">
          {{ blockDetail }}
        </p>
      </div>

      <ul class="mb-4 overflow-hidden rounded-[10px] border border-border">
        <li
          v-for="item in items"
          :key="item.key"
          :class="rowClass(item.key)"
          class="flex items-center gap-3 border-b border-surface-muted px-3.5 py-3 last:border-b-0">
          <span class="min-w-0 flex-1 text-[13.5px] leading-tight text-text-primary">
            {{ t(`permit.detail.closure.item.${item.key}`) }}
          </span>
          <span class="flex shrink-0 gap-1.5">
            <button
              :aria-label="t('permit.detail.closure.answerYes')"
              :class="answers[item.key] === 'yes' ? 'bg-status-active-fg text-white' : 'bg-surface-subtle text-text-tertiary'"
              :data-test="`closure-yes-${item.key}`"
              class="size-8 cursor-pointer rounded-[7px] font-bold"
              type="button"
              @click="setAnswer(item.key, 'yes')">
              ✓
            </button>
            <button
              :aria-label="t('permit.detail.closure.answerNo')"
              :class="answers[item.key] === 'no' ? 'bg-primary text-white' : 'bg-surface-subtle text-text-tertiary'"
              :data-test="`closure-no-${item.key}`"
              class="size-8 cursor-pointer rounded-[7px] font-bold"
              type="button"
              @click="setAnswer(item.key, 'no')">
              ✗
            </button>
          </span>
        </li>
      </ul>

      <div
        v-if="allAnswered"
        class="mb-4 rounded-[10px] border border-border px-4 py-3.5"
        data-test="closure-signature">
        <p class="mb-2.5 text-[13px] font-semibold text-text-primary">
          {{ t('permit.detail.closure.signature.title') }}
        </p>
        <button
          :class="signedAt ? 'border-status-active-fg text-status-active-fg' : 'border-border-input text-text-secondary'"
          class="flex h-20 w-full cursor-pointer items-center justify-center rounded-lg border-[1.5px] border-dashed bg-surface-app text-[13px]"
          type="button"
          @click="sign()">
          {{ signedAt ? t('permit.detail.closure.signature.signed', { who: signatureName }) : t('permit.detail.closure.signature.tap') }}
        </button>
        <p class="mt-1.5 font-mono text-[11px] text-text-tertiary">
          {{ signedAt ? signedTimestamp : t('permit.detail.closure.signature.pending') }}
        </p>
      </div>
    </template>

    <template #footer="{ close: closeModal }">
      <div class="flex flex-wrap gap-2.5">
        <button
          class="h-11.5 cursor-pointer rounded-[9px] border border-border-input bg-white px-4.5 text-sm font-semibold text-text-primary"
          type="button"
          @click="closeModal()">
          {{ t('permit.detail.closure.cancel') }}
        </button>
        <button
          :class="canConfirm
            ? 'bg-status-active-fg text-white cursor-pointer'
            : 'bg-disabled text-white cursor-not-allowed'"
          :disabled="!canConfirm"
          class="h-11.5 flex-1 rounded-[9px] px-4.5 text-sm font-bold"
          data-test="closure-confirm"
          type="button"
          @click="submit()">
          {{ submitting ? t('permit.detail.closure.submitting') : t('permit.detail.closure.confirm') }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseModal from '@/components/modal/BaseModal.vue'
import { EApiErrorCode } from '@/enums/modules/error/ApiErrorCode.enum'
import { toast } from '@/plugins/toast'
import { useApiError } from '@/composables/useApiError'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IClosePermitPayload } from '@/models/request/permit/PermitReq.model'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import PermitProvider, { type IPermitProvider } from '@/resources/provider/permit/Permit.provider'

interface IProps {
  permit: IPermitDetail
  /** `MM:SS` left on the Hot Work Fire Watch, for the FIRE_WATCH_NOT_ELAPSED banner. */
  fireWatchRemaining?: string
}

interface IEmits {
  closed: [permit: IPermitDetail]
}

interface IChecklistItem {
  key: string
}

const props = withDefaults(defineProps<IProps>(), { fireWatchRemaining: '' })
const emits = defineEmits<IEmits>()

const visible = defineModel<boolean>({ default: false })

const { t, d } = useI18n()
const { mapError } = useApiError()

const PermitService: IPermitProvider = new PermitProvider()

/**
 * Design lines 588-596 — the checklist differs per permit type. These keys are sent verbatim as
 * the `checklist` object and stored as `closureChecklist`; the transport converts no casing
 * (`API-002`), so what is written here is what the backend records.
 */
const CHECKLIST_KEYS: Record<TPermitType, string[]> = {
  confined: ['entrantsExited', 'worksiteRestored', 'equipmentRemoved', 'entryPointSealed', 'documentationCompleted'],
  heights: ['workersDescended', 'scaffoldingSecured', 'areaBelowCleared', 'documentationCompleted'],
  hot: ['worksiteRestored', 'equipmentRemoved', 'barricadesRemoved', 'documentationCompleted']
}

const answers: Ref<Record<string, 'yes' | 'no'>> = ref({})
const signedAt: Ref<string> = ref('')
const submitting: Ref<boolean> = ref(false)
const blockCode: Ref<string> = ref('')
const blockMessage: Ref<string> = ref('')

const items: ComputedRef<IChecklistItem[]> = computed(
  (): IChecklistItem[] => CHECKLIST_KEYS[props.permit.type].map((key: string): IChecklistItem => ({ key })))

const allAnswered: ComputedRef<boolean> = computed(
  (): boolean => items.value.every((item: IChecklistItem): boolean => answers.value[item.key] !== undefined))

const signatureName: ComputedRef<string> = computed((): string => props.permit.foreman)

const signedTimestamp: ComputedRef<string> = computed(
  (): string => (signedAt.value ? d(new Date(signedAt.value), 'long') : ''))

const canConfirm: ComputedRef<boolean> = computed((): boolean => allAnswered.value && signedAt.value !== '' && !submitting.value)

const blockTitle: ComputedRef<string> = computed((): string => {
  if (blockCode.value === EApiErrorCode.ENTRANTS_STILL_INSIDE) {
    return t('permit.detail.closure.blocked.entrants', { count: props.permit.entrantCount })
  }
  if (blockCode.value === EApiErrorCode.FIRE_WATCH_NOT_ELAPSED) return t('permit.detail.closure.blocked.fireWatch')
  return t('permit.detail.closure.blocked.generic')
})

/**
 * Extra context the localized `errorCode` string cannot carry on its own. The entrant COUNT comes
 * from the permit payload's server-computed `entrantCount` (GAPS.md row A, closed 2026-08-21) — not
 * from parsing the backend's English `message`, which is never rendered. Entrant NAMES are still
 * unavailable to a contractor: only the inspector-facing entrants endpoint has them (GAPS.md row I).
 */
const blockDetail: ComputedRef<string> = computed((): string => {
  if (blockCode.value === EApiErrorCode.ENTRANTS_STILL_INSIDE) return t('permit.detail.closure.blocked.entrantsDetail')
  if (blockCode.value === EApiErrorCode.FIRE_WATCH_NOT_ELAPSED && props.fireWatchRemaining) {
    return t('permit.detail.closure.blocked.fireWatchDetail', { remaining: props.fireWatchRemaining })
  }
  return ''
})

function rowClass (key: string): string {
  if (answers.value[key] === 'yes') return 'bg-status-active-bg/40'
  if (answers.value[key] === 'no') return 'bg-status-rejected-bg/40'
  return 'bg-surface-card'
}

function setAnswer (key: string, value: 'yes' | 'no'): void {
  answers.value = { ...answers.value, [key]: value }
}

/**
 * The wire takes `signature` as a plain string — there is no drawn-signature or image field on
 * `POST /permits/:id/close`, so the pad records an attested foreman name plus the moment it was
 * tapped rather than pretending to capture strokes.
 */
function sign (): void {
  signedAt.value = new Date().toISOString()
}

function reset (): void {
  answers.value = {}
  signedAt.value = ''
  blockCode.value = ''
  blockMessage.value = ''
}

async function submit (): Promise<void> {
  if (!canConfirm.value) return

  const payload: IClosePermitPayload = {
    checklist: { ...answers.value },
    signature: `${signatureName.value} · ${signedAt.value}`
  }

  submitting.value = true
  blockCode.value = ''
  blockMessage.value = ''
  try {
    const response = await PermitService.close(props.permit.id, payload)
    emits('closed', response.data)
    visible.value = false
    // wayfinder ticket 008 — "permit closed" is sanctioned to toast, in addition to the status
    // badge on the detail page updating in place once the modal closes.
    toast.success(t('permit.toast.closed'))
  } catch (error: unknown) {
    // Never swallowed: whatever the server said is rendered here, in the user's language.
    const mapped = mapError(error)
    blockCode.value = mapped.code
    blockMessage.value = mapped.message
  } finally {
    submitting.value = false
  }
}

watch(visible, (value: boolean): void => {
  if (value) reset()
})
</script>

<style scoped>

</style>
