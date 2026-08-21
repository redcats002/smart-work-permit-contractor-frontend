<template>
  <div class="flex flex-col gap-5">
    <h2 class="text-lg font-bold text-text-primary">
      {{ title }}
    </h2>

    <Form
      v-slot="$form"
      :initial-values="textInitialValues"
      :resolver="textResolver"
      class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <LabelField
        v-model="titleModel"
        :form="$form"
        :label="t('permit.create.steps.basicInfo.field.title')"
        name="title"
        required />

      <LabelField
        :label="t('permit.create.steps.basicInfo.field.contractor')"
        tag="div"
        hide-error>
        <div class="flex h-9 items-center rounded-md border border-border-input bg-surface-muted px-3 text-sm text-text-secondary">
          {{ contractorName }}
        </div>
      </LabelField>

      <LabelField
        v-model="foremanModel"
        :form="$form"
        :label="t('permit.create.steps.basicInfo.field.foreman')"
        name="foreman"
        required />

      <LabelField
        :label="t('permit.create.steps.basicInfo.field.workDate')"
        tag="div"
        required>
        <DatePicker
          v-model="workDateModel"
          date-format="yy-mm-dd"
          fluid
          show-icon />
      </LabelField>

      <LabelField
        :label="t('permit.create.steps.basicInfo.field.workTimeStart')"
        tag="div"
        required>
        <DatePicker
          v-model="startTimeModel"
          hour-format="24"
          fluid
          show-icon
          time-only />
      </LabelField>

      <LabelField
        :description="endBeforeStart ? t('permit.create.steps.basicInfo.validation.endAfterStart') : ''"
        :label="t('permit.create.steps.basicInfo.field.workTimeEnd')"
        tag="div"
        required>
        <DatePicker
          v-model="endTimeModel"
          :invalid="endBeforeStart"
          hour-format="24"
          fluid
          show-icon
          time-only />
      </LabelField>

      <LabelField
        v-model="locationModel"
        :form="$form"
        :label="t('permit.create.steps.basicInfo.field.location')"
        class="md:col-span-2"
        name="location"
        required />
    </Form>

    <div class="flex flex-col gap-2">
      <span class="text-xs font-semibold text-text-tertiary">
        {{ t('permit.create.steps.basicInfo.map.title') }}
      </span>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="zone in LOCATION_ZONES"
          :key="zone.key"
          :class="zone.key === activeZoneKey
            ? 'border-accent bg-accent-50 text-accent-emphasis-alt'
            : 'border-border-input bg-surface-card text-text-secondary'"
          class="rounded-md border px-3 py-1.5 text-[12.5px] font-semibold"
          type="button"
          @click="selectZone(zone)">
          {{ t(zone.labelKey) }}
        </button>
      </div>

      <!--
        Placeholder facility-plan background — the same treatment the Safety Officer's risk map
        uses, for the same reason: there is no floor-plan asset in either repo and SFO-007's
        acceptance forbids sourcing or fabricating one (../PROMPT-LOG.md, session 2). The pin's
        position comes from the shared zone vocabulary in ../../constants/LocationZones.ts, so a
        permit sits at the same spot in both apps.
      -->
      <div
        class="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-lg border-2 border-dashed border-border bg-surface-muted"
        data-test="location-plan">
        <p class="pointer-events-none absolute inset-x-0 top-2 px-2 text-center text-[11px] text-text-tertiary">
          {{ t('permit.create.steps.basicInfo.map.placeholderNote') }}
        </p>

        <p
          v-if="!pinPosition"
          class="absolute inset-0 flex items-center justify-center px-4 text-center text-[12.5px] text-text-secondary">
          {{ t('permit.create.steps.basicInfo.map.empty') }}
        </p>

        <span
          v-else
          :style="{ left: `${pinPosition.x}%`, top: `${pinPosition.y}%` }"
          :title="locationModel"
          class="absolute flex size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center
            rounded-full border-2 border-surface-card bg-accent text-base shadow-md"
          data-test="location-pin">
          <span aria-hidden="true">📍</span>
        </span>
      </div>

      <p
        v-if="locationModel"
        class="text-[11.5px] text-text-tertiary">
        {{ activeZoneKey
          ? t('permit.create.steps.basicInfo.map.matchedZone')
          : t('permit.create.steps.basicInfo.map.customLocation') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef, type WritableComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { dayjs } from '@/plugins/dayjs.plugin'
import { useAuthStore } from '@/stores/Auth'
import LabelField from '@/components/input/LabelField.vue'
import {
  LOCATION_ZONES, findKnownZoneKey, mapLocationToPosition, type ILocationZone, type IMapPosition
} from '../../constants/LocationZones'
import { Step2BasicInfoFieldsSchema } from '../../schema/Step2BasicInfo.schema'
import type { IWizardStepEmits, IWizardStepProps } from '../../wizard/WizardSteps'

interface ITimeOfDay {
  hours: number
  minutes: number
}

interface ITextFormValues {
  title: string
  foreman: string
  location: string
}

const props = defineProps<IWizardStepProps>()
const emit = defineEmits<IWizardStepEmits>()

const { t } = useI18n()
const authStore = useAuthStore()

const contractorName: ComputedRef<string> = computed((): string => authStore.user.name || authStore.user.email)

/**
 * Only the free-text fields go through @primevue/forms + zodResolver (the project's mandatory
 * form pattern) — the date/time pickers below are handled separately because their `Date`
 * v-model can't share a schema shape with the wire-string fields useWizard persists (see
 * Step2BasicInfo.schema.ts's header comment). The `Step1Type`/`Step2BasicInfo` schemas remain
 * the single source of truth for whether Next actually unlocks.
 */
const textResolver = zodResolver(Step2BasicInfoFieldsSchema.pick({ title: true, foreman: true, location: true }))
const textInitialValues: ComputedRef<ITextFormValues> = computed((): ITextFormValues => ({
  title: props.formData.title ?? '',
  foreman: props.formData.foreman ?? '',
  location: props.formData.location ?? ''
}))

const titleModel: WritableComputedRef<string> = computed<string>({
  get: (): string => props.formData.title ?? '',
  set: (value: string): void => emit('update:formData', { title: value })
})
const foremanModel: WritableComputedRef<string> = computed<string>({
  get: (): string => props.formData.foreman ?? '',
  set: (value: string): void => emit('update:formData', { foreman: value })
})
const locationModel: WritableComputedRef<string> = computed<string>({
  get: (): string => props.formData.location ?? '',
  set: (value: string): void => emit('update:formData', { location: value })
})

/**
 * The zone chips write the existing free-text `location` field — there is no geo field on the
 * wire and this adds none. Typing a location by hand stays fully supported: anything outside the
 * vocabulary simply falls back to the deterministic hash, exactly as the Safety risk map does.
 */
const activeZoneKey: ComputedRef<string | undefined> = computed(
  (): string | undefined => (locationModel.value ? findKnownZoneKey(locationModel.value) : undefined)
)

const pinPosition: ComputedRef<IMapPosition | undefined> = computed(
  (): IMapPosition | undefined => (locationModel.value.trim() ? mapLocationToPosition(locationModel.value) : undefined)
)

function selectZone (zone: ILocationZone): void {
  locationModel.value = zone.value
}

function extractTimeOfDay (iso?: string): ITimeOfDay | undefined {
  if (!iso) return undefined
  const parsed = new Date(iso)
  return Number.isNaN(parsed.getTime()) ? undefined : { hours: parsed.getHours(), minutes: parsed.getMinutes() }
}

/** Composes a full ISO datetime from a calendar date + a time-of-day — trap 1 in the brief. */
function composeDateTime (date: Date | undefined, time: ITimeOfDay | undefined): string {
  if (!date || !time) return ''
  const combined = new Date(date)
  combined.setHours(time.hours, time.minutes, 0, 0)
  return combined.toISOString()
}

const workDateModel: WritableComputedRef<Date | undefined> = computed<Date | undefined>({
  get: (): Date | undefined => (props.formData.workDate ? new Date(props.formData.workDate) : undefined),
  set: (value: Date | undefined): void => {
    emit('update:formData', {
      workDate: value ? dayjs(value).format('YYYY-MM-DD') : '',
      workTimeStart: composeDateTime(value, extractTimeOfDay(props.formData.workTimeStart)),
      workTimeEnd: composeDateTime(value, extractTimeOfDay(props.formData.workTimeEnd))
    })
  }
})

const startTimeModel: WritableComputedRef<Date | undefined> = computed<Date | undefined>({
  get: (): Date | undefined => (props.formData.workTimeStart ? new Date(props.formData.workTimeStart) : undefined),
  set: (value: Date | undefined): void => {
    const workDate = props.formData.workDate ? new Date(props.formData.workDate) : undefined
    const timeOfDay = value ? { hours: value.getHours(), minutes: value.getMinutes() } : undefined
    emit('update:formData', { workTimeStart: composeDateTime(workDate, timeOfDay) })
  }
})

const endTimeModel: WritableComputedRef<Date | undefined> = computed<Date | undefined>({
  get: (): Date | undefined => (props.formData.workTimeEnd ? new Date(props.formData.workTimeEnd) : undefined),
  set: (value: Date | undefined): void => {
    const workDate = props.formData.workDate ? new Date(props.formData.workDate) : undefined
    const timeOfDay = value ? { hours: value.getHours(), minutes: value.getMinutes() } : undefined
    emit('update:formData', { workTimeEnd: composeDateTime(workDate, timeOfDay) })
  }
})

/** UX-only warning (trap 2) — the real block comes from Step2BasicInfoSchema's `.refine`. */
const endBeforeStart: ComputedRef<boolean> = computed((): boolean => {
  const start = props.formData.workTimeStart
  const end = props.formData.workTimeEnd
  if (!start || !end) return false
  return new Date(end).getTime() <= new Date(start).getTime()
})
</script>

<style scoped>
</style>
