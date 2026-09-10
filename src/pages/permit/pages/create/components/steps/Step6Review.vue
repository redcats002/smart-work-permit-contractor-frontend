<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-col gap-1">
      <h2 class="text-lg font-bold text-text-primary">
        {{ title }}
      </h2>
      <p class="text-sm text-text-secondary">
        {{ t('permit.create.steps.review.subtitle') }}
      </p>
    </div>

    <section class="rounded-xl border border-border p-4 md:p-5">
      <div class="flex flex-wrap items-center gap-2.5 border-b border-surface-muted pb-3.5">
        <span
          v-if="permitType"
          :class="[typeChipClass.bg, typeChipClass.fg]"
          class="rounded-md px-2.5 py-1 text-[11.5px] font-semibold">
          {{ t(`permit.type.${permitType}`) }}
        </span>
        <span class="text-[15px] font-semibold text-text-primary">
          {{ formData.title }}
        </span>
        <span class="ms-auto font-mono text-xs text-text-tertiary">
          {{ draftId || t('permit.create.steps.review.idPending') }}
        </span>
      </div>

      <dl class="mt-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="field in summaryFields"
          :key="field.labelKey">
          <dt class="text-[11px] text-text-tertiary">
            {{ t(field.labelKey) }}
          </dt>
          <dd class="ms-0 text-[13px] text-text-primary">
            {{ field.value || '—' }}
          </dd>
        </div>
      </dl>
    </section>

    <ul class="flex list-none flex-col gap-2 p-0">
      <li
        v-for="row in preflightRows"
        :key="row.key"
        :class="PREFLIGHT_TEXT_CLASS[row.state]"
        class="flex items-start gap-2.5 text-[13px] font-medium">
        <span
          :class="PREFLIGHT_BADGE_CLASS[row.state]"
          class="mt-0.5 inline-flex size-4.5 shrink-0 items-center justify-center rounded-full text-[11px]">
          <span aria-hidden="true">{{ PREFLIGHT_ICON[row.state] }}</span>
        </span>
        <span>{{ t(row.labelKey, row.params ?? {}) }}</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { dayjs } from '@/plugins/dayjs.plugin'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IJsaStep, IPermitWorker } from '@/models/modules/permit/Permit.model'
import { validateReadings, type IReadingFailure } from '@/utils/PermitSafety'
import { parseMapCoordinate } from '@/utils/ParseMapCoordinate'
import { allEvidenceAttached } from '../../constants/PhotoEvidence'
import type { ICertificateProblem } from '../../composables/useCertificatePreflight'
import type { IWizardStepEmits, IWizardStepProps } from '../../wizard/WizardSteps'

/**
 * PMT-009 — step 6, Review & Submit.
 *
 * Read-only. The Submit button lives in WizardFooter and the call itself in
 * `useWizard.submitDraft()`, which localizes any rejection off `errorCode` and returns the user
 * to the step that can fix it. The green rows below are a heads-up, never a promise: the server
 * re-validates everything and its verdict wins.
 *
 * CRT-004 — `certificateState`/`certificateProblems` are now props, not a locally-owned
 * `useCertificatePreflight()` instance: `useWizard` runs ONE shared check (also gating step 4's
 * Next), so this row and that gate can never disagree about which worker is blocking.
 */
type TPreflightState = 'pass' | 'fail' | 'unknown' | 'loading'

interface IPreflightRow {
  key: string
  state: TPreflightState
  labelKey: string
  params?: Record<string, string>
}

interface ISummaryField {
  labelKey: string
  value: string
}

const PREFLIGHT_ICON: Record<TPreflightState, string> = {
  pass: '✓',
  fail: '✗',
  unknown: '?',
  loading: '…'
}

const PREFLIGHT_BADGE_CLASS: Record<TPreflightState, string> = {
  pass: 'bg-status-active-bg text-status-active-fg-emphasis',
  fail: 'bg-status-rejected-bg text-status-rejected-fg',
  unknown: 'bg-status-pending-bg text-status-pending-fg',
  loading: 'bg-surface-muted text-text-tertiary'
}

const PREFLIGHT_TEXT_CLASS: Record<TPreflightState, string> = {
  pass: 'text-status-active-fg-emphasis',
  fail: 'text-status-rejected-fg-emphasis',
  unknown: 'text-status-pending-fg',
  loading: 'text-text-tertiary'
}

const TYPE_CHIP_CLASS: Record<TPermitType, { bg: string, fg: string }> = {
  hot: { bg: 'bg-permit-type-hot-bg', fg: 'text-permit-type-hot-fg' },
  confined: { bg: 'bg-permit-type-confined-bg', fg: 'text-permit-type-confined-fg' },
  heights: { bg: 'bg-permit-type-heights-bg', fg: 'text-permit-type-heights-fg' }
}

const props = defineProps<IWizardStepProps>()
defineEmits<IWizardStepEmits>()

const { t } = useI18n()

const permitType: ComputedRef<TPermitType | undefined> = computed(
  (): TPermitType | undefined => props.formData.type
)
const workers: ComputedRef<IPermitWorker[]> = computed((): IPermitWorker[] => props.formData.workers ?? [])
const jsaSteps: ComputedRef<IJsaStep[]> = computed((): IJsaStep[] => props.formData.jsaSteps ?? [])

const typeChipClass: ComputedRef<{ bg: string, fg: string }> = computed(
  (): { bg: string, fg: string } => TYPE_CHIP_CLASS[permitType.value ?? 'hot']
)

/**
 * wayfinder 067 — `dailyStart`/`dailyEnd` are `1970-01-01`-anchored on the wire; only their
 * LOCAL wall-clock hours/minutes are meaningful, read through `Date#getHours`/`getMinutes`
 * exactly like `Step3WhereWhen`'s `extractTimeOfDay` — never `dayjs(...).format('HH:mm')` on the
 * raw ISO string, which would apply dayjs's configured timezone to a date part nobody set on
 * purpose (see IPermitBase's doc comment for the trap this avoids).
 */
function formatClock (iso: string | undefined): string {
  if (!iso) return ''
  const parsed = new Date(iso)
  if (Number.isNaN(parsed.getTime())) return ''
  return `${String(parsed.getHours()).padStart(2, '0')}:${String(parsed.getMinutes()).padStart(2, '0')}`
}

const dateTime: ComputedRef<string> = computed((): string => {
  const { startDate, endDate, dailyStart, dailyEnd } = props.formData
  if (!startDate) return ''
  const start = dayjs(startDate).format('DD MMM YYYY')
  const end = endDate && endDate !== startDate ? ` – ${dayjs(endDate).format('DD MMM YYYY')}` : ''
  const clock = dailyStart && dailyEnd ? ` · ${formatClock(dailyStart)}–${formatClock(dailyEnd)}` : ''
  return `${start}${end}${clock}`
})

const areaSummary: ComputedRef<string> = computed(
  (): string => (props.formData.areaId != null ? String(props.formData.areaId) : t('permit.create.steps.review.areaNotSet'))
)

const pinSummary: ComputedRef<string> = computed(
  (): string => (props.formData.position ? t('permit.create.steps.review.pinSet') : t('permit.create.steps.review.pinNotSet'))
)

const geoSummary: ComputedRef<string> = computed((): string => {
  const raw = props.formData.mapUrl
  if (!raw) return t('permit.create.steps.review.geoNotSet')
  const parsed = parseMapCoordinate(raw)
  return parsed.ok ? `${parsed.latitude}, ${parsed.longitude}` : raw
})

/**
 * The design's "Project" cell shows the same value as the heading: the API has no separate
 * `project` field (docs/api/GAPS.md row F) and `title` is what step 2 labels "Project".
 *
 * wayfinder 070 — "Review shows all five groups" from the Where & when step: area, pin, geo
 * coordinate, date/time, and the schedule note. The Position row that used to live in
 * `preflightRows` below is gone; a hydrated draft with a REQUIRED, unset pin is still blocked by
 * `useWizard.canSubmit`'s own `positionState !== 'fail'` check regardless of what is shown here.
 */
const summaryFields: ComputedRef<ISummaryField[]> = computed((): ISummaryField[] => [
  { labelKey: 'permit.create.steps.basicInfo.field.title', value: props.formData.title ?? '' },
  { labelKey: 'permit.create.steps.basicInfo.field.foreman', value: props.formData.foreman ?? '' },
  { labelKey: 'permit.create.steps.basicInfo.field.location', value: props.formData.location ?? '' },
  { labelKey: 'permit.create.steps.review.field.dateTime', value: dateTime.value },
  { labelKey: 'permit.create.steps.review.field.area', value: areaSummary.value },
  { labelKey: 'permit.create.steps.review.field.pin', value: pinSummary.value },
  { labelKey: 'permit.create.steps.review.field.geo', value: geoSummary.value },
  { labelKey: 'permit.create.steps.review.field.scheduleNote', value: props.formData.scheduleNote ?? '' },
  {
    labelKey: 'permit.create.steps.review.field.workers',
    value: t('permit.create.steps.review.workersCount', { count: workers.value.length })
  },
  {
    labelKey: 'permit.create.steps.review.field.jsaSteps',
    value: t('permit.create.steps.review.jsaCount', { count: jsaSteps.value.length })
  }
])

const readingFailures: ComputedRef<IReadingFailure[]> = computed((): IReadingFailure[] => {
  if (!permitType.value) return []
  return validateReadings(permitType.value, props.formData.safetyReading ?? {}, props.formData.outdoorWork ?? false)
})

/**
 * wayfinder 070 — the standalone "Position" preflight row is gone from here; the pin is now
 * summarized inline in `summaryFields` above (`pinSummary`) alongside the rest of Where & when.
 * Submit gating is unaffected: `useWizard.canSubmit` still reads `positionState` directly.
 */
const preflightRows: ComputedRef<IPreflightRow[]> = computed((): IPreflightRow[] => {
  const atmosphereBypassed = props.formData.outdoorWork === true
  const evidenceAttached = allEvidenceAttached(permitType.value, props.formData.photos)

  return [
    {
      key: 'atmosphere',
      state: readingFailures.value.length === 0 ? 'pass' : 'fail',
      labelKey: atmosphereBypassed && readingFailures.value.length === 0
        ? 'permit.create.steps.review.check.atmosphereBypassed'
        : (readingFailures.value.length === 0
          ? 'permit.create.steps.review.check.atmospherePass'
          : 'permit.create.steps.review.check.atmosphereFail')
    },
    {
      key: 'evidence',
      state: evidenceAttached ? 'pass' : 'fail',
      labelKey: evidenceAttached
        ? 'permit.create.steps.review.check.evidencePass'
        : 'permit.create.steps.review.check.evidenceFail'
    },
    {
      key: 'certificates',
      state: props.certificateState === 'idle' ? 'loading' : props.certificateState,
      labelKey: `permit.create.steps.review.check.certificate.${props.certificateState === 'idle' ? 'loading' : props.certificateState}`,
      params: {
        workers: props.certificateProblems
          .map((problem: ICertificateProblem): string => problem.workerName)
          .join(', ')
      }
    }
  ]
})
</script>

<style scoped>
</style>
