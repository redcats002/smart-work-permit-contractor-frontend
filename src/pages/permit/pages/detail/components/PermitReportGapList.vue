<template>
  <div
    v-if="noVisitDays.length || overdueReadingGaps.length"
    class="flex flex-col gap-3"
    data-test="report-gaps">
    <div
      v-if="noVisitDays.length"
      class="rounded-[9px] border border-status-rejected-border bg-status-rejected-bg px-4 py-3"
      data-test="report-gap-no-visit">
      <p class="mb-1.5 text-[12px] font-semibold text-status-rejected-fg">
        {{ t('permit.detail.report.gaps.noVisitTitle', { count: noVisitDays.length }) }}
      </p>
      <ul class="flex flex-wrap gap-1.5">
        <li
          v-for="gap in noVisitDays"
          :key="gap.date"
          class="rounded-full bg-surface-card px-2.5 py-1 font-mono text-[11px] text-text-primary">
          {{ gap.date }}
        </li>
      </ul>
    </div>

    <div
      v-if="overdueReadingGaps.length"
      class="rounded-[9px] border border-status-rejected-border bg-status-rejected-bg px-4 py-3"
      data-test="report-gap-overdue-reading">
      <p class="mb-1.5 text-[12px] font-semibold text-status-rejected-fg">
        {{ t('permit.detail.report.gaps.overdueTitle', { count: overdueReadingGaps.length }) }}
      </p>
      <ul class="flex flex-col gap-1">
        <li
          v-for="gap in overdueReadingGaps"
          :key="gap.entryId"
          class="text-[12px] text-text-primary">
          {{ t('permit.detail.report.gaps.overdueRow', { dueAt: stamp(gap.dueAt) }) }}
        </li>
      </ul>
    </div>
  </div>

  <p
    v-else
    class="rounded-[9px] border border-dashed border-border-input bg-surface-app px-4 py-4 text-center text-[12.5px] text-text-secondary"
    data-test="report-gaps-empty">
    {{ t('permit.detail.report.gaps.none') }}
  </p>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { INoVisitDayGap, IOverdueReadingGap } from '@/utils/PermitReportGaps'

/**
 * wayfinder 112 — renders both gap types the report derives client-side. Pure display: the
 * derivation itself lives in `src/utils/PermitReportGaps.ts`, unit-tested independently.
 */
interface IProps {
  noVisitDays: INoVisitDayGap[]
  overdueReadingGaps: IOverdueReadingGap[]
}

defineProps<IProps>()

const { t, d } = useI18n()

function stamp (value: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return d(parsed, 'long')
}
</script>

<style scoped>

</style>
