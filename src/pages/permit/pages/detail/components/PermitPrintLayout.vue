<template>
  <div>
    <button
      class="inline-flex h-10 cursor-pointer items-center justify-center rounded-[9px] border border-border bg-surface-card
        px-4 text-[12.5px] font-semibold text-text-primary hover:bg-surface-muted print:hidden"
      data-test="print-trigger"
      type="button"
      @click="onTriggerPrint()">
      {{ t('permit.detail.print.button') }}
    </button>

    <!--
      2026-09-12 owner-filed issue 2 — the full-permit print/export, separate from the Report tab's
      own partial `window.print()` (`PermitReportSection.vue`, wayfinder 112 — that covers visits/
      gaps/closure only). `PermitDetailPage.vue` marks its own on-screen banner/tabs/QR/fire panel
      `print:hidden` so the two never render together.

      `v-if="printReady"` — NOT always-mounted-but-`hidden` — deliberately: this block duplicates
      several on-screen components verbatim (`PermitAuditTimeline`, etc.), and an always-mounted
      hidden copy doubles every `data-test`/ARIA-list match a page-level test makes (e.g. the audit
      `<ol><li>` count) even though it never paints. Mounting only once the trigger has actually
      been clicked keeps the DOM identical to before this feature existed until the user asks to
      print, matching `onTriggerPrint`'s existing lazy-fetch reasoning below.
    -->
    <div
      v-if="printReady"
      class="hidden print:block"
      data-test="print-root">
      <A4Paper>
        <!--
          Header/footer content spec shared with the Safety app (parallel build, same repo family)
          — keep both visually consistent. `position: fixed` repeats the block on every printed
          page in Chromium/Firefox print, which is the mechanism actually rendered by the browsers
          this app targets — CSS Paged Media `@page` margin boxes (`A4Paper.vue`'s `@top-center`/
          `@bottom-center`) are not rendered by mainstream engines and cannot carry per-permit
          dynamic text anyway, so they only carry the generic, static "Page X / Y" counter as a
          best-effort fallback for an engine that does support them (see A4Paper.vue).
        -->
        <header class="print-header">
          <div class="flex items-end justify-between gap-4">
            <div>
              <p class="m-0 text-[20px] font-bold text-accent-500">
                e-safework
              </p>
              <p class="m-0 text-[10px] text-text-secondary">
                {{ t('permit.detail.print.header.subtitle') }}
              </p>
            </div>
            <div class="text-right">
              <p class="m-0 font-mono text-[12px] font-semibold text-text-primary">
                {{ permit.id }}
              </p>
              <p class="m-0 text-[11px] text-text-secondary">
                {{ t(`permit.type.${permit.type}`) }}
              </p>
            </div>
          </div>
          <div class="print-header-rule" />
        </header>

        <footer class="print-footer">
          <div class="print-footer-rule" />
          <div class="flex items-center justify-between gap-4 text-[10px] text-text-secondary">
            <span>{{ t('permit.detail.print.footer.printedVia', { when: printedAt }) }}</span>
          </div>
        </footer>

        <main class="print-body flex flex-col gap-5">
          <section data-test="print-section-header">
            <h1 class="mb-1 text-[18px] font-bold text-text-primary">
              {{ permit.title }}
            </h1>
            <p class="mb-3 text-[12px] text-text-secondary">
              {{ t(`permit.status.${permit.status}`) }}
            </p>
            <dl class="grid grid-cols-2 gap-x-5 gap-y-2 text-[12px]">
              <div>
                <dt class="text-text-tertiary">
                  {{ t('permit.detail.info.location') }}
                </dt>
                <dd>{{ permit.location }}</dd>
              </div>
              <div>
                <dt class="text-text-tertiary">
                  {{ t('permit.detail.info.foreman') }}
                </dt>
                <dd>{{ permit.foreman }}</dd>
              </div>
              <div>
                <dt class="text-text-tertiary">
                  {{ t('permit.detail.info.date') }}
                </dt>
                <dd>{{ workDate }}</dd>
              </div>
              <div>
                <dt class="text-text-tertiary">
                  {{ t('permit.detail.info.time') }}
                </dt>
                <dd class="font-mono">
                  {{ workTime }}
                </dd>
              </div>
              <div>
                <dt class="text-text-tertiary">
                  {{ t('permit.detail.sections.overview.createdBy') }}
                </dt>
                <dd>{{ createdBy }}</dd>
              </div>
              <div>
                <dt class="text-text-tertiary">
                  {{ t('permit.detail.sections.overview.createdAt') }}
                </dt>
                <dd class="font-mono">
                  {{ stamp(permit.createdAt) }}
                </dd>
              </div>
            </dl>
          </section>

          <section data-test="print-section-pre-work">
            <h2 class="mb-2 text-[13px] font-bold text-text-primary">
              {{ t('permit.detail.print.preWork.title') }}
            </h2>
            <p
              v-if="!preWorkRows.length"
              class="text-[12px] text-text-secondary">
              {{ t('permit.detail.print.preWork.empty') }}
            </p>
            <ul
              v-else
              class="flex flex-col gap-1">
              <li
                v-for="row in preWorkRows"
                :key="row.itemKey"
                class="flex items-baseline justify-between gap-3 border-b border-surface-muted py-1 text-[12px]">
                <span>{{ row.label }}</span>
                <span class="font-semibold">{{ row.answerLabel }}</span>
              </li>
            </ul>
          </section>

          <section data-test="print-section-safety">
            <h2 class="mb-2 text-[13px] font-bold text-text-primary">
              {{ t('permit.detail.sections.safety.title') }}
            </h2>
            <PermitSafetySection :permit="permit" />
          </section>

          <section data-test="print-section-jsa">
            <h2 class="mb-2 text-[13px] font-bold text-text-primary">
              {{ t('permit.detail.sections.jsa.title') }}
            </h2>
            <PermitJsaSection :steps="permit.jsaSteps" />
          </section>

          <section data-test="print-section-workers">
            <h2 class="mb-2 text-[13px] font-bold text-text-primary">
              {{ t('permit.detail.sections.workers.title') }}
            </h2>
            <PermitWorkersSection :permit="permit" />
          </section>

          <section
            v-if="isConfined"
            data-test="print-section-entrants">
            <h2 class="mb-2 text-[13px] font-bold text-text-primary">
              {{ t('permit.detail.print.entrants.title') }}
            </h2>
            <p
              v-if="!entrantEvents.length"
              class="text-[12px] text-text-secondary">
              {{ t('permit.detail.print.entrants.empty') }}
            </p>
            <table
              v-else
              class="w-full border-collapse text-[12px]">
              <thead>
                <tr class="border-b border-border text-left text-[10.5px] text-text-tertiary">
                  <th class="py-1 pr-3 font-medium">
                    {{ t('permit.detail.print.entrants.columnWorker') }}
                  </th>
                  <th class="py-1 pr-3 font-medium">
                    {{ t('permit.detail.print.entrants.columnDirection') }}
                  </th>
                  <th class="py-1 font-medium">
                    {{ t('permit.detail.print.entrants.columnWhen') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(event, index) in entrantEvents"
                  :key="index"
                  class="border-b border-surface-muted">
                  <td class="py-1 pr-3">
                    {{ event.workerName ?? t('permit.detail.sections.overview.none') }}
                  </td>
                  <td class="py-1 pr-3">
                    {{ event.direction === 'IN' ? t('permit.detail.print.entrants.directionIn') : t('permit.detail.print.entrants.directionOut') }}
                  </td>
                  <td class="py-1 font-mono">
                    {{ stamp(event.createdAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section
            v-if="isConfined"
            data-test="print-section-gas-log">
            <h2 class="mb-2 text-[13px] font-bold text-text-primary">
              {{ t('permit.detail.print.gasLog.title') }}
            </h2>
            <p
              v-if="!gasLog.length"
              class="text-[12px] text-text-secondary">
              {{ t('permit.detail.print.gasLog.empty') }}
            </p>
            <table
              v-else
              class="w-full border-collapse text-[12px]">
              <thead>
                <tr class="border-b border-border text-left text-[10.5px] text-text-tertiary">
                  <th class="py-1 pr-3 font-medium">
                    {{ t('permit.detail.print.gasLog.columnWhen') }}
                  </th>
                  <th class="py-1 pr-3 font-medium">
                    LEL
                  </th>
                  <th class="py-1 pr-3 font-medium">
                    O₂
                  </th>
                  <th class="py-1 pr-3 font-medium">
                    CO
                  </th>
                  <th class="py-1 pr-3 font-medium">
                    SO₂
                  </th>
                  <th class="py-1 font-medium">
                    {{ t('permit.detail.print.gasLog.columnTester') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="entry in gasLog"
                  :key="entry.id"
                  class="border-b border-surface-muted font-mono">
                  <td class="py-1 pr-3">
                    {{ stamp(entry.recordedAt) }}
                  </td>
                  <td class="py-1 pr-3">
                    {{ entry.lel ?? '—' }}
                  </td>
                  <td class="py-1 pr-3">
                    {{ entry.o2 ?? '—' }}
                  </td>
                  <td class="py-1 pr-3">
                    {{ entry.co ?? '—' }}
                  </td>
                  <td class="py-1 pr-3">
                    {{ entry.so2 ?? '—' }}
                  </td>
                  <td class="py-1">
                    {{ entry.tester }}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section data-test="print-section-visits">
            <h2 class="mb-2 text-[13px] font-bold text-text-primary">
              {{ t('permit.detail.print.visits.title') }}
            </h2>
            <p
              v-if="!visits.length"
              class="text-[12px] text-text-secondary">
              {{ t('permit.detail.print.visits.empty') }}
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

          <section data-test="print-section-approval">
            <h2 class="mb-2 text-[13px] font-bold text-text-primary">
              {{ t('permit.detail.print.approval.title') }}
            </h2>
            <PermitClosureSection :permit="permit" />
          </section>

          <section data-test="print-section-audit">
            <h2 class="mb-2 text-[13px] font-bold text-text-primary">
              {{ t('permit.detail.sections.audit.title') }}
            </h2>
            <PermitAuditTimeline :entries="audit" />
          </section>
        </main>
      </A4Paper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { permitAuthorName, type IPermitAuditEntry, type IPreWorkChecklistAnswer } from '@/models/modules/permit/Permit.model'
import { EPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import A4Paper from '@/components/paper/A4Paper.vue'
import usePrint, { type IUsePrint } from '@/composables/usePrint'
import PermitAuditTimeline from '@/pages/permit/pages/detail/components/PermitAuditTimeline.vue'
import PermitClosureSection from '@/pages/permit/pages/detail/components/PermitClosureSection.vue'
import PermitJsaSection from '@/pages/permit/pages/detail/components/PermitJsaSection.vue'
import PermitReportVisitCard from '@/pages/permit/pages/detail/components/PermitReportVisitCard.vue'
import PermitSafetySection from '@/pages/permit/pages/detail/components/PermitSafetySection.vue'
import PermitWorkersSection from '@/pages/permit/pages/detail/components/PermitWorkersSection.vue'
import usePermitReport, { type IUsePermitReport } from '@/pages/permit/pages/detail/composables/usePermitReport'

/**
 * 2026-09-12 owner-filed issue 2 — the full-permit print/export. Every section fetched or already
 * displayed by another part of the detail page/report tab is reused as-is (`PermitSafetySection`,
 * `PermitJsaSection`, `PermitWorkersSection`, `PermitClosureSection`, `PermitReportVisitCard`,
 * `PermitAuditTimeline`), matching this repo's rule against re-implementing something that already
 * has a working, tested display component. `usePermitReport` — the same composable
 * `PermitReportSection.vue` uses — supplies the entrant/gas-log/inspector-visit data; it is
 * deliberately fetched lazily (on the trigger click, not on mount) so a page that never prints
 * never pays for the report's three extra requests.
 */
interface IProps {
  permit: IPermitDetail
  audit: IPermitAuditEntry[]
}

const props = defineProps<IProps>()

const { t, d } = useI18n()
const { onPrint }: IUsePrint = usePrint()

const {
  visits, gasLog, entrantEvents, fetchReport, gasReadingsForVisit, entrantEventsForVisit
}: IUsePermitReport = usePermitReport(props.permit.id, toRef(props, 'permit'), toRef(props, 'audit'))

const isConfined: ComputedRef<boolean> = computed((): boolean => props.permit.type === EPermitType.CONFINED)

const createdBy: ComputedRef<string> = computed(
  (): string => permitAuthorName(props.permit.createdBy) || t('permit.detail.sections.overview.none'))

/** Mirrors `PermitInfoCard.vue`'s own `workDate`/`workTime` — same fields, same display rules. */
const workDate: ComputedRef<string> = computed((): string => {
  const start = d(new Date(props.permit.startDate), 'short')
  if (props.permit.endDate === props.permit.startDate) return start
  return `${start} – ${d(new Date(props.permit.endDate), 'short')}`
})

function clock (value: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok'
  }).format(parsed)
}

const workTime: ComputedRef<string> = computed((): string => `${clock(props.permit.dailyStart)}–${clock(props.permit.dailyEnd)}`)

function stamp (value: string | null): string {
  if (!value) return t('permit.detail.sections.overview.none')
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return t('permit.detail.sections.overview.none')
  return d(parsed, 'long')
}

/**
 * `itemKey` is `${type}-${number}` (`checklistKey()`, `SafetyChecklist.ts`) — the permit type
 * segment never itself contains a hyphen, so a single split is exact, not a heuristic.
 */
function preWorkAnswerLabel (answer: string): string {
  if (answer === 'yes') return t('permit.detail.sections.closure.answerYes')
  if (answer === 'no') return t('permit.detail.sections.closure.answerNo')
  return t('permit.detail.sections.closure.answerNa')
}

interface IPreWorkRow {
  itemKey: string
  label: string
  answerLabel: string
}

const preWorkRows: ComputedRef<IPreWorkRow[]> = computed(
  (): IPreWorkRow[] => (props.permit.preWorkChecklist ?? []).map(
    (row: IPreWorkChecklistAnswer): IPreWorkRow => {
      const [type, number] = row.itemKey.split('-')
      const labelKey = `permit.create.steps.safetyChecks.checklist.${type}.${number}`
      const label = t(labelKey)
      return { itemKey: row.itemKey, label: label === labelKey ? row.itemKey : label, answerLabel: preWorkAnswerLabel(row.answer) }
    }
  ))

const printedAt: ComputedRef<string> = computed((): string => d(new Date(), 'long'))

const printReady: Ref<boolean> = ref(false)

async function onTriggerPrint (): Promise<void> {
  printReady.value = true
  await fetchReport()
  await onPrint()
}
</script>

<style scoped>
.print-header,
.print-footer {
  display: none;
}

@media print {
  .print-header,
  .print-footer {
    display: block;
    position: fixed;
    left: 0;
    right: 0;
    background: white;
  }

  .print-header {
    top: 0;
  }

  .print-footer {
    bottom: 0;
  }

  .print-header-rule {
    margin-top: 6px;
    height: 2px;
    background: var(--color-accent-500);
  }

  .print-footer-rule {
    margin-bottom: 4px;
    height: 1px;
    background: var(--color-border);
  }

  /* Room for the fixed header/footer above so the flowed content never sits under them. */
  .print-body {
    margin-top: 46px;
    margin-bottom: 28px;
  }
}
</style>
