<template>
  <section
    v-if="isCloseRequestedAwaitingSafety"
    class="mb-4.5 flex items-start gap-3 rounded-xl border border-status-pending-border bg-status-pending-bg px-4.5 py-4"
    data-test="urgent-close-requested">
    <span
      aria-hidden="true"
      class="flex size-10.5 shrink-0 items-center justify-center rounded-[10px] bg-white text-xl text-status-pending-fg">
      🔔
    </span>
    <div class="min-w-0 flex-1">
      <p class="text-sm font-bold text-status-pending-fg">
        {{ t('permit.detail.urgent.closeRequested.title') }}
      </p>
      <p class="mt-0.75 text-[12.5px] leading-relaxed break-words text-status-pending-fg">
        {{ t('permit.detail.urgent.closeRequested.body', { who: requesterLabel, when: requestedAtLabel }) }}
      </p>
      <p
        v-if="permit.closeRequestReason"
        class="mt-1 text-[12.5px] leading-relaxed break-words text-status-pending-fg">
        {{ t('permit.detail.urgent.closeRequested.reasonPrefix') }}{{ permit.closeRequestReason }}
      </p>
    </div>
  </section>

  <!-- Permit-timeout warning — ≤30 minutes left, the permit is still ACTIVE/FIRE_MONITOR. -->
  <section
    v-if="showTimeoutWarning"
    class="mb-4.5 flex items-start gap-3 rounded-xl border border-status-fire-monitor-border bg-status-fire-monitor-bg px-4.5 py-4"
    data-test="urgent-timeout-warning">
    <span
      aria-hidden="true"
      class="flex size-10.5 shrink-0 items-center justify-center rounded-[10px] bg-white text-xl text-status-fire-monitor-fg">
      ⏳
    </span>
    <div class="min-w-0 flex-1">
      <p class="text-sm font-bold text-status-fire-monitor-fg-emphasis">
        {{ t('permit.detail.urgent.timeoutWarning.title') }}
      </p>
      <p
        class="mt-0.75 text-[12.5px] leading-relaxed break-words text-status-fire-monitor-fg"
        data-test="urgent-timeout-warning-remaining">
        {{ t('permit.detail.urgent.timeoutWarning.body', { remaining: countdown.remaining.value }) }}
      </p>
      <div class="mt-2.5 flex flex-wrap gap-2">
        <button
          class="h-9.5 cursor-pointer rounded-[8px] bg-status-fire-monitor-fg px-4 text-[12.5px] font-bold text-white"
          data-test="urgent-timeout-warning-extend"
          type="button"
          @click="showExtend = true">
          {{ t('permit.detail.extend.start') }}
        </button>
        <button
          class="h-9.5 cursor-pointer rounded-[8px] border border-status-fire-monitor-border bg-white px-4 text-[12.5px] font-semibold text-status-fire-monitor-fg-emphasis"
          data-test="urgent-timeout-warning-dismiss"
          type="button"
          @click="dismissed = true">
          {{ t('permit.detail.urgent.timeoutWarning.dismiss') }}
        </button>
      </div>
    </div>
  </section>

  <!-- The work window has ended and the server has marked the permit EXPIRED. -->
  <section
    v-if="showTimeoutExpired"
    class="mb-4.5 flex items-start gap-3 rounded-xl border border-status-expired-fg bg-status-expired-bg px-4.5 py-4"
    data-test="urgent-timeout-expired">
    <span
      aria-hidden="true"
      class="flex size-10.5 shrink-0 items-center justify-center rounded-[10px] bg-white text-xl text-status-expired-fg">
      ⛔
    </span>
    <div class="min-w-0 flex-1">
      <p class="text-sm font-bold text-status-expired-fg">
        {{ t('permit.detail.urgent.timeoutExpired.title') }}
      </p>
      <p class="mt-0.75 text-[12.5px] leading-relaxed break-words text-status-expired-fg">
        {{ t('permit.detail.urgent.timeoutExpired.body') }}
      </p>
      <div class="mt-2.5 flex flex-wrap gap-2">
        <button
          class="h-9.5 cursor-pointer rounded-[8px] bg-status-expired-fg px-4 text-[12.5px] font-bold text-white"
          data-test="urgent-timeout-expired-extend"
          type="button"
          @click="showExtend = true">
          {{ t('permit.detail.extend.start') }}
        </button>
        <button
          class="h-9.5 cursor-pointer rounded-[8px] border border-status-expired-fg bg-white px-4 text-[12.5px] font-semibold text-status-expired-fg"
          data-test="urgent-timeout-expired-request-closure"
          type="button"
          @click="emits('requestClosure')">
          {{ isCloseRequestedAwaitingSafety ? t('permit.detail.requestClose.again') : t('permit.detail.requestClose.start') }}
        </button>
      </div>
    </div>
  </section>

  <ExtendPermitModal
    v-model="showExtend"
    :permit="permit"
    @extended="onExtended($event)" />
</template>

<script setup lang="ts">
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import usePermitCountdown from '@/pages/permit/pages/detail/composables/usePermitCountdown'
import ExtendPermitModal from '@/pages/permit/pages/detail/components/ExtendPermitModal.vue'

/**
 * wayfinder 113 / ruling 11 — urgent and notification-related state stays a FIXED section above
 * the tabs, absent from the DOM entirely when there is nothing urgent (never an empty box).
 *
 * This app's buildable list is narrower than ruling 11's illustrative one:
 *
 * - **Rejection reason** is deliberately NOT repeated here — `PermitStatusBanner`'s `rejected`
 *   variant already renders it unconditionally, above where the tabs sit, so a second red box
 *   with the same sentence would be exactly the duplication this ticket exists to remove.
 * - **An inspector `CORRECTIVE_ACTION`/`EMERGENCY`/`INCIDENT` note** is NOT buildable from this
 *   repo: `GET /permits/:id/inspector-visits` is `auth: ['inspector', 'safety_officer']` in
 *   smart-work-permit-api's `inspector-visit-list.http.controller.ts`, and that controller's own
 *   comment says the contractor exclusion is deliberate. Wayfinder 083 (the ticket that decides
 *   whether a contractor may read this) closed unresolved. Opening it is an API change outside
 *   this repo — flagged in the session report for a split-out ticket, same shape as 116.
 * - **A close request awaiting Safety** IS buildable: `POST /permits/:id/close-request` is
 *   already `auth: ['contractor', 'inspector']` (wayfinder 098, API built 2026-09-11), and the
 *   wire Permit entity already carries `closeRequestedAt`/`closeRequestedBy`/`closeRequestedRole`/
 *   `closeRequestReason` (see PermitRes.model.ts). Nothing in THIS app raises the request yet —
 *   that UI is 098's own frontend half, out of scope here — but an inspector can raise one from
 *   the other app today, so this is a real, reachable state, not dead code for a value nothing
 *   can produce.
 * - **The permit-timeout warning** IS buildable: `POST /permits/:id/extend` accepts `contractor`
 *   (own permit only) — see `ExtendPermitModal.vue`. Two states, both derived client-side by
 *   `usePermitCountdown.ts` from `endDate`/`dailyEnd` (the server has no countdown field for the
 *   work window the way it does for Fire Watch): a **warning** at ≤30 minutes remaining while the
 *   permit is still ACTIVE/FIRE_MONITOR (dismissible for this page load only — a plain local
 *   `ref`, not persisted, so it returns on the next reload rather than being silenced forever),
 *   and an **expired** banner once the server has actually swept the permit to `EXPIRED` — that
 *   one is never dismissible, and offers "Request Closure" (reusing the existing
 *   `RequestCloseModal`/`requestClose()` flow already wired on `PermitDetailPage.vue`, via the
 *   `requestClosure` emit below) alongside "Extend".
 */
interface IProps {
  permit: IPermitDetail
}

interface IEmits {
  extended: [permit: IPermitDetail]
  requestClosure: []
}

const props = defineProps<IProps>()
const emits = defineEmits<IEmits>()

const { t, d } = useI18n()

/**
 * The flag is set once and NEVER cleared (see the model comment) — so "awaiting Safety" is
 * `closeRequestedAt` set AND the permit is still in one of the two statuses a request can be
 * raised against, not merely "is the timestamp set". A CLOSED permit's request was fulfilled; an
 * EXPIRED permit's request is moot — neither should keep claiming to be awaiting anyone.
 */
const isCloseRequestedAwaitingSafety: ComputedRef<boolean> = computed((): boolean =>
  Boolean(props.permit.closeRequestedAt)
  && (props.permit.status === 'ACTIVE' || props.permit.status === 'FIRE_MONITOR'))

const requesterLabel: ComputedRef<string> = computed((): string => {
  const role = props.permit.closeRequestedRole
  if (role === 'contractor') return t('permit.detail.urgent.closeRequested.role.contractor')
  if (role === 'inspector') return t('permit.detail.urgent.closeRequested.role.inspector')
  if (role === 'safety_officer') return t('permit.detail.urgent.closeRequested.role.safety_officer')
  return t('permit.detail.urgent.closeRequested.role.unknown')
})

const requestedAtLabel: ComputedRef<string> = computed((): string => (
  props.permit.closeRequestedAt ? d(new Date(props.permit.closeRequestedAt), 'long') : ''
))

// ---- Permit-timeout warning -----------------------------------------------------------------

const permitRef: ComputedRef<IPermitDetail | null> = computed((): IPermitDetail | null => props.permit)
const countdown = usePermitCountdown(permitRef)

/** Session-only: a plain local ref, not persisted anywhere — returns on the next page load. */
const dismissed: Ref<boolean> = ref(false)
const showExtend: Ref<boolean> = ref(false)

const showTimeoutWarning: ComputedRef<boolean> = computed((): boolean =>
  countdown.state.value === 'warning' && !dismissed.value)

const showTimeoutExpired: ComputedRef<boolean> = computed((): boolean =>
  countdown.state.value === 'expired')

function onExtended (updated: IPermitDetail): void {
  dismissed.value = false
  emits('extended', updated)
}
</script>

<style scoped>

</style>
