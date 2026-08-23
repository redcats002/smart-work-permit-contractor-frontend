<template>
  <div>
    <!--
      The server's verdict, rendered as-is. Never recomputed client-side, and its scope is the
      readings only — certificates are checked at submit and are not in this summary.
    -->
    <div
      v-if="summary"
      :class="summary.passed
        ? 'border-status-active-border bg-status-active-bg text-status-active-fg'
        : 'border-status-rejected-border bg-status-rejected-bg text-status-rejected-fg'"
      class="mb-4 rounded-[10px] border px-4 py-3.5"
      data-test="safety-verdict">
      <p class="text-[13.5px] font-bold">
        {{ summary.passed ? t('permit.detail.sections.safety.passed') : t('permit.detail.sections.safety.failed') }}
      </p>
      <ul
        v-if="failures.length"
        class="mt-2 flex flex-col gap-1.5"
        data-test="safety-failures">
        <li
          v-for="failure in failures"
          :key="failure.field"
          class="text-[12.5px] leading-snug">
          <span class="font-semibold">{{ t(`permit.create.steps.safetyChecks.reading.${failure.field}`) }}</span>
          — {{ failure.text }}
        </li>
      </ul>
      <p class="mt-2 text-[11.5px] leading-snug text-text-secondary">
        {{ t('permit.detail.sections.safety.scopeNote') }}
      </p>
    </div>

    <p
      v-if="permit.outdoorWork"
      class="mb-4 rounded-[9px] bg-surface-subtle px-3.5 py-2.5 text-[12.5px] leading-snug text-text-secondary"
      data-test="safety-outdoor-bypass">
      {{ t('permit.detail.sections.safety.outdoorBypass') }}
    </p>

    <p
      v-if="!reading"
      class="rounded-[9px] border border-dashed border-border-input bg-surface-app px-4 py-5 text-center text-[12.5px] text-text-secondary"
      data-test="safety-no-reading">
      {{ t('permit.detail.sections.safety.empty') }}
    </p>

    <template v-else>
      <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="row in readings"
          :key="row.key"
          :class="row.failed ? 'border-status-rejected-border bg-status-rejected-bg' : 'border-border bg-surface-app'"
          :data-test="`safety-reading-${row.key}`"
          class="rounded-[9px] border px-3.5 py-3">
          <dt class="mb-1 text-[11.5px] text-text-secondary">
            {{ t(`permit.create.steps.safetyChecks.reading.${row.key}`) }}
          </dt>
          <dd class="font-mono text-[15px] font-bold text-text-primary">
            {{ row.value }}
          </dd>
          <p class="mt-0.5 text-[11px] text-text-tertiary">
            {{ t(row.hint.key, row.hint.params) }}
          </p>
        </div>
      </dl>

      <p class="mt-3 font-mono text-[11.5px] text-text-tertiary">
        {{ recordedAt }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiError } from '@/composables/useApiError'
import { readingHint, type IReadingHint } from '@/pages/permit/pages/create/constants/SafetyReadingView'
import { SAFETY_RANGES, type TSafetyReadingKey } from '@/utils/PermitSafety'
import type { IPermitSafetyReading, IPermitValidationFailure, IPermitValidationSummary } from '@/models/modules/permit/Permit.model'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'

/**
 * §2 Safety readings (05-permit-detail-sections.md).
 *
 * Two rules drive this component:
 * - `validationSummary` is the SERVER's verdict — it is rendered, never recomputed here.
 *   Its failures are localized off `errorCode`; the backend's `message` is never rendered.
 * - `so2` is collected by the wizard but is NOT on the wire (docs/api/GAPS.md row K), so it is
 *   filtered out of the grid: displaying a value the server never stored would be a lie.
 */
interface IProps {
  permit: IPermitDetail
}

interface IReadingRow {
  key: TSafetyReadingKey
  value: string
  hint: IReadingHint
  failed: boolean
}

interface IFailureRow {
  field: string
  text: string
}

const props = defineProps<IProps>()

const { t } = useI18n()
const { mapError } = useApiError()

const summary: ComputedRef<IPermitValidationSummary | null> = computed(
  (): IPermitValidationSummary | null => props.permit.validationSummary ?? null)

const reading: ComputedRef<IPermitSafetyReading | null> = computed(
  (): IPermitSafetyReading | null => props.permit.latestSafetyReading ?? null)

/**
 * `mapError` is the single localization path for a backend `errorCode`. Feeding it the bare code
 * in the shape it already recognizes keeps one implementation instead of a second lookup table.
 */
const failures: ComputedRef<IFailureRow[]> = computed((): IFailureRow[] => (summary.value?.failures ?? []).map(
  (failure: IPermitValidationFailure): IFailureRow => ({
    field: failure.field,
    text: mapError({ errorCode: failure.errorCode }).message
  })
))

const failedFields: ComputedRef<string[]> = computed(
  (): string[] => (summary.value?.failures ?? []).map((failure: IPermitValidationFailure): string => failure.field))

/** SO2 is excluded on purpose — it has no wire field to render. */
const readings: ComputedRef<IReadingRow[]> = computed((): IReadingRow[] => {
  const current = reading.value
  if (!current) return []

  return (SAFETY_RANGES.requiredByType[props.permit.type] ?? [])
    .filter((key: TSafetyReadingKey): boolean => key !== 'so2')
    .map((key: TSafetyReadingKey): IReadingRow => {
      const value = current[key]
      return {
        key,
        value: value === null || value === undefined
          ? t('permit.detail.sections.safety.notRecorded')
          : `${value}${SAFETY_RANGES.ranges[key].unit}`,
        hint: readingHint(key),
        failed: failedFields.value.includes(key)
      }
    })
})

const recordedAt: ComputedRef<string> = computed((): string => {
  const value = reading.value?.recordedAt
  const parsed = value ? new Date(value) : null
  if (!parsed || Number.isNaN(parsed.getTime())) return t('permit.detail.sections.safety.recordedAtUnknown')
  const when = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Bangkok'
  }).format(parsed)
  return t('permit.detail.sections.safety.recordedAt', { when })
})
</script>

<style scoped>

</style>
