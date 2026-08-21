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
import { computed, onMounted, watch, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { dayjs } from '@/plugins/dayjs.plugin'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IJsaStep, IPermitWorker } from '@/models/modules/permit/Permit.model'
import { validateReadings, type IReadingFailure } from '@/utils/PermitSafety'
import { allEvidenceAttached } from '../../constants/PhotoEvidence'
import { useCertificatePreflight, type ICertificateProblem } from '../../composables/useCertificatePreflight'
import type { IWizardStepEmits, IWizardStepProps } from '../../wizard/WizardSteps'

/**
 * PMT-009 — step 6, Review & Submit.
 *
 * Read-only. The Submit button lives in WizardFooter and the call itself in
 * `useWizard.submitDraft()`, which localizes any rejection off `errorCode` and returns the user
 * to the step that can fix it. The green rows below are a heads-up, never a promise: the server
 * re-validates everything and its verdict wins.
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
const { state: certificateState, problems: certificateProblems, check: checkCertificates } = useCertificatePreflight()

const permitType: ComputedRef<TPermitType | undefined> = computed(
  (): TPermitType | undefined => props.formData.type
)
const workers: ComputedRef<IPermitWorker[]> = computed((): IPermitWorker[] => props.formData.workers ?? [])
const jsaSteps: ComputedRef<IJsaStep[]> = computed((): IJsaStep[] => props.formData.jsaSteps ?? [])

const typeChipClass: ComputedRef<{ bg: string, fg: string }> = computed(
  (): { bg: string, fg: string } => TYPE_CHIP_CLASS[permitType.value ?? 'hot']
)

const dateTime: ComputedRef<string> = computed((): string => {
  const { workDate, workTimeStart, workTimeEnd } = props.formData
  if (!workDate) return ''
  const date = dayjs(workDate).format('DD MMM YYYY')
  if (!workTimeStart || !workTimeEnd) return date
  return `${date} · ${dayjs(workTimeStart).format('HH:mm')}–${dayjs(workTimeEnd).format('HH:mm')}`
})

/**
 * The design's "Project" cell shows the same value as the heading: the API has no separate
 * `project` field (docs/api/GAPS.md row F) and `title` is what step 2 labels "Project".
 */
const summaryFields: ComputedRef<ISummaryField[]> = computed((): ISummaryField[] => [
  { labelKey: 'permit.create.steps.basicInfo.field.title', value: props.formData.title ?? '' },
  { labelKey: 'permit.create.steps.basicInfo.field.foreman', value: props.formData.foreman ?? '' },
  { labelKey: 'permit.create.steps.review.field.dateTime', value: dateTime.value },
  { labelKey: 'permit.create.steps.basicInfo.field.location', value: props.formData.location ?? '' },
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
      state: certificateState.value === 'idle' ? 'loading' : certificateState.value,
      labelKey: `permit.create.steps.review.check.certificate.${certificateState.value === 'idle' ? 'loading' : certificateState.value}`,
      params: {
        workers: certificateProblems.value
          .map((problem: ICertificateProblem): string => problem.workerName)
          .join(', ')
      }
    }
  ]
})

onMounted((): void => {
  void checkCertificates(workers.value)
})

watch(workers, (next: IPermitWorker[]): void => {
  void checkCertificates(next)
})
</script>

<style scoped>
</style>
