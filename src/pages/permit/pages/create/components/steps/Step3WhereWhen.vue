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

    <!-- 1. Area picker — selecting an area drops the pin below immediately (034 resolution). -->
    <!-- wayfinder 077 — deep-links into the "Getting started" page's #area section, the verbatim
         field-report question ("what is the area for?") answered in one place. -->
    <div class="flex justify-end">
      <RouterLink
        :to="{ name: 'GettingStartedPage', hash: '#area' }"
        class="inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
        <span aria-hidden="true">ⓘ</span> {{ t('permit.create.steps.whereWhen.areaHelpLink') }}
      </RouterLink>
    </div>
    <AreaPicker
      :area-id="formData.areaId"
      @change="onAreaChange($event)" />

    <!-- 2. The pin, on the area's own drawing when it has one, the active site plan otherwise. -->
    <p
      v-if="positionState === 'loading'"
      class="text-sm text-text-tertiary">
      {{ t('permit.create.steps.position.loading') }}
    </p>

    <p
      v-else-if="positionState === 'none' || !activePlan"
      class="rounded-lg border border-border bg-surface-subtle px-4 py-3 text-sm text-text-secondary">
      {{ t('permit.create.steps.position.noActivePlan') }}
    </p>

    <template v-else>
      <p
        v-if="isOlderVersion"
        class="rounded-lg border border-status-pending-border bg-status-pending-bg px-4 py-3 text-[13px] font-medium text-status-pending-fg"
        role="status">
        <span aria-hidden="true">ⓘ</span> {{ t('permit.create.steps.position.olderVersion') }}
      </p>

      <p
        v-if="imageFailed"
        class="rounded-lg border border-status-rejected-border bg-status-rejected-bg px-4 py-3 text-[13px] font-medium text-status-rejected-fg"
        role="alert">
        <span aria-hidden="true">⛔</span> {{ t('permit.create.steps.position.imageLoadFailed') }}
        <button
          class="ms-2 cursor-pointer border-none bg-transparent p-0 text-[13px] font-semibold text-primary underline"
          type="button"
          @click="loadPlanImage()">
          {{ t('permit.create.steps.position.retry') }}
        </button>
      </p>

      <div
        v-else-if="imageUrl"
        ref="frameRef"
        class="relative w-full cursor-crosshair overflow-hidden rounded-xl border border-border select-none"
        @click="onFrameClick($event)">
        <img
          :alt="t('permit.create.steps.position.subtitle')"
          :src="imageUrl"
          class="block w-full"
          draggable="false"
          @error="onImageError()">
        <span
          v-if="pin"
          :style="{ left: `${pin.left}px`, top: `${pin.top}px` }"
          aria-hidden="true"
          class="absolute -translate-x-1/2 -translate-y-full text-2xl text-primary drop-shadow">
          📍
        </span>
      </div>

      <p class="text-[13px] font-medium text-text-secondary">
        {{ formData.position ? t('permit.create.steps.position.pinSet') : t('permit.create.steps.position.instruction') }}
      </p>

      <p
        v-if="positionState === 'fail'"
        class="rounded-lg border border-status-rejected-border bg-status-rejected-bg px-4 py-3 text-[13px] font-semibold text-status-rejected-fg-emphasis"
        role="alert">
        <span aria-hidden="true">⛔</span> {{ t('permit.create.steps.position.required') }}
      </p>
    </template>

    <!-- 3. Geo coordinate — a stored coordinate, not a live map (ruling 5). -->
    <Form
      v-slot="$form"
      :initial-values="geoInitialValues"
      :resolver="geoResolver"
      class="flex flex-col gap-1.5">
      <LabelField
        v-model="mapUrlModel"
        :description="t('permit.create.steps.whereWhen.geo.hint')"
        :form="$form"
        :label="t('permit.create.steps.whereWhen.geo.label')"
        :placeholder="t('permit.create.steps.whereWhen.geo.placeholder')"
        name="mapUrl" />
      <p
        v-if="parsedCoordinate"
        class="text-[12px] text-text-tertiary">
        {{ t('permit.create.steps.whereWhen.geo.parsed', parsedCoordinate) }}
      </p>
    </Form>

    <!-- 4. Dates — a daily window repeating across a date range (wayfinder 067). -->
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

    <!-- 5. Schedule / location note — free text for what the dates above cannot express. -->
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
  computed, ref, watch, type ComputedRef, type Ref, type WritableComputedRef
} from 'vue'
import { useI18n } from 'vue-i18n'
import { Form } from '@primevue/forms'
import { zodResolver } from '@primevue/forms/resolvers/zod'
import { dayjs } from '@/plugins/dayjs.plugin'
import { useApiError } from '@/composables/useApiError'
import type { IFacilityPlan } from '@/models/modules/facility-plan/FacilityPlan.model'
import type { IPermitPosition } from '@/models/modules/permit/Permit.model'
import { parseMapCoordinate, type TParseMapCoordinateResult } from '@/utils/ParseMapCoordinate'
import { percentToPoint, pointToPercent } from '@/utils/PlanPosition'
import FacilityPlanProvider, { type IFacilityPlanProvider } from '@/resources/provider/facility-plan/FacilityPlan.provider'
import UploadProvider, { type IUploadProvider } from '@/resources/provider/Upload.provider'
import LabelField from '@/components/input/LabelField.vue'
import { Step3WhereWhenFieldsSchema } from '../../schema/Step3WhereWhen.schema'
import AreaPicker from '../AreaPicker.vue'
import type { IWizardStepEmits, IWizardStepProps } from '../../wizard/WizardSteps'

/**
 * wayfinder 070 — step 3, "Where & when". Replaces the old step-7 `Step7Position` (the pin,
 * bolted on after Review) AND step 2's date/time fields, in ONE step whose order makes the
 * relationship between area and pin visible: picking an area drops the pin immediately, right
 * below it, on the same screen — see `onAreaChange`.
 *
 * This step ALWAYS renders (`useWizard.steps` no longer filters it), unlike the old
 * `Step7Position`: area, geo, dates and note are useful with no facility plan at all — only the
 * pin surface (image + click target) swaps for the "no plan active" line when
 * `positionState === 'none'`. Ticket 045's invariant (`areaIdIsUserChoice` in `useWizard`) is
 * unchanged by this — it must survive regardless of which steps mount, not only the one case
 * that used to hide `AreaPicker`.
 */
const props = defineProps<IWizardStepProps>()
const emit = defineEmits<IWizardStepEmits>()

const { t } = useI18n()
const { mapError } = useApiError()
const FacilityPlanService: IFacilityPlanProvider = new FacilityPlanProvider()
const UploadService: IUploadProvider = new UploadProvider()

// ---- Pin (copied from the retired Step7Position.vue, unchanged logic) --------------------

const frameRef: Ref<HTMLDivElement | undefined> = ref(undefined)
const imageUrl: Ref<string | undefined> = ref(undefined)
const imageFailed: Ref<boolean> = ref(false)
const renderedPlan: Ref<IFacilityPlan | undefined> = ref(undefined)

const isOlderVersion: ComputedRef<boolean> = computed(
  (): boolean => Boolean(renderedPlan.value && props.activePlan && renderedPlan.value.id !== props.activePlan.id)
)

const pin: ComputedRef<{ left: number, top: number } | undefined> = computed(
  (): { left: number, top: number } | undefined => {
    const position = props.formData.position
    if (!position || !frameRef.value) return undefined
    return percentToPoint({ x: position.planX, y: position.planY }, frameRef.value.getBoundingClientRect())
  }
)

/**
 * wayfinder 069. The permit's pin resolves against the area's OWN drawing when it has one (an
 * area drawing is a plan version like any other, `FacilityPlan.areaId`), the active site plan
 * otherwise. `props.formData.position.planId` already names which version the pin was placed
 * on — a stale pin still plots against ITS version, with the "older version" note above, never
 * silently re-projected onto whichever plan happens to be current now.
 */
async function loadPlanImage (): Promise<void> {
  imageFailed.value = false
  imageUrl.value = undefined
  if (!props.activePlan) return

  const existingPlanId = props.formData.position?.planId
  try {
    const plan = existingPlanId && existingPlanId !== props.activePlan.id
      ? (await FacilityPlanService.getById(existingPlanId)).data
      : props.activePlan
    renderedPlan.value = plan

    const { data } = await UploadService.getFileUrl(plan.fileRef)
    imageUrl.value = data.url
  } catch (error: unknown) {
    console.error('[Step3WhereWhen] plan resolution failed', mapError(error).code)
    imageFailed.value = true
  }
}

function onImageError (): void {
  imageFailed.value = true
}

/**
 * wayfinder 037/070. `AreaPicker` owns its own fetch/propose/stale-reference state; this step
 * only translates its verdict into a `formData` patch. `position` rides along in the SAME patch
 * as `areaId` when the picked area carries a default one (034 resolution: "an area drops the
 * pin"), so the two writes can never land as separate `updateFormData` calls that race — the
 * second write would otherwise silently win over the first.
 */
function onAreaChange (payload: { areaId: number | null | undefined, position?: IPermitPosition }): void {
  emit('update:formData', payload.position !== undefined
    ? { areaId: payload.areaId, position: payload.position }
    : { areaId: payload.areaId })
}

function onFrameClick (event: MouseEvent): void {
  if (!frameRef.value || !renderedPlan.value) return
  const rect = frameRef.value.getBoundingClientRect()
  const { x, y } = pointToPercent(event.clientX, event.clientY, rect)
  const position: IPermitPosition = { planId: renderedPlan.value.id, planX: x, planY: y }
  emit('update:formData', { position })
}

watch((): IFacilityPlan | null => props.activePlan, (): void => {
  if (props.activePlan) void loadPlanImage()
}, { immediate: true })

// ---- Geo coordinate (wayfinder 068) -------------------------------------------------------

interface IGeoFormValues {
  mapUrl: string
}

/**
 * `mapUrl` is a plain formData field (see PermitReq.model.ts) — the raw text the user pasted or
 * typed. The client parses it ONLY for instant feedback (`parsedCoordinate` below); the server's
 * own re-parse of the SAME string is what is actually authoritative (068 resolution), so this
 * never sends a separately-computed `latitude`/`longitude` pair for text the user is still
 * editing. Clearing the field sends an explicit `{ latitude: null, longitude: null }` — `mapUrl`
 * itself cannot represent "clear" (the wire requires `minLength: 1`).
 */
const geoResolver = zodResolver(Step3WhereWhenFieldsSchema.pick({ mapUrl: true }))
const geoInitialValues: ComputedRef<IGeoFormValues> = computed((): IGeoFormValues => ({
  mapUrl: props.formData.mapUrl ?? ''
}))

const mapUrlModel: WritableComputedRef<string> = computed<string>({
  get: (): string => props.formData.mapUrl ?? '',
  set: (value: string): void => {
    if (value.trim().length === 0) {
      emit('update:formData', { mapUrl: undefined, latitude: null, longitude: null })
      return
    }
    emit('update:formData', { mapUrl: value })
  }
})

const parsedCoordinate: ComputedRef<{ latitude: number, longitude: number } | undefined> = computed(
  (): { latitude: number, longitude: number } | undefined => {
    const raw = props.formData.mapUrl
    if (!raw) return undefined
    const result: TParseMapCoordinateResult = parseMapCoordinate(raw)
    return result.ok ? { latitude: result.latitude, longitude: result.longitude } : undefined
  }
)

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
