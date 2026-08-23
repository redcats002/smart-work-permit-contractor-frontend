<template>
  <div class="flex flex-col gap-5">
    <div data-test="closure-entrants">
      <p class="mb-1 text-[11px] text-text-tertiary">
        {{ t('permit.detail.sections.closure.entrantCount') }}
      </p>
      <p
        :class="permit.entrantCount > 0 ? 'text-primary' : 'text-text-primary'"
        class="font-mono text-[15px] font-bold">
        {{ permit.entrantCount }}
      </p>
      <p class="mt-1 text-[11.5px] leading-snug text-text-secondary">
        {{ t('permit.detail.sections.closure.entrantNames') }}
      </p>
    </div>

    <div data-test="closure-fire-watch">
      <p class="mb-1.5 text-[12px] font-semibold text-text-secondary">
        {{ t('permit.detail.sections.closure.fireWatchTitle') }}
      </p>

      <p
        v-if="!permit.fireMonitorStartedAt && !permit.fireWatch"
        class="text-[12.5px] text-text-secondary">
        {{ t('permit.detail.sections.closure.fireWatchNone') }}
      </p>

      <dl
        v-else
        class="grid grid-cols-1 gap-x-5.5 gap-y-3 text-[13px] sm:grid-cols-2">
        <div>
          <dt class="mb-0.5 text-[11px] text-text-tertiary">
            {{ t('permit.detail.sections.closure.fireWatchStartedAt') }}
          </dt>
          <dd class="font-mono text-text-primary">
            {{ stamp(permit.fireMonitorStartedAt ?? permit.fireWatch?.startedAt ?? null) }}
          </dd>
        </div>
        <div v-if="permit.fireWatch">
          <dt class="mb-0.5 text-[11px] text-text-tertiary">
            {{ t('permit.detail.sections.closure.fireWatchRemaining') }}
          </dt>
          <dd class="font-mono text-text-primary">
            {{ permit.fireWatch.elapsed ? t('permit.detail.sections.closure.fireWatchElapsed') : fireWatchRemaining }}
          </dd>
        </div>
      </dl>
    </div>

    <div data-test="closure-record">
      <p class="mb-1.5 text-[12px] font-semibold text-text-secondary">
        {{ t('permit.detail.sections.closure.checklistTitle') }}
      </p>

      <p
        v-if="!checklistRows.length"
        class="rounded-[9px] border border-dashed border-border-input bg-surface-app px-4 py-5 text-center text-[12.5px] text-text-secondary"
        data-test="closure-empty">
        {{ t('permit.detail.sections.closure.empty') }}
      </p>

      <template v-else>
        <ul class="overflow-hidden rounded-[10px] border border-border">
          <li
            v-for="row in checklistRows"
            :key="row.key"
            :data-test="`closure-item-${row.key}`"
            class="flex items-center gap-3 border-b border-surface-muted px-3.5 py-2.5 last:border-b-0">
            <span class="min-w-0 flex-1 text-[13px] leading-tight text-text-primary">
              {{ row.label }}
            </span>
            <span
              :class="row.answer === 'no'
                ? 'bg-status-rejected-bg text-status-rejected-fg'
                : 'bg-status-active-bg text-status-active-fg'"
              class="shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold">
              {{ row.answerLabel }}
            </span>
          </li>
        </ul>

        <dl class="mt-3.5 grid grid-cols-1 gap-x-5.5 gap-y-3 text-[13px] sm:grid-cols-2">
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
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { permitAuthorName } from '@/models/modules/permit/Permit.model'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'

/**
 * §5 Closure & Fire Watch (05-permit-detail-sections.md).
 *
 * Read-only by construction — the closure ACTION lives in `ClosureChecklistModal`, which attempts
 * the call and renders the server's verdict. This section only reports what the server stored.
 *
 * The remaining time is the page's single server-derived countdown (`fireWatch.remainingSeconds`
 * via `useFireWatch`), passed in rather than recomputed here: a reload must not reset it, and two
 * independent tickers on one page would drift apart.
 *
 * `entrantCount` is the count only — entrant NAMES are not readable by a contractor
 * (docs/api/GAPS.md row I).
 */
interface IProps {
  permit: IPermitDetail
  /** `MM:SS` from the page's existing Fire Watch ticker. */
  fireWatchRemaining?: string
}

interface IChecklistRow {
  key: string
  label: string
  answer: string
  answerLabel: string
}

const props = withDefaults(defineProps<IProps>(), { fireWatchRemaining: '' })

const { t, d } = useI18n()

/** Stored UTC, displayed Asia/Bangkok. */
function stamp (value: string | null): string {
  if (!value) return t('permit.detail.sections.overview.none')
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return t('permit.detail.sections.overview.none')
  return d(parsed, 'long')
}

function answerLabel (answer: string): string {
  if (answer === 'yes') return t('permit.detail.sections.closure.answerYes')
  if (answer === 'no') return t('permit.detail.sections.closure.answerNo')
  return t('permit.detail.sections.closure.answerNa')
}

/**
 * `closureChecklist` is stored verbatim as the object the modal sent (`{ itemKey: 'yes' | 'no' }`)
 * — the transport converts no casing (API-002), so the keys ARE the modal's item keys and reuse
 * its labels. An unrecognized key falls back to the raw key rather than rendering nothing.
 */
const checklistRows: ComputedRef<IChecklistRow[]> = computed((): IChecklistRow[] => {
  const checklist = props.permit.closureChecklist
  if (!checklist || typeof checklist !== 'object') return []

  return Object.entries(checklist).map(([key, value]: [string, unknown]): IChecklistRow => {
    const labelKey = `permit.detail.closure.item.${key}`
    const label = t(labelKey)
    const answer = String(value)
    return { key, label: label === labelKey ? key : label, answer, answerLabel: answerLabel(answer) }
  })
})

const closedBy: ComputedRef<string> = computed(
  (): string => permitAuthorName(props.permit.closedBy) || t('permit.detail.sections.overview.none'))
</script>

<style scoped>

</style>
