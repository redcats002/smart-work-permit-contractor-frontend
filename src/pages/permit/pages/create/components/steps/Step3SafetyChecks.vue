<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-col gap-1">
      <div class="flex flex-wrap items-center gap-2.5">
        <h2 class="text-lg font-bold text-text-primary">
          {{ title }}
        </h2>
        <span
          v-if="permitType"
          :class="[typeChipClass.bg, typeChipClass.fg]"
          class="rounded-md px-2.5 py-1 text-[11.5px] font-semibold">
          {{ t(`permit.type.${permitType}`) }}
        </span>
      </div>
      <p class="text-sm text-text-secondary">
        {{ t('permit.create.steps.safetyChecks.subtitle') }}
      </p>
    </div>

    <template v-if="permitType">
      <div
        v-if="serverRejectedReadings.length"
        class="flex items-start gap-3 rounded-xl border border-status-rejected-border bg-status-rejected-bg
          px-4 py-3.5 text-status-rejected-fg-emphasis">
        <span
          aria-hidden="true"
          class="text-xl leading-none">⛔</span>
        <div class="min-w-0">
          <p class="text-sm font-bold">
            {{ t('permit.create.steps.safetyChecks.serverRejected.title') }}
          </p>
          <ul class="mt-1 flex list-none flex-col gap-0.5 p-0 text-[12.5px] leading-relaxed">
            <li
              v-for="failure in serverRejectedReadings"
              :key="failure.field">
              {{ t(`permit.create.steps.safetyChecks.reading.${failure.field}`) }} ·
              {{ t(`error.${failure.errorCode}`) }}
            </li>
          </ul>
        </div>
      </div>

      <div
        v-if="failures.length"
        class="flex items-start gap-3 rounded-xl bg-primary px-4 py-3.5 text-white">
        <span
          aria-hidden="true"
          class="text-xl leading-none">⛔</span>
        <div class="min-w-0">
          <p class="text-sm font-bold">
            {{ t('permit.create.steps.safetyChecks.blocked.title') }}
          </p>
          <ul class="mt-1 flex list-none flex-col gap-0.5 p-0 text-[12.5px] leading-relaxed">
            <li
              v-for="failure in failures"
              :key="failure.reading">
              {{ readingFailureMessage(failure) }}
            </li>
          </ul>
          <p class="mt-1 text-[12.5px] leading-relaxed opacity-90">
            {{ t('permit.create.steps.safetyChecks.blocked.noOverride') }}
          </p>
        </div>
      </div>
      <div
        v-else
        class="flex items-center gap-2.5 rounded-xl border border-status-active-border bg-status-active-bg
          px-4 py-3 text-[13px] font-medium text-status-active-fg-emphasis">
        <span aria-hidden="true">✓</span> {{ t('permit.create.steps.safetyChecks.safe') }}
      </div>

      <div
        v-if="showOutdoorToggle && !isOutdoor"
        class="flex flex-col gap-3 rounded-lg border border-border bg-surface-app px-3.5 py-3 sm:flex-row sm:items-center">
        <div class="flex-1">
          <p class="text-[13.5px] font-semibold text-text-primary">
            {{ t('permit.create.steps.safetyChecks.outdoor.question') }}
          </p>
          <p class="mt-0.5 text-xs text-text-secondary">
            {{ t('permit.create.steps.safetyChecks.outdoor.hint') }}
          </p>
        </div>
        <button
          class="shrink-0 rounded-md bg-status-active-fg px-3.5 py-1.5 text-[12.5px] font-semibold text-white"
          type="button"
          @click="setOutdoor(true)">
          <span aria-hidden="true">✓</span> {{ t('permit.create.steps.safetyChecks.outdoor.indoorActive') }}
        </button>
      </div>

      <div
        v-if="showOutdoorToggle && isOutdoor"
        class="flex items-start gap-3 rounded-lg border border-border-strong bg-surface-subtle px-3.5 py-3">
        <span aria-hidden="true">🌤</span>
        <div>
          <p class="text-[13.5px] font-semibold text-text-primary">
            {{ t('permit.create.steps.safetyChecks.outdoor.bypassed') }}
          </p>
          <p class="mt-0.5 text-[12.5px] leading-relaxed text-text-secondary">
            {{ t('permit.create.steps.safetyChecks.outdoor.bypassedBody') }}
          </p>
          <button
            class="mt-2 rounded-md border border-border-input bg-surface-card px-3 py-1 text-xs font-semibold text-text-primary"
            type="button"
            @click="setOutdoor(false)">
            {{ t('permit.create.steps.safetyChecks.outdoor.switchToIndoor') }}
          </button>
        </div>
      </div>

      <section
        v-if="atmosphereCards.length"
        class="flex flex-col gap-3">
        <h3 class="text-[13px] font-semibold text-text-primary">
          {{ t('permit.create.steps.safetyChecks.section.atmosphere') }}
        </h3>
        <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-4">
          <div
            v-for="card in atmosphereCards"
            :key="card.reading"
            :class="card.failing
              ? 'border-primary bg-permit-type-hot-bg'
              : 'border-border bg-surface-card'"
            class="flex flex-col gap-2 rounded-xl border p-3.5">
            <div>
              <p class="text-[11.5px] font-semibold text-text-secondary">
                {{ t(`permit.create.steps.safetyChecks.reading.${card.reading}`) }}
              </p>
              <p class="text-[10px] text-text-tertiary">
                {{ t(card.hint.key, card.hint.params) }}
              </p>
            </div>
            <div class="flex items-baseline gap-1.5">
              <InputNumber
                :invalid="card.failing"
                :max-fraction-digits="2"
                :min-fraction-digits="0"
                :model-value="card.value"
                class="w-24"
                input-class="font-mono font-semibold"
                @update:model-value="setReading(card.reading, $event)" />
              <span class="text-sm font-semibold text-text-secondary">{{ card.unit }}</span>
            </div>
            <PhotoSlot
              :label="t('permit.create.steps.safetyChecks.photo.instrument')"
              :photo="card.photo"
              :slot-key="card.slotKey"
              @uploaded="onPhotoUploaded($event)" />
          </div>
        </div>
      </section>

      <section
        v-if="environmentalCards.length"
        class="flex flex-col gap-3">
        <h3 class="text-[13px] font-semibold text-text-primary">
          {{ t('permit.create.steps.safetyChecks.section.environmental') }}
        </h3>
        <div class="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div
            v-for="card in environmentalCards"
            :key="card.reading"
            :class="card.failing
              ? 'border-primary bg-permit-type-hot-bg'
              : 'border-border bg-surface-card'"
            class="flex flex-col gap-2 rounded-xl border p-3.5">
            <div>
              <p class="text-[11.5px] font-semibold text-text-secondary">
                {{ t(`permit.create.steps.safetyChecks.reading.${card.reading}`) }}
              </p>
              <p class="text-[10px] text-text-tertiary">
                {{ t(card.hint.key, card.hint.params) }}
              </p>
            </div>
            <div class="flex items-baseline gap-1.5">
              <InputNumber
                :invalid="card.failing"
                :max-fraction-digits="2"
                :min-fraction-digits="0"
                :model-value="card.value"
                class="w-24"
                input-class="font-mono font-semibold"
                @update:model-value="setReading(card.reading, $event)" />
              <span class="text-sm font-semibold text-text-secondary">{{ card.unit }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-2.5">
        <h3 class="text-[13px] font-semibold text-text-primary">
          {{ t('permit.create.steps.safetyChecks.section.checklist') }}
        </h3>
        <p class="text-xs text-text-tertiary">
          {{ t('permit.create.steps.safetyChecks.checklistSavedWithDraft') }}
        </p>
        <ul class="flex list-none flex-col overflow-hidden rounded-xl border border-border p-0">
          <li
            v-for="number in checklistRows"
            :key="number"
            class="flex flex-col gap-2 border-b border-surface-muted px-3.5 py-2.5 last:border-b-0 sm:flex-row sm:items-center sm:gap-3">
            <span class="w-5 shrink-0 font-mono text-[11px] text-text-quaternary">{{ number }}</span>
            <span class="flex-1 text-[13px] leading-snug text-text-primary">
              {{ t(`permit.create.steps.safetyChecks.checklist.${permitType}.${number}`) }}
            </span>
            <span class="flex shrink-0 gap-1.5">
              <button
                v-for="answer in CHECKLIST_ANSWERS"
                :key="answer"
                :class="answerOf(number) === answer ? ANSWER_ACTIVE_CLASS[answer] : 'bg-surface-subtle text-text-quaternary'"
                class="rounded-[5px] px-2.5 py-1 text-[11px] font-semibold"
                type="button"
                @click="setChecklistAnswer(number, answer)">
                {{ t(`permit.create.steps.safetyChecks.answer.${answer}`) }}
              </button>
            </span>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IPermitPhoto } from '@/models/modules/permit/Permit.model'
import {
  SAFETY_RANGES, validateReadings, type IReadingFailure, type TSafetyReadingKey
} from '@/utils/PermitSafety'
import PhotoSlot from '../PhotoSlot.vue'
import { CHECKLIST_ANSWERS, checklistKey, checklistNumbers, type TChecklistAnswer } from '../../constants/SafetyChecklist'
import { findPhoto, upsertPhoto } from '../../constants/PhotoEvidence'
import {
  atmosphereReadings, environmentalReadings, instrumentSlotKey, isAtmosphereReading, readingHint,
  supportsOutdoorBypass, type IReadingHint
} from '../../constants/SafetyReadingView'
import { readingFailureMessage } from '../../schema/Step3SafetyChecks.schema'
import type { ISubmitReadingFailure } from '../../constants/SubmitErrorRouting'
import type { IWizardStepEmits, IWizardStepProps } from '../../wizard/WizardSteps'

/**
 * PMT-006 — step 3, Safety Checks.
 *
 * Every bound, unit and required-reading list comes from SAFETY_RANGES / validateReadings()
 * (src/utils/PermitSafety.ts, PMT-001). Nothing numeric is written here or in the locale files —
 * the range hints are locale TEMPLATES with the numbers interpolated at render time. The pass/fail
 * verdict shown here is exactly the one Step3SafetyChecksSchema uses to gate Next, and the backend
 * re-runs it at submit, where its answer wins.
 */
interface IReadingCard {
  reading: TSafetyReadingKey
  unit: string
  hint: IReadingHint
  value: number | null
  failing: boolean
  slotKey: string
  photo?: IPermitPhoto
}

const ANSWER_ACTIVE_CLASS: Record<TChecklistAnswer, string> = {
  yes: 'bg-status-active-fg-emphasis text-white',
  no: 'bg-primary text-white',
  na: 'bg-permit-type-heights-accent text-permit-type-heights-accent-fg'
}

const TYPE_CHIP_CLASS: Record<TPermitType, { bg: string, fg: string }> = {
  hot: { bg: 'bg-permit-type-hot-bg', fg: 'text-permit-type-hot-fg' },
  confined: { bg: 'bg-permit-type-confined-bg', fg: 'text-permit-type-confined-fg' },
  heights: { bg: 'bg-permit-type-heights-bg', fg: 'text-permit-type-heights-fg' }
}

const props = defineProps<IWizardStepProps>()
const emit = defineEmits<IWizardStepEmits>()

const { t } = useI18n()

const permitType: ComputedRef<TPermitType | undefined> = computed(
  (): TPermitType | undefined => props.formData.type
)
const isOutdoor: ComputedRef<boolean> = computed((): boolean => props.formData.outdoorWork ?? false)

const typeChipClass: ComputedRef<{ bg: string, fg: string }> = computed(
  (): { bg: string, fg: string } => TYPE_CHIP_CLASS[permitType.value ?? 'hot']
)

const showOutdoorToggle: ComputedRef<boolean> = computed(
  (): boolean => (permitType.value ? supportsOutdoorBypass(permitType.value) : false)
)

const failures: ComputedRef<IReadingFailure[]> = computed((): IReadingFailure[] => {
  if (!permitType.value) return []
  return validateReadings(permitType.value, props.formData.safetyReading ?? {}, isOutdoor.value)
})

/**
 * Readings the SERVER rejected on the last submit (`failures[]` on the 400 body). Kept separate
 * from the client-side `failures` above because the two can disagree — the wizard's own gate is
 * convenience only, and when the server says a reading failed, it failed, even if
 * `validateReadings()` was happy with the value on screen.
 */
const serverRejectedReadings: ComputedRef<ISubmitReadingFailure[]> = computed(
  (): ISubmitReadingFailure[] => props.submitFailures?.readings ?? []
)

function buildCard (reading: TSafetyReadingKey): IReadingCard {
  const value = props.formData.safetyReading?.[reading]
  const slotKey = instrumentSlotKey(reading)
  return {
    reading,
    unit: SAFETY_RANGES.ranges[reading].unit,
    hint: readingHint(reading),
    value: typeof value === 'number' ? value : null,
    failing: failures.value.some((failure: IReadingFailure): boolean => failure.reading === reading)
      || serverRejectedReadings.value.some((failure: ISubmitReadingFailure): boolean => failure.field === reading),
    slotKey,
    photo: isAtmosphereReading(reading) ? findPhoto(props.formData.photos, slotKey) : undefined
  }
}

/** Hidden entirely while the outdoor bypass is on — those readings are not collected at all. */
const atmosphereCards: ComputedRef<IReadingCard[]> = computed((): IReadingCard[] => {
  if (!permitType.value || isOutdoor.value) return []
  return atmosphereReadings(permitType.value).map(buildCard)
})

const environmentalCards: ComputedRef<IReadingCard[]> = computed((): IReadingCard[] => {
  if (!permitType.value) return []
  return environmentalReadings(permitType.value).map(buildCard)
})

const checklistRows: ComputedRef<string[]> = computed(
  (): string[] => (permitType.value ? checklistNumbers(permitType.value) : [])
)

function setReading (reading: TSafetyReadingKey, value: number | null): void {
  emit('update:formData', {
    safetyReading: { ...(props.formData.safetyReading ?? {}), [reading]: value }
  })
}

function setOutdoor (outdoorWork: boolean): void {
  emit('update:formData', { outdoorWork })
}

function onPhotoUploaded (photo: IPermitPhoto): void {
  emit('update:formData', { photos: upsertPhoto(props.formData.photos, photo) })
}

function answerOf (number: string): TChecklistAnswer | undefined {
  if (!permitType.value) return undefined
  return props.checklistAnswers[checklistKey(permitType.value, number)]
}

function setChecklistAnswer (number: string, answer: TChecklistAnswer): void {
  if (!permitType.value) return
  emit('update:checklistAnswers', { [checklistKey(permitType.value, number)]: answer })
}
</script>

<style scoped>
</style>
