<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-col gap-1">
      <h2 class="text-lg font-bold text-text-primary">
        {{ title }}
      </h2>
      <p class="text-sm text-text-secondary">
        {{ t('permit.create.steps.whereWhen.subtitle') }}
      </p>
    </div>

    <!-- 1. The pin — safety places it, the contractor only ever selects one (wayfinder 107). -->
    <PinPicker
      :pin-id="formData.pinId"
      @change="onPinChange($event)" />
    <p
      v-if="positionState === 'fail'"
      class="rounded-lg border border-status-rejected-border bg-status-rejected-bg px-4 py-3 text-[13px] font-semibold text-status-rejected-fg-emphasis"
      role="alert">
      <span aria-hidden="true">⛔</span> {{ t('permit.create.steps.whereWhen.pin.required') }}
    </p>

    <!-- 2. Location detail — Permit.location under a new label, moved verbatim from step 2. -->
    <Form
      v-slot="$form"
      :initial-values="locationInitialValues"
      :resolver="locationResolver"
      class="flex flex-col gap-1.5">
      <LabelField
        v-model="locationModel"
        :form="$form"
        :label="t('permit.create.steps.whereWhen.field.locationDetail')"
        name="location"
        required />
    </Form>

    <!-- 3. Dates — a daily window repeating across a date range (wayfinder 067). -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <LabelField
        :label="t('permit.create.steps.whereWhen.field.startDate')"
        tag="div"
        required>
        <DatePicker
          v-model="startDateModel"
          date-format="yy-mm-dd"
          fluid
          show-icon />
      </LabelField>

      <LabelField
        :label="t('permit.create.steps.whereWhen.field.endDate')"
        tag="div"
        required>
        <DatePicker
          v-model="endDateModel"
          :invalid="endDateBeforeStart"
          date-format="yy-mm-dd"
          fluid
          show-icon />
      </LabelField>

      <LabelField
        :label="t('permit.create.steps.whereWhen.field.dailyStart')"
        tag="div"
        required>
        <DatePicker
          v-model="dailyStartModel"
          hour-format="24"
          fluid
          show-icon
          time-only />
      </LabelField>

      <LabelField
        :description="dailyEndBeforeStart ? t('permit.create.steps.whereWhen.validation.endAfterStart') : ''"
        :label="t('permit.create.steps.whereWhen.field.dailyEnd')"
        tag="div"
        required>
        <DatePicker
          v-model="dailyEndModel"
          :invalid="dailyEndBeforeStart"
          hour-format="24"
          fluid
          show-icon
          time-only />
      </LabelField>
    </div>

    <p
      v-if="endDateBeforeStart"
      class="text-[12px] text-status-rejected-fg">
      {{ t('permit.create.steps.whereWhen.validation.endDateNotBeforeStart') }}
    </p>

    <!-- 4. Schedule note — free text for what the dates above cannot express. -->
    <LabelField
      :label="t('permit.create.steps.whereWhen.field.scheduleNote')"
      tag="div">
      <Textarea
        v-model="scheduleNoteModel"
        :placeholder="t('permit.create.steps.whereWhen.scheduleNote.placeholder')"
        rows="3"
        fluid />
    </LabelField>
  </div>
</template>

<script setup lang="ts">
import {
  computed, type ComputedRef, type WritableComputedRef
} from 'vue'
import { useI18n } from 'vue-i18n'
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { dayjs } from '@/plugins/dayjs.plugin'
import LabelField from '@/components/input/LabelField.vue'
import { Step3WhereWhenFieldsSchema } from '../../schema/Step3WhereWhen.schema'
import PinPicker from '../PinPicker.vue'
import type { IWizardStepEmits, IWizardStepProps } from '../../wizard/WizardSteps'

/**
 * wayfinder 070/107/121 — step 3, "Where & when". Pin (safety-placed position) + location detail
 * + the multi-day work window + a schedule note, in one step.
 *
 * wayfinder 107 reverses two pieces of 070: the contractor no longer places or nudges a pin on a
 * raster (see `PinPicker.vue` — read-only marker, no click handler), and there is no geo
 * coordinate field any more (068, reversed by the api's own 105). The "location detail" field is
 * `Permit.location` moved verbatim from Step 2 under a new label — same formData key, same wire
 * field, not a second free-text column that means the same thing.
 *
 * wayfinder 121 removes the area picker this step carried alongside the pin (037/070/107):
 * `AreaPicker.vue`/`CreateAreaModal.vue` and `areaId` are gone from this app entirely, the api
 * already having dropped `Area`/`Permit.areaId` in 106. `pinId` never depended on `areaId` — 107
 * already made them fully independent fields — so nothing here replaces the removed picker.
 *
 * This step ALWAYS renders (`useWizard.steps` no longer filters it) — the pin picker, the
 * location detail, dates and note are useful with no active plan/pin at all; `PinPicker` renders
 * its own "no plans yet" line when there is nothing to pick from. Ticket 045's invariant, inherited
 * by `pinId` (`pinIdIsUserChoice` in `useWizard`), is unchanged by this: it must survive regardless
 * of which steps mount.
 */
const props = defineProps<IWizardStepProps>()
const emit = defineEmits<IWizardStepEmits>()

const { t } = useI18n()

function onPinChange (payload: { pinId: number | null | undefined }): void {
  emit('update:formData', { pinId: payload.pinId })
}

// ---- Location detail (wayfinder 107 — moved verbatim from Step2BasicInfo) ------------------

interface ILocationFormValues {
  location: string
}

const locationResolver = zodResolver(Step3WhereWhenFieldsSchema.pick({ location: true }))
const locationInitialValues: ComputedRef<ILocationFormValues> = computed((): ILocationFormValues => ({
  location: props.formData.location ?? ''
}))

const locationModel: WritableComputedRef<string> = computed<string>({
  get: (): string => props.formData.location ?? '',
  set: (value: string): void => emit('update:formData', { location: value })
})

// ---- Dates (wayfinder 067) ------------------------------------------------------------------

interface ITimeOfDay {
  hours: number
  minutes: number
}

/**
 * ⚠ THE 067 UTC TRAP. `dailyStart`/`dailyEnd` are `1970-01-01`-anchored on the wire — only the
 * UTC clock time is meaningful. `extractTimeOfDay`/`composeDateTime` are copied VERBATIM from the
 * old Step2BasicInfo's `workTimeStart`/`workTimeEnd` handling: `Date#getHours`/`Date#setHours`
 * (browser-LOCAL), never `getUTCHours`/`setUTCHours`. The migration backfill preserved every
 * existing permit's instant only because the OLD code read/wrote through this same local-time
 * conversion — switching to UTC methods here would shift every migrated permit by the
 * deployment's UTC offset, silently, with nothing failing (see `IPermitBase`'s doc comment).
 */
function extractTimeOfDay (iso?: string): ITimeOfDay | undefined {
  if (!iso) return undefined
  const parsed = new Date(iso)
  return Number.isNaN(parsed.getTime()) ? undefined : { hours: parsed.getHours(), minutes: parsed.getMinutes() }
}

function composeDateTime (date: Date | undefined, time: ITimeOfDay | undefined): string {
  if (!date || !time) return ''
  const combined = new Date(date)
  combined.setHours(time.hours, time.minutes, 0, 0)
  return combined.toISOString()
}

const startDateModel: WritableComputedRef<Date | undefined> = computed<Date | undefined>({
  get: (): Date | undefined => (props.formData.startDate ? new Date(props.formData.startDate) : undefined),
  set: (value: Date | undefined): void => {
    emit('update:formData', { startDate: value ? dayjs(value).format('YYYY-MM-DD') : '' })
  }
})

const endDateModel: WritableComputedRef<Date | undefined> = computed<Date | undefined>({
  get: (): Date | undefined => (props.formData.endDate ? new Date(props.formData.endDate) : undefined),
  set: (value: Date | undefined): void => {
    emit('update:formData', { endDate: value ? dayjs(value).format('YYYY-MM-DD') : '' })
  }
})

/**
 * The daily window has no meaningful date part on the wire (see the UTC-trap note above), so any
 * fixed date works as the carrier here — `1970-01-01` matches what the server anchors on read,
 * which keeps a freshly-set value visually consistent with a hydrated one instead of a
 * coincidence.
 */
const DAILY_TIME_CARRIER = new Date(1970, 0, 1)

const dailyStartModel: WritableComputedRef<Date | undefined> = computed<Date | undefined>({
  get: (): Date | undefined => (props.formData.dailyStart ? new Date(props.formData.dailyStart) : undefined),
  set: (value: Date | undefined): void => {
    const timeOfDay = value ? { hours: value.getHours(), minutes: value.getMinutes() } : undefined
    emit('update:formData', { dailyStart: composeDateTime(DAILY_TIME_CARRIER, timeOfDay) })
  }
})

const dailyEndModel: WritableComputedRef<Date | undefined> = computed<Date | undefined>({
  get: (): Date | undefined => (props.formData.dailyEnd ? new Date(props.formData.dailyEnd) : undefined),
  set: (value: Date | undefined): void => {
    const timeOfDay = value ? { hours: value.getHours(), minutes: value.getMinutes() } : undefined
    emit('update:formData', { dailyEnd: composeDateTime(DAILY_TIME_CARRIER, timeOfDay) })
  }
})

/** UX-only warnings — the real blocks come from Step3WhereWhenSchema's `.refine`s. */
const endDateBeforeStart: ComputedRef<boolean> = computed((): boolean => {
  const start = props.formData.startDate
  const end = props.formData.endDate
  if (!start || !end) return false
  return new Date(end).getTime() < new Date(start).getTime()
})

const dailyEndBeforeStart: ComputedRef<boolean> = computed((): boolean => {
  const start = extractTimeOfDay(props.formData.dailyStart)
  const end = extractTimeOfDay(props.formData.dailyEnd)
  if (!start || !end) return false
  return (end.hours * 60) + end.minutes <= (start.hours * 60) + start.minutes
})

// ---- Schedule note --------------------------------------------------------------------------

const scheduleNoteModel: WritableComputedRef<string> = computed<string>({
  get: (): string => props.formData.scheduleNote ?? '',
  set: (value: string): void => emit('update:formData', { scheduleNote: value || undefined })
})
</script>

<style scoped>
</style>
