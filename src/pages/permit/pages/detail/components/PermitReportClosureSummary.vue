<template>
  <div
    class="flex flex-col gap-3.5"
    data-test="report-closure">
    <dl class="grid grid-cols-1 gap-x-5.5 gap-y-2.5 text-[13px] sm:grid-cols-2">
      <div>
        <dt class="mb-0.5 text-[11px] text-text-tertiary">
          {{ t('permit.detail.report.closure.title') }}
        </dt>
        <dd class="text-text-primary break-words">
          {{ permit.title }}
        </dd>
      </div>
      <div>
        <dt class="mb-0.5 text-[11px] text-text-tertiary">
          {{ t('permit.detail.report.closure.type') }}
        </dt>
        <dd class="text-text-primary">
          {{ t(`permit.type.${permit.type}`) }}
        </dd>
      </div>
      <div>
        <dt class="mb-0.5 text-[11px] text-text-tertiary">
          {{ t('permit.detail.report.closure.window') }}
        </dt>
        <dd class="font-mono text-text-primary">
          {{ permit.startDate }} – {{ permit.endDate }}
        </dd>
      </div>
      <div>
        <dt class="mb-0.5 text-[11px] text-text-tertiary">
          {{ t('permit.detail.report.closure.location') }}
        </dt>
        <dd class="text-text-primary break-words">
          {{ permit.location ?? t('permit.detail.sections.overview.none') }}
        </dd>
      </div>
      <div>
        <dt class="mb-0.5 text-[11px] text-text-tertiary">
          {{ t('permit.detail.sections.closure.closedBy') }}
        </dt>
        <dd class="text-text-primary break-words">
          {{ closedBy }}
        </dd>
      </div>
      <div>
        <dt class="mb-0.5 text-[11px] text-text-tertiary">
          {{ t('permit.detail.sections.closure.closedAt') }}
        </dt>
        <dd class="font-mono text-text-primary">
          {{ stamp(permit.closedAt) }}
        </dd>
      </div>
    </dl>

    <div>
      <p class="mb-1 text-[11px] font-semibold text-text-secondary">
        {{ t('permit.detail.report.closure.reasonTitle') }}
      </p>
      <p class="text-[12.5px] text-text-primary break-words">
        {{ closeReason ?? t('permit.detail.report.closure.noReason') }}
      </p>
    </div>

    <div data-test="report-closure-entrants">
      <p class="mb-1 text-[11px] font-semibold text-text-secondary">
        {{ t('permit.detail.report.closure.entrantsTitle') }}
      </p>
      <ul
        v-if="autoCheckedOut.length"
        class="flex flex-col gap-0.5">
        <li
          v-for="(event, index) in autoCheckedOut"
          :key="index"
          class="text-[11.5px] text-text-primary">
          {{ t('permit.detail.report.closure.autoCheckedOutRow', {
            who: event.workerName ?? t('permit.detail.sections.overview.none'),
            when: stamp(event.createdAt)
          }) }}
        </li>
      </ul>
      <p
        v-else
        class="text-[11.5px] text-text-secondary">
        {{ t('permit.detail.report.closure.entrantsClear') }}
      </p>
    </div>

    <!--
      wayfinder 112 — final PPE state, judgement call: rendered from the PERMIT's own
      `ppeDeclared`/`ppeNote` rather than the most recent inspector visit's `ppeChecklist`. See the
      implementation report's Deviations for the reasoning; the label below says which source this is.
    -->
    <div data-test="report-closure-ppe">
      <p class="mb-1 text-[11px] font-semibold text-text-secondary">
        {{ t('permit.detail.report.closure.ppeTitle') }}
      </p>
      <ul
        v-if="permit.ppeDeclared.length"
        class="flex flex-wrap gap-1.5">
        <li
          v-for="item in permit.ppeDeclared"
          :key="item"
          class="rounded-full bg-surface-muted px-2.25 py-0.75 text-[11px] text-text-secondary">
          {{ t(ppeItemLabelKey(item)) }}
        </li>
      </ul>
      <p
        v-else
        class="text-[11.5px] text-text-secondary">
        {{ t('permit.detail.sections.workers.ppeEmpty') }}
      </p>
      <p
        v-if="permit.ppeNote"
        class="mt-1 text-[11.5px] text-text-secondary">
        {{ permit.ppeNote }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { permitAuthorName } from '@/models/modules/permit/Permit.model'
import type { IPermitAuditEntry } from '@/models/modules/permit/Permit.model'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import { ppeItemLabelKey } from '@/utils/InspectorVisitPpe'
import type { IEntrantAuditEvent } from '@/pages/permit/pages/detail/composables/usePermitReport'

/**
 * §B of the permit report (wayfinder 112) — rendered only once `permit.status === 'CLOSED'` (the
 * parent gates this). Read-only, same construction as `PermitClosureSection.vue`.
 */
interface IProps {
  permit: IPermitDetail
  audit: IPermitAuditEntry[]
  entrantEvents: IEntrantAuditEvent[]
}

const props = defineProps<IProps>()

const { t, d } = useI18n()

function stamp (value: string | null): string {
  if (!value) return t('permit.detail.sections.overview.none')
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return t('permit.detail.sections.overview.none')
  return d(parsed, 'long')
}

const closedBy: ComputedRef<string> = computed(
  (): string => permitAuthorName(props.permit.closedBy) || t('permit.detail.sections.overview.none'))

/** `PERMIT_CLOSED`'s own audit row carries the reason at `payload.reason`. */
const closeReason: ComputedRef<string | null> = computed((): string | null => {
  const entry = props.audit.find((row: IPermitAuditEntry): boolean => row.action === 'PERMIT_CLOSED')
  const payload = entry?.payload && typeof entry.payload === 'object' ? entry.payload as Record<string, unknown> : {}
  return typeof payload.reason === 'string' && payload.reason.trim() ? payload.reason : null
})

/** The closure's own auto-checkout rows — `payload.closedPermit === true` on each `ENTRANT_CHECKED_OUT` row. */
const autoCheckedOut: ComputedRef<IEntrantAuditEvent[]> = computed(
  (): IEntrantAuditEvent[] => props.entrantEvents.filter((event: IEntrantAuditEvent): boolean => event.closedByClosure))
</script>

<style scoped>

</style>
