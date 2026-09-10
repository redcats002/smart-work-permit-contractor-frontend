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
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'

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
 */
interface IProps {
  permit: IPermitDetail
}

const props = defineProps<IProps>()

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
</script>

<style scoped>

</style>
