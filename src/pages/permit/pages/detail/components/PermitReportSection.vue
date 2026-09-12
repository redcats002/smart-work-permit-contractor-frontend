<template>
  <div
    class="flex flex-col gap-5"
    data-test="report-root">
    <div class="flex flex-wrap items-center justify-between gap-3 print:hidden">
      <p class="max-w-md text-[11.5px] leading-snug text-text-secondary">
        {{ t('permit.detail.report.printHint') }}
      </p>
      <button
        class="inline-flex h-10 cursor-pointer items-center justify-center rounded-[9px] border border-border bg-surface-card
          px-4 text-[12.5px] font-semibold text-text-primary hover:bg-surface-muted"
        data-test="report-print"
        type="button"
        @click="onPrint()">
        {{ t('permit.detail.report.printButton') }}
      </button>
    </div>

    <section data-test="report-gaps-section">
      <h3 class="mb-2 text-[13px] font-bold text-text-primary">
        {{ t('permit.detail.report.gapsTitle') }}
      </h3>
      <PermitReportGapList
        :no-visit-days="noVisitDays"
        :overdue-reading-gaps="overdueReadingGaps" />
    </section>

    <section data-test="report-currently-inside">
      <p class="text-[12.5px] text-text-secondary">
        {{ t('permit.detail.report.currentlyInside', { count: currentlyInside.length }) }}
      </p>
    </section>

    <section data-test="report-visits-section">
      <h3 class="mb-2 text-[13px] font-bold text-text-primary">
        {{ t('permit.detail.report.visitsTitle') }}
      </h3>

      <p
        v-if="loading"
        class="text-[12.5px] text-text-secondary">
        {{ t('permit.detail.report.loading') }}
      </p>

      <p
        v-else-if="!visits.length"
        class="rounded-[9px] border border-dashed border-border-input bg-surface-app px-4 py-5 text-center text-[12.5px] text-text-secondary"
        data-test="report-visits-empty">
        {{ t('permit.detail.report.visitsEmpty') }}
      </p>

      <ul
        v-else
        class="flex flex-col gap-3">
        <PermitReportVisitCard
          v-for="visit in visits"
          :key="visit.id"
          :entrant-events="entrantEventsForVisit(visit)"
          :gas-readings="gasReadingsForVisit(visit)"
          :visit="visit" />
      </ul>
    </section>

    <section
      v-if="permit.status === 'CLOSED'"
      data-test="report-closure-section">
      <h3 class="mb-2 text-[13px] font-bold text-text-primary">
        {{ t('permit.detail.report.closure.title') }}
      </h3>
      <PermitReportClosureSummary
        :audit="audit"
        :entrant-events="entrantEvents"
        :permit="permit" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IPermitAuditEntry } from '@/models/modules/permit/Permit.model'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import PermitReportClosureSummary from '@/pages/permit/pages/detail/components/PermitReportClosureSummary.vue'
import PermitReportGapList from '@/pages/permit/pages/detail/components/PermitReportGapList.vue'
import PermitReportVisitCard from '@/pages/permit/pages/detail/components/PermitReportVisitCard.vue'
import usePermitReport, { type IUsePermitReport } from '@/pages/permit/pages/detail/composables/usePermitReport'

/**
 * wayfinder 112 — the permit report tab. A+B in one component: the visits view (always rendered)
 * and the closure summary (rendered only once the permit is `CLOSED`). Self-contained by design —
 * fetches its own data via `usePermitReport`, reaches into no contractor-only global state, so the
 * safety app can build a near-identical copy off the same providers/models.
 *
 * `audit` is a prop, not a re-fetch: the page's own `usePermitDetail` already fetches it. A 403 on
 * a foreign permit is handled entirely at the page level (`PermitDetailPage.vue`'s existing
 * `v-else-if="!permit"` branch) — this component only ever mounts once the permit already loaded
 * for its owner, so it never needs its own forbidden state.
 */
interface IProps {
  permit: IPermitDetail
  audit: IPermitAuditEntry[]
}

const props = defineProps<IProps>()

const { t } = useI18n()

const {
  visits, currentlyInside, loading, entrantEvents, noVisitDays, overdueReadingGaps,
  fetchReport, gasReadingsForVisit, entrantEventsForVisit
}: IUsePermitReport = usePermitReport(props.permit.id, toRef(props, 'permit'), toRef(props, 'audit'))

function onPrint (): void {
  window.print()
}

onMounted((): void => {
  void fetchReport()
})
</script>

<style scoped>

</style>
