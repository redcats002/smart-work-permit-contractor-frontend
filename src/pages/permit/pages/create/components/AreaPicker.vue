<template>
  <div class="flex flex-col gap-2.5">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <label class="text-[13px] font-semibold text-text-primary">
        {{ t('permit.create.steps.position.area.label') }}
      </label>
      <button
        class="rounded-md border border-border-strong bg-surface-muted px-3 py-1.5 text-xs font-semibold text-text-primary"
        type="button"
        @click="createAreaOpen = true">
        <span aria-hidden="true">＋</span> {{ t('permit.create.steps.position.area.propose') }}
      </button>
    </div>

    <Select
      :loading="loadingAreas"
      :model-value="selectedAreaId"
      :option-label="'name'"
      :option-value="'id'"
      :options="approvedAreas"
      :placeholder="t('permit.create.steps.position.area.placeholder')"
      class="h-10.5 w-full"
      show-clear
      @update:model-value="onSelectChange($event)" />

    <p
      v-if="!loadingAreas && approvedAreas.length === 0"
      class="text-[12.5px] text-text-tertiary">
      {{ t('permit.create.steps.position.area.empty') }}
    </p>

    <!--
      wayfinder ticket 044. The permit already names an area that is still APPROVED but is not in
      THIS contractor's list — the normal case once `AREA_VISIBILITY_SCOPED=TRUE`. Shown as a
      read-only value, not a warning: nothing is wrong with the permit, and the contractor must be
      able to see what their own permit references instead of watching it disappear from an empty
      Select. Deliberately NOT the amber `staleNote` below, which says "choose another one" —
      advice that would be flatly wrong here.
    -->
    <div
      v-if="referencedArea && referencedArea.status === 'APPROVED'"
      class="flex flex-col gap-1 rounded-lg border border-border bg-surface-muted px-3.5 py-2.5"
      data-testid="area-current-readonly"
      role="status">
      <span class="text-[11px] font-semibold tracking-wide text-text-secondary uppercase">
        {{ t('permit.create.steps.position.area.currentLabel') }}
      </span>
      <span class="text-[13px] font-semibold text-text-primary">{{ referencedArea.name }}</span>
      <span class="text-[12px] text-text-secondary">
        {{ t('permit.create.steps.position.area.currentNote') }}
      </span>
    </div>

    <p
      v-else-if="referencedArea"
      class="rounded-lg border border-status-pending-border bg-status-pending-bg px-3.5 py-2.5 text-[12.5px] font-medium text-status-pending-fg"
      role="status">
      <span aria-hidden="true">ⓘ</span>
      {{ t('permit.create.steps.position.area.staleNote', { name: referencedArea.name }) }}
    </p>
    <p
      v-else-if="areaResolveFailed"
      class="rounded-lg border border-status-pending-border bg-status-pending-bg px-3.5 py-2.5 text-[12.5px] font-medium text-status-pending-fg"
      role="status">
      <span aria-hidden="true">ⓘ</span>
      {{ t('permit.create.steps.position.area.missingNote') }}
    </p>

    <ul
      v-if="proposedAreas.length"
      class="flex list-none flex-col gap-1.5 p-0">
      <li
        v-for="area in proposedAreas"
        :key="area.id"
        class="flex items-center justify-between gap-2 rounded-lg border border-status-pending-border bg-status-pending-bg px-3.5 py-2 text-[12.5px] font-medium text-status-pending-fg">
        <span>{{ area.name }}</span>
        <span class="whitespace-nowrap text-[11px]">{{ t('permit.create.steps.position.area.proposedNote') }}</span>
      </li>
    </ul>

    <CreateAreaModal
      v-model="createAreaOpen"
      @created="onAreaCreated($event)" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useApiError } from '@/composables/useApiError'
import type { IArea } from '@/models/modules/area/Area.model'
import type { IPermitPosition } from '@/models/modules/permit/Permit.model'
import AreaProvider, { type IAreaProvider } from '@/resources/provider/area/Area.provider'
import Select from '@/volt/Select.vue'
import CreateAreaModal from './CreateAreaModal.vue'

/**
 * wayfinder ticket 037 — the permit wizard's area picker, over APPROVED areas only, plus
 * proposing a new one inline (`CreateAreaModal.vue`). Lives inside `Step7Position.vue`, next to
 * the pin picker — "which place" and "where exactly" are related but independent fields (034
 * resolution, decision 4).
 *
 * Area is optional at submit and never gates Next/Submit (ticket 037's explicit constraint) —
 * unlike `usePlanPosition`, there is no shared preflight instance here and no invariant to
 * protect, so this component owns its own local state rather than being hoisted into
 * `useWizard`.
 *
 * wayfinder ticket 044 — the server may now scope `list()` to areas this contractor proposed or
 * was granted (`AREA_VISIBILITY_SCOPED=TRUE`, off by default). Nothing about the CALL changes;
 * what changes is that "the permit's `areaId` is not in the list" flips from an edge case to the
 * ordinary one. Two invariants carry the weight, and both have tests:
 *
 * 1. Such an `areaId` is stripped from the wizard's own `formData` as `undefined` — never `null`
 *    — so it is omitted from, not cleared by, every later autosave PATCH. See `resolveStaleArea`.
 * 2. It is still SHOWN, resolved through the deliberately-unscoped `GET /v1/areas/:id`, and shown
 *    as a plain read-only value when it is still APPROVED rather than as a "no longer approved"
 *    warning. A permit must never look like it has no area just because a visibility flag was
 *    switched on.
 */
interface IProps {
  /** `formData.areaId` as it stands right now — may reference an area outside the approved list. */
  areaId: number | null | undefined
}

interface IAreaChangePayload {
  /**
   * `null` is a deliberate clear (the user picked "no area" — sent to the server so it actually
   * unsets the stored value). `undefined` OMITS the key from the outgoing PATCH instead — the
   * server leaves whatever is already stored untouched — used only when this component silently
   * drops a stale reference it never asked the user about (see `resolveStaleArea`).
   */
  areaId: number | null | undefined
  /** Present only when the newly selected area carries a default position — see `onSelectChange`. */
  position?: IPermitPosition
}

interface IEmits {
  change: [payload: IAreaChangePayload]
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

const { t } = useI18n()
const { mapError } = useApiError()
const AreaService: IAreaProvider = new AreaProvider()

const approvedAreas: Ref<IArea[]> = ref([])
const loadingAreas: Ref<boolean> = ref(false)
/** Areas proposed THIS session via the modal below — not selectable (still PENDING), shown so proposing one is never silently invisible. */
const proposedAreas: Ref<IArea[]> = ref([])
/**
 * The permit's existing `areaId`, resolved, when the list this contractor can see does not
 * contain it. `status` is what distinguishes the two reasons that can be true of: still APPROVED
 * but invisible to this contractor (ticket 044 scoping — a read-only value, nothing is wrong), or
 * genuinely not approved / no longer approved (ticket 037 — an amber "choose another one" note).
 */
const referencedArea: Ref<IArea | undefined> = ref(undefined)
const areaResolveFailed: Ref<boolean> = ref(false)
const createAreaOpen: Ref<boolean> = ref(false)

/**
 * Bound to the Select ONLY while `props.areaId` names an area actually present in the approved
 * list — a stale reference is surfaced via `staleArea` instead (see `resolveStaleArea`), never
 * fed back into this control.
 */
const selectedAreaId: ComputedRef<number | undefined> = computed(
  (): number | undefined => (
    props.areaId != null && approvedAreas.value.some((area: IArea): boolean => area.id === props.areaId)
      ? props.areaId
      : undefined
  )
)

async function fetchApprovedAreas (): Promise<void> {
  loadingAreas.value = true
  try {
    // Explicit limit — the server defaults to a page size of 10, which would silently truncate
    // this picker (docs/api CommonPaginationModel).
    const { data } = await AreaService.list({ status: 'APPROVED', limit: 9999 })
    approvedAreas.value = data
  } catch (error: unknown) {
    console.error('[AreaPicker] approved area list failed', mapError(error).code)
    approvedAreas.value = []
  } finally {
    loadingAreas.value = false
  }
}

/**
 * The permit already references an area the list this contractor can see does not contain. Four
 * causes, and this function deliberately does not care which: proposed but not yet reviewed,
 * rejected, approval later revoked, or — since wayfinder 044 — still APPROVED but outside this
 * contractor's granted set. Resolves it through `GET /v1/areas/:id` (any status, every role, and
 * deliberately never scoped) purely to SHOW it, and strips it from the wizard's OWN
 * `formData.areaId` in the same beat.
 *
 * The strip is the load-bearing part and it is NOT about this component's own display: leaving
 * the id sitting in `formData` would resend it on every later autosave PATCH, and the server's
 * `AREA_NOT_APPROVED` guard fires on the key's mere presence, not on whether the value changed
 * (update.service.ts) — so one non-approved reference would 400 every autosave for the rest of
 * the session. Emitting `{ areaId: undefined }` omits the key from the outgoing payload entirely
 * (`useWizard.doPersist` deletes it), which the server treats as "leave unchanged": the permit's
 * own stored value is untouched either way. `null` would be a real, destructive clear and must
 * never be emitted from here — that spelling belongs to `onSelectChange`, where a human actually
 * asked for it.
 *
 * Stripping is right even for the still-APPROVED 044 case, where the PATCH would in fact be
 * accepted: re-sending a value the contractor cannot see and did not choose buys nothing, and
 * `undefined` preserves it on the server regardless.
 */
async function resolveStaleArea (id: number): Promise<void> {
  try {
    const { data } = await AreaService.getById(id)
    referencedArea.value = data
  } catch (error: unknown) {
    console.error('[AreaPicker] referenced area resolution failed', mapError(error).code)
    areaResolveFailed.value = true
  } finally {
    emit('change', { areaId: undefined })
  }
}

onMounted(async (): Promise<void> => {
  await fetchApprovedAreas()
  const currentId = props.areaId
  if (currentId != null && !approvedAreas.value.some((area: IArea): boolean => area.id === currentId)) {
    void resolveStaleArea(currentId)
  }
})

/**
 * Choosing an area that carries a default position pre-drops the pin (034 resolution, decision
 * 4) — the contractor can still nudge it afterwards on the plan image below. An area with no
 * default position leaves `position` out of the emitted patch entirely, so an already-placed pin
 * is never overwritten by picking one.
 */
function onSelectChange (value: number | undefined): void {
  referencedArea.value = undefined
  areaResolveFailed.value = false
  if (value === undefined) {
    // A user-driven clear (picked no option, or the clear icon) — send `null` so the server
    // actually unsets a previously-persisted `areaId`, distinct from `resolveStaleArea`'s
    // `undefined` (leave whatever is stored untouched).
    emit('change', { areaId: null })
    return
  }
  const area = approvedAreas.value.find((entry: IArea): boolean => entry.id === value)
  const hasDefaultPosition = Boolean(area && area.planId !== null && area.planX !== null && area.planY !== null)
  emit('change', {
    areaId: value,
    position: hasDefaultPosition
      ? { planId: (area as IArea).planId as number, planX: (area as IArea).planX as number, planY: (area as IArea).planY as number }
      : undefined
  })
}

function onAreaCreated (area: IArea): void {
  proposedAreas.value = [area, ...proposedAreas.value]
}
</script>

<style scoped>
</style>
