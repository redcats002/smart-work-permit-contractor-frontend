<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-col gap-1">
      <h2 class="text-lg font-bold text-text-primary">
        {{ title }}
      </h2>
      <p class="text-sm text-text-secondary">
        {{ t('permit.create.steps.position.subtitle') }}
      </p>
    </div>

    <AreaPicker
      :area-id="formData.areaId"
      @change="onAreaChange($event)" />

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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiError } from '@/composables/useApiError'
import type { IFacilityPlan } from '@/models/modules/facility-plan/FacilityPlan.model'
import type { IPermitPosition } from '@/models/modules/permit/Permit.model'
import { percentToPoint, pointToPercent } from '@/utils/PlanPosition'
import FacilityPlanProvider, { type IFacilityPlanProvider } from '@/resources/provider/facility-plan/FacilityPlan.provider'
import UploadProvider, { type IUploadProvider } from '@/resources/provider/Upload.provider'
import AreaPicker from '../AreaPicker.vue'
import type { IWizardStepEmits, IWizardStepProps } from '../../wizard/WizardSteps'

/**
 * feat-023 — step 6 (when shown), the pin-on-plan picker.
 *
 * Renders a plain `<img>` — the plan is guaranteed a raster PNG/JPEG/WebP, the API refuses PDF
 * and HEIC on this route (../../../../../PROMPT-LOG.md). Percentage<->pixel conversion is
 * computed from the image element's CURRENT rendered rect at click time
 * (`src/utils/PlanPosition.ts`), never a hardcoded dimension — the image is responsive.
 *
 * The permit's OWN `planId` is resolved, not blindly the active plan: plan versions are
 * immutable and retained forever, so a permit frozen against an older version must still show
 * that version's image (a stale pin still plots, per the map's existing ruling), with an
 * explicit "older version" note rather than silently re-projecting onto the new one.
 *
 * wayfinder ticket 037 adds `AreaPicker` above the pin frame — "which place" (the area) and
 * "where exactly" (the pin) are independent fields (034 resolution), so the area picker is
 * always shown here, even in the `'loading'`/`'none'` states below that gate the pin frame
 * itself.
 */
const props = defineProps<IWizardStepProps>()
const emit = defineEmits<IWizardStepEmits>()

const { t } = useI18n()
const { mapError } = useApiError()
const FacilityPlanService: IFacilityPlanProvider = new FacilityPlanProvider()
const UploadService: IUploadProvider = new UploadProvider()

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
 * The permit's own `planId` may reference an older, no-longer-active version. Resolves THAT
 * version (`GET /facility-plans/:id`) when it differs from the currently active one; falls back
 * to the active plan for a not-yet-placed permit.
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
    console.error('[Step7Position] plan resolution failed', mapError(error).code)
    imageFailed.value = true
  }
}

function onImageError (): void {
  imageFailed.value = true
}

/**
 * wayfinder ticket 037. `AreaPicker` owns its own fetch/propose/stale-reference state; this step
 * only translates its verdict into a `formData` patch. `position` rides along in the SAME patch
 * as `areaId` when the picked area carries a default one, so the two writes can never land as
 * separate `updateFormData` calls that race each other.
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
</script>

<style scoped>
</style>
