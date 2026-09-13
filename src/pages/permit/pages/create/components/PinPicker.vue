<template>
  <div class="flex flex-col gap-2.5">
    <label class="text-[13px] font-semibold text-text-primary">
      {{ t('permit.create.steps.whereWhen.pin.planLabel') }}
    </label>
    <Select
      :loading="loadingPlans"
      :model-value="selectedPlanId"
      :option-label="'name'"
      :option-value="'id'"
      :options="plans"
      :placeholder="t('permit.create.steps.whereWhen.pin.planPlaceholder')"
      class="h-10.5 w-full"
      show-clear
      @update:model-value="onPlanChange($event)" />

    <p
      v-if="!loadingPlans && plans.length === 0"
      class="text-[12.5px] text-text-tertiary">
      {{ t('permit.create.steps.whereWhen.pin.noPlans') }}
    </p>

    <template v-if="selectedPlanId !== undefined">
      <label class="text-[13px] font-semibold text-text-primary">
        {{ t('permit.create.steps.whereWhen.pin.pinLabel') }}
      </label>
      <Select
        :loading="loadingPins"
        :model-value="selectedPinId"
        :option-label="'name'"
        :option-value="'id'"
        :options="pins"
        :placeholder="t('permit.create.steps.whereWhen.pin.pinPlaceholder')"
        class="h-10.5 w-full"
        show-clear
        @update:model-value="onPinChange($event)" />

      <p
        v-if="!loadingPins && pins.length === 0"
        class="text-[12.5px] text-text-tertiary">
        {{ t('permit.create.steps.whereWhen.pin.noPins') }}
      </p>
    </template>

    <!--
      wayfinder ticket 107, ruling 8. A deactivated pin (or one on a deactivated plan) still
      resolves and displays — it is simply absent from the active `pins` Select above. Deliberately
      NOT phrased as a problem: a retired pin is a legitimate historical record, not an error.
    -->
    <div
      v-if="pinIsRetired"
      class="flex flex-col gap-1 rounded-lg border border-border bg-surface-muted px-3.5 py-2.5"
      data-testid="pin-current-retired"
      role="status">
      <span class="text-[11px] font-semibold tracking-wide text-text-secondary uppercase">
        {{ t('permit.create.steps.whereWhen.pin.retiredLabel') }}
      </span>
      <span class="text-[13px] font-semibold text-text-primary">{{ referencedPin?.name }}</span>
      <span class="text-[12px] text-text-secondary">
        {{ t('permit.create.steps.whereWhen.pin.retiredNote') }}
      </span>
    </div>
    <p
      v-else-if="pinResolveFailed"
      class="rounded-lg border border-status-pending-border bg-status-pending-bg px-3.5 py-2.5 text-[12.5px] font-medium text-status-pending-fg"
      role="status">
      <span aria-hidden="true">ⓘ</span>
      {{ t('permit.create.steps.whereWhen.pin.missingNote') }}
    </p>

    <p
      v-if="imageFailed"
      class="rounded-lg border border-status-rejected-border bg-status-rejected-bg px-4 py-3 text-[13px] font-medium text-status-rejected-fg"
      role="alert">
      <span aria-hidden="true">⛔</span> {{ t('permit.create.steps.whereWhen.pin.imageLoadFailed') }}
      <button
        class="ms-2 cursor-pointer border-none bg-transparent p-0 text-[13px] font-semibold text-primary underline"
        type="button"
        @click="retryImage()">
        {{ t('permit.create.steps.whereWhen.pin.retry') }}
      </button>
    </p>

    <!-- Read-only marker only — no click handler, no cursor-crosshair, no placing, no nudging. -->
    <div
      v-else-if="imageUrl"
      ref="frameRef"
      class="relative w-full max-h-[60vh] overflow-y-auto overflow-x-hidden rounded-xl border border-border select-none">
      <img
        :alt="t('permit.create.steps.whereWhen.pin.alt')"
        :src="imageUrl"
        class="block w-full"
        draggable="false"
        @error="onImageError()"
        @load="onImageLoad()">
      <span
        v-if="markerPoint"
        :style="{ left: `${markerPoint.left}px`, top: `${markerPoint.top}px` }"
        aria-hidden="true"
        class="absolute -translate-x-1/2 -translate-y-full text-2xl text-primary drop-shadow">
        📍
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed, onMounted, ref, type ComputedRef, type Ref
} from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiError } from '@/composables/useApiError'
import type { IFacilityPlan } from '@/models/modules/facility-plan/FacilityPlan.model'
import type { IPin } from '@/models/modules/pin/Pin.model'
import { percentToPoint } from '@/utils/PlanPosition'
import FacilityPlanProvider, { type IFacilityPlanProvider } from '@/resources/provider/facility-plan/FacilityPlan.provider'
import PinProvider, { type IPinProvider } from '@/resources/provider/pin/Pin.provider'
import UploadProvider, { type IUploadProvider } from '@/resources/provider/Upload.provider'
import Select from '@/volt/Select.vue'

/**
 * wayfinder ticket 107 — the permit wizard's pin picker: safety places pins, the contractor only
 * ever selects one. Lives inside `Step3WhereWhen.vue`, modeled closely on `AreaPicker.vue`'s
 * self-contained-fetch/own-local-state/emit-a-`change`-payload shape — same `null` vs `undefined`
 * emit convention, same `limit: 9999` reasoning, same `data-testid`-style read-only display.
 *
 * A plan choice here is UI-narrowing only — it is never sent to the wire. `selectedPlanId` exists
 * purely so the pin `Select` below has something to filter on and so the right plan image loads.
 *
 * `pinId` inherits ticket 045's invariant (see `useWizard.pinIdIsUserChoice`) — this component
 * only ever speaks through `change`, it never writes `formData` directly.
 */
interface IProps {
  /** `formData.pinId` as it stands right now — may reference a pin that is no longer active. */
  pinId: number | null | undefined
}

interface IPinChangePayload {
  /**
   * `null` is a deliberate clear (the user picked "no pin" — sent to the server so it actually
   * unsets the stored value). `undefined` OMITS the key from the outgoing PATCH instead — the
   * server leaves whatever is already stored untouched — used only when this component silently
   * drops a stale reference it never asked the user about (mirrors `AreaPicker.resolveStaleArea`).
   */
  pinId: number | null | undefined
}

interface IEmits {
  change: [payload: IPinChangePayload]
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

const { t } = useI18n()
const { mapError } = useApiError()
const FacilityPlanService: IFacilityPlanProvider = new FacilityPlanProvider()
const PinService: IPinProvider = new PinProvider()
const UploadService: IUploadProvider = new UploadProvider()

const plans: Ref<IFacilityPlan[]> = ref([])
const loadingPlans: Ref<boolean> = ref(false)
/** Local-only — never part of the outgoing patch. Drives which plan's pins/image are shown. */
const selectedPlanId: Ref<number | undefined> = ref(undefined)

const pins: Ref<IPin[]> = ref([])
const loadingPins: Ref<boolean> = ref(false)

/**
 * The permit's existing `pinId`, resolved via `getById` regardless of active status. Populated
 * once at mount and left alone afterwards — it answers "what does this permit currently
 * reference", independent of whatever plan the contractor is browsing in the Select above.
 */
const referencedPin: Ref<IPin | undefined> = ref(undefined)
const pinResolveFailed: Ref<boolean> = ref(false)

const frameRef: Ref<HTMLDivElement | undefined> = ref(undefined)
const imageUrl: Ref<string | undefined> = ref(undefined)
const imageFailed: Ref<boolean> = ref(false)

/**
 * `frameRef.getBoundingClientRect()` is not itself a reactive dependency — reading it inside a
 * computed does not make that computed re-run when the image finishes loading and the frame
 * actually takes on its rendered size. Without this, the marker below is computed against the
 * ~0x0 rect that exists the instant the frame `<div>` mounts (before the `<img>` has painted) and
 * then never updates, permanently pinning it to the top-left corner. Captured explicitly on the
 * image's `load` event instead, so `markerPoint` has a real reactive dependency to key off.
 */
const frameRect: Ref<{ width: number, height: number } | undefined> = ref(undefined)

/**
 * Bound to the pin Select ONLY while `props.pinId` names a pin actually present in the currently
 * fetched active list — ruling 8's requirement: a deactivated pin (or one on a deactivated plan)
 * is absent from this list, and is shown instead via `pinIsRetired`'s read-only panel below.
 */
const selectedPinId: ComputedRef<number | undefined> = computed(
  (): number | undefined => (
    props.pinId != null && pins.value.some((pin: IPin): boolean => pin.id === props.pinId)
      ? props.pinId
      : undefined
  )
)

/** True once `referencedPin` resolved but is not (or is no longer) in the active pins list. */
const pinIsRetired: ComputedRef<boolean> = computed(
  (): boolean => referencedPin.value !== undefined && !pins.value.some((pin: IPin): boolean => pin.id === referencedPin.value?.id)
)

/** The pin actually referenced by `props.pinId`, whichever list it came from — for the marker. */
const displayedPin: ComputedRef<IPin | undefined> = computed(
  (): IPin | undefined => referencedPin.value ?? pins.value.find((pin: IPin): boolean => pin.id === props.pinId)
)

const markerPoint: ComputedRef<{ left: number, top: number } | undefined> = computed(
  (): { left: number, top: number } | undefined => {
    const pin = displayedPin.value
    const rect = frameRect.value
    // Only draw the marker over the image it actually belongs to — a pin on a different plan than
    // the one currently loaded would otherwise render on top of the wrong picture.
    if (!pin || pin.planId !== selectedPlanId.value || !rect) return undefined
    return percentToPoint({ x: pin.x, y: pin.y }, rect as DOMRect)
  }
)

/** Captures the frame's real rendered size once the image has actually painted — see `frameRect`. */
function onImageLoad (): void {
  if (!frameRef.value) return
  const rect = frameRef.value.getBoundingClientRect()
  frameRect.value = { width: rect.width, height: rect.height }
}

async function fetchPlans (): Promise<void> {
  loadingPlans.value = true
  try {
    // Explicit limit — the server defaults to a page size of 10, which would silently truncate
    // this picker (same reasoning as AreaPicker's identical note).
    const { data } = await FacilityPlanService.list({ active: true, limit: 9999 })
    plans.value = data
  } catch (error: unknown) {
    console.error('[PinPicker] active facility plan list failed', mapError(error).code)
    plans.value = []
  } finally {
    loadingPlans.value = false
  }
}

async function fetchPins (planId: number): Promise<void> {
  loadingPins.value = true
  try {
    const { data } = await PinService.list({ planId, active: true, limit: 9999 })
    pins.value = data
  } catch (error: unknown) {
    console.error('[PinPicker] pin list failed', mapError(error).code)
    pins.value = []
  } finally {
    loadingPins.value = false
  }
}

async function loadPlanImage (planId: number): Promise<void> {
  imageFailed.value = false
  imageUrl.value = undefined
  frameRect.value = undefined
  try {
    // The plan may not be in the active `plans` list at all (a retired pin's own plan can be
    // deactivated too — ruling 8) — resolve it directly rather than assuming it is there.
    const existing = plans.value.find((plan: IFacilityPlan): boolean => plan.id === planId)
    const plan = existing ?? (await FacilityPlanService.getById(planId)).data
    const { data } = await UploadService.getFileUrl(plan.fileRef)
    imageUrl.value = data.url
  } catch (error: unknown) {
    console.error('[PinPicker] plan image resolution failed', mapError(error).code)
    imageFailed.value = true
  }
}

function onImageError (): void {
  imageFailed.value = true
}

function retryImage (): void {
  if (selectedPlanId.value !== undefined) void loadPlanImage(selectedPlanId.value)
}

/**
 * The permit already references a pin. Resolves it through `GET /v1/pins/:id` (any status, every
 * role, deliberately never scoped — same posture as `AreaPicker.resolveStaleArea`) purely to SHOW
 * it, and points `selectedPlanId` at its plan so the right plan + image loads even when that plan
 * is not itself in the active `plans` list.
 */
async function resolveReferencedPin (id: number): Promise<void> {
  try {
    const { data } = await PinService.getById(id)
    referencedPin.value = data
    selectedPlanId.value = data.planId
    await Promise.all([fetchPins(data.planId), loadPlanImage(data.planId)])
  } catch (error: unknown) {
    console.error('[PinPicker] referenced pin resolution failed', mapError(error).code)
    pinResolveFailed.value = true
    emit('change', { pinId: undefined })
  }
}

onMounted(async (): Promise<void> => {
  await fetchPlans()
  if (props.pinId != null) await resolveReferencedPin(props.pinId)
})

/** The plan Select is local-only UI narrowing — it never emits a `change` on its own. */
function onPlanChange (value: number | undefined): void {
  selectedPlanId.value = value
  pins.value = []
  imageUrl.value = undefined
  imageFailed.value = false
  frameRect.value = undefined
  if (value === undefined) return
  void fetchPins(value)
  void loadPlanImage(value)
}

function onPinChange (value: number | undefined): void {
  // The user just made a real choice, superseding whatever `props.pinId` used to name — clear the
  // mount-time resolution so its "retired" panel does not keep describing a reference that is no
  // longer current (mirrors `AreaPicker.onSelectChange` resetting `referencedArea`).
  referencedPin.value = undefined
  pinResolveFailed.value = false
  if (value === undefined) {
    // A user-driven clear (picked no option, or the clear icon) — send `null` so the server
    // actually unsets a previously-persisted `pinId`, distinct from `resolveReferencedPin`'s
    // `undefined` (leave whatever is stored untouched).
    emit('change', { pinId: null })
    return
  }
  emit('change', { pinId: value })
}
</script>

<style scoped>
</style>
