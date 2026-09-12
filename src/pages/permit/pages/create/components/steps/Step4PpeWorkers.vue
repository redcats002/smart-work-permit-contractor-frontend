<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-col gap-1">
      <h2 class="text-lg font-bold text-text-primary">
        {{ title }}
      </h2>
      <p class="text-sm text-text-secondary">
        {{ t('permit.create.steps.ppeWorkers.subtitle') }}
      </p>
    </div>

    <section class="flex flex-col gap-3">
      <h3 class="text-[13px] font-semibold text-text-primary">
        {{ t('permit.create.steps.ppeWorkers.evidenceTitle') }}
      </h3>
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div
          v-for="slot in evidenceSlots"
          :key="slot.slotKey"
          class="flex flex-col gap-2 rounded-xl border border-border bg-surface-dashed p-3">
          <span class="flex items-center gap-1.5 text-[11px] font-semibold text-text-secondary">
            <span aria-hidden="true">{{ slot.icon }}</span>
            {{ t(`permit.create.steps.ppeWorkers.slot.${slot.slotKey}`) }}
          </span>
          <PhotoSlot
            :label="t('permit.create.steps.ppeWorkers.attach')"
            :min-height="72"
            :photo="findPhoto(formData.photos, slot.slotKey)"
            :slot-key="slot.slotKey"
            @uploaded="onPhotoUploaded($event)" />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-2.5">
      <div class="flex flex-col gap-1">
        <h3 class="text-[13px] font-semibold text-text-primary">
          {{ t('permit.create.steps.ppeWorkers.ppe.title') }}
        </h3>
        <p class="text-xs text-text-tertiary">
          {{ t('permit.create.steps.ppeWorkers.ppe.optionalHint') }}
        </p>
      </div>
      <div class="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-3 lg:grid-cols-4">
        <label
          v-for="item in PPE_ITEMS"
          :key="item"
          class="flex cursor-pointer items-center gap-2 text-[13px] text-text-primary">
          <Checkbox
            v-model="ppeDeclaredModel"
            :value="item" />
          {{ t(`permit.create.steps.ppeWorkers.ppe.item.${ppeItemSlug(item)}`) }}
        </label>
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-[12px] font-medium text-text-secondary">
          {{ t('permit.create.steps.ppeWorkers.ppe.noteLabel') }}
        </label>
        <Textarea
          v-model="ppeNoteModel"
          :placeholder="t('permit.create.steps.ppeWorkers.ppe.notePlaceholder')"
          rows="2"
          fluid />
      </div>
    </section>

    <section class="rounded-lg border border-status-pending-border bg-status-pending-bg px-3.5 py-3">
      <p class="text-[12.5px] font-bold text-status-pending-fg">
        <span aria-hidden="true">⚕</span> {{ t('permit.create.steps.ppeWorkers.regulation.title') }}
      </p>
      <p class="mt-1 text-xs leading-relaxed text-status-pending-fg">
        {{ t('permit.create.steps.ppeWorkers.regulation.body') }}
      </p>
    </section>

    <section class="flex flex-col gap-2.5">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h3 class="text-[13px] font-semibold text-text-primary">
          {{ t('permit.create.steps.ppeWorkers.workersTitle', { count: workers.length }) }}
        </h3>
        <div class="flex flex-wrap gap-2">
          <button
            class="rounded-md border border-border-strong bg-surface-muted px-3 py-1.5 text-xs font-semibold text-text-primary"
            type="button"
            @click="createCertificateOpen = true">
            <span aria-hidden="true">📎</span> {{ t('permit.create.steps.ppeWorkers.addCertificate') }}
          </button>
          <button
            class="rounded-md border border-border-strong bg-surface-muted px-3 py-1.5 text-xs font-semibold text-text-primary"
            type="button"
            @click="addWorker()">
            <span aria-hidden="true">＋</span> {{ t('permit.create.steps.ppeWorkers.addWorker') }}
          </button>
        </div>
      </div>

      <p
        v-if="!workers.length"
        class="rounded-xl border border-dashed border-border-input bg-surface-app px-4 py-6 text-center text-[13px] text-text-tertiary">
        {{ t('permit.create.steps.ppeWorkers.noWorkers') }}
      </p>

      <div
        v-else
        class="overflow-x-auto rounded-xl border border-border">
        <table class="w-full min-w-[680px] border-collapse text-left">
          <thead>
            <tr class="bg-surface-subtle text-[11px] font-semibold text-text-secondary">
              <th class="w-10 px-3 py-2.5 font-semibold">
                #
              </th>
              <th class="px-3 py-2.5 font-semibold">
                {{ t('permit.create.steps.ppeWorkers.column.worker') }}
              </th>
              <th class="px-3 py-2.5 font-semibold">
                {{ t('permit.create.steps.ppeWorkers.column.role') }}
              </th>
              <th class="w-24 px-3 py-2.5 font-semibold">
                {{ t('permit.create.steps.ppeWorkers.column.certificate') }}
              </th>
              <template v-if="healthRequired">
                <th class="w-28 px-3 py-2.5 font-semibold">
                  {{ t('permit.create.steps.ppeWorkers.column.bloodPressure') }}
                </th>
                <th class="w-28 px-3 py-2.5 font-semibold">
                  {{ t('permit.create.steps.ppeWorkers.column.alcohol') }}
                </th>
                <th class="w-20 px-3 py-2.5 font-semibold">
                  {{ t('permit.create.steps.ppeWorkers.column.result') }}
                </th>
              </template>
              <th class="w-12 px-3 py-2.5" />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in workerRows"
              :key="row.index"
              :class="row.certificateRejected || row.certificateProblem ? 'bg-status-rejected-bg' : ''"
              class="border-t border-surface-muted align-top">
              <td class="px-3 py-3 font-mono text-[11px] text-text-quaternary">
                {{ row.index + 1 }}
              </td>
              <td class="px-3 py-3">
                <!--
                  wayfinder ticket 048. `fluid` is load-bearing, not decoration: Volt's PT gives
                  the inner <input> its width through `p-fluid:w-full`, a variant that only
                  matches once PrimeVue stamps `data-p="fluid"`. Without it the `w-full` here
                  styles the wrapper alone and the input sits at the UA default (~20ch) however
                  wide the cell is — the reported "too narrow to read". `min-w` then makes the
                  cell itself wide enough to be worth filling: this table is `overflow-x-auto`,
                  so a column claiming real width scrolls rather than squeezing its neighbours.

                  13.75rem = 220px, and it is derived, not picked. At the 375px floor this app
                  must not break at, the scroll container is ~303px wide (375 − 32 page `px-4`
                  − 40 card `p-5`). This is the SECOND column, after `#` at `w-10`: 40 + 220 + 24
                  (cell `px-3`) + 2 (table borders) = 286px, so the whole field is on screen at
                  scroll 0 with room to spare, rather than needing a horizontal pan to read the
                  name — which is what the field report was actually about. Anything much wider
                  buys legibility at the cost of that, so raise it only against a real measurement.

                  It also fixes the suggestion list, which is why there is no separate change
                  for it — PrimeVue sizes the overlay's `min-width` from the input's rendered
                  width, so a narrow input produced a narrow list.
                -->
                <WorkerPicker
                  :initial-name="row.worker.workerName"
                  :model-value="row.worker.workerId"
                  class="min-w-[13.75rem]"
                  @worker-selected="onWorkerSelected(row.index, $event)" />
              </td>
              <td class="px-3 py-3">
                <!--
                  wayfinder 103 — `roleOnPermit` is free text on the wire (`minLength: 1`, no
                  enum); `EWorkerRole` is a curated template list, still filtered by permit type,
                  not a closed set. An editable AutoComplete (dropdown button shows the whole
                  template list; typing filters it; any non-empty text the user types is kept
                  as-is, `force-selection` false) replaces the old fixed chip-button set, which
                  could only ever emit one of `WORKER_ROLES_BY_TYPE`'s values.
                -->
                <AutoComplete
                  :dropdown="true"
                  :force-selection="false"
                  :model-value="row.worker.roleOnPermit"
                  :placeholder="t('permit.create.steps.ppeWorkers.placeholder.role')"
                  :suggestions="roleSuggestions"
                  class="min-w-[9rem]"
                  fluid
                  @complete="onRoleComplete($event.query)"
                  @update:model-value="patchWorker(row.index, { roleOnPermit: $event ?? '' })">
                  <template #option="{ option }">
                    {{ t(`permit.create.steps.ppeWorkers.role.${workerRoleSlug(option)}`) }}
                  </template>
                </AutoComplete>
              </td>
              <td class="px-3 py-3">
                <span
                  v-if="certificateBadge(row) !== 'none'"
                  :class="CERTIFICATE_BADGE_CLASS[certificateBadge(row)]"
                  class="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap">
                  {{ t(`permit.create.steps.ppeWorkers.certificate.${certificateBadge(row)}`) }}
                </span>
                <span
                  v-else
                  class="text-[11px] text-text-tertiary">—</span>
              </td>
              <template v-if="healthRequired">
                <td class="px-3 py-3">
                  <InputText
                    :class="row.bloodPressureFailed ? 'text-primary' : ''"
                    :model-value="row.worker.bloodPressure ?? ''"
                    :placeholder="t('permit.create.steps.ppeWorkers.placeholder.bloodPressure')"
                    class="h-9 w-full font-mono text-xs"
                    @update:model-value="patchWorker(row.index, { bloodPressure: $event ?? '' })" />
                </td>
                <td class="px-3 py-3">
                  <InputText
                    :class="row.alcoholFailed ? 'text-primary' : ''"
                    :model-value="row.worker.alcoholReading ?? ''"
                    :placeholder="t('permit.create.steps.ppeWorkers.placeholder.alcohol')"
                    class="h-9 w-full font-mono text-xs"
                    @update:model-value="patchWorker(row.index, { alcoholReading: $event ?? '' })" />
                </td>
                <td class="px-3 py-3">
                  <span
                    :class="row.healthPassed
                      ? 'bg-status-active-bg text-status-active-fg-emphasis'
                      : 'bg-status-rejected-bg text-status-rejected-fg'"
                    class="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold whitespace-nowrap">
                    {{ row.healthPassed
                      ? t('permit.create.steps.ppeWorkers.health.pass')
                      : t('permit.create.steps.ppeWorkers.health.fail') }}
                  </span>
                </td>
              </template>
              <td class="px-3 py-3">
                <button
                  :aria-label="t('permit.create.steps.ppeWorkers.removeWorker')"
                  class="rounded-md px-2 py-1 text-sm text-text-tertiary"
                  type="button"
                  @click="askRemove(row.index)">
                  <span aria-hidden="true">🗑</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-if="serverRejectedCertificates.length"
        class="rounded-lg border border-status-rejected-border bg-status-rejected-bg px-3.5 py-2.5
          text-[12.5px] text-status-rejected-fg-emphasis">
        <p class="font-bold">
          <span aria-hidden="true">⛔</span> {{ t('permit.create.steps.ppeWorkers.serverRejected.title') }}
        </p>
        <ul class="mt-1 flex list-none flex-col gap-0.5 p-0">
          <li
            v-for="failure in serverRejectedCertificates"
            :key="failure.workerName">
            {{ failure.workerName }} · {{ t(`error.${failure.errorCode}`) }}
          </li>
        </ul>
      </div>

      <div
        v-if="certificateProblems.length"
        class="rounded-lg border border-status-rejected-border bg-status-rejected-bg px-3.5 py-2.5
          text-[12.5px] text-status-rejected-fg-emphasis">
        <p class="font-bold">
          <span aria-hidden="true">⛔</span> {{ t('permit.create.steps.ppeWorkers.certificatePreflight.title') }}
        </p>
        <ul class="mt-1 flex list-none flex-col gap-0.5 p-0">
          <li
            v-for="problem in certificateProblems"
            :key="problem.workerName">
            {{ problem.workerName }} · {{ t(`permit.create.steps.ppeWorkers.certificate.${problem.reason === 'MISSING' ? 'missing' : 'expired'}`) }}
          </li>
        </ul>
      </div>

      <p
        v-if="anyHealthFailure"
        class="rounded-lg border border-status-rejected-border bg-status-rejected-bg px-3.5 py-2.5
          text-[12.5px] font-semibold text-status-rejected-fg-emphasis">
        <span aria-hidden="true">⛔</span> {{ t('permit.create.steps.ppeWorkers.healthBlocked') }}
      </p>
      <p
        v-if="anyIncompleteRow"
        class="rounded-lg border border-status-pending-border bg-status-pending-bg px-3.5 py-2.5
          text-[12.5px] font-semibold text-status-pending-fg">
        <span aria-hidden="true">⚠</span> {{ t('permit.create.steps.ppeWorkers.validation.incompleteRow') }}
      </p>
    </section>

    <DeleteModal
      v-model="removalOpen"
      :confirm-label="t('permit.create.steps.ppeWorkers.remove.confirm')"
      :description1="t('permit.create.steps.ppeWorkers.remove.description')"
      :description2="pendingWorkerName"
      :title="t('permit.create.steps.ppeWorkers.remove.title')"
      @confirm="confirmRemove()" />

    <CreateCertificateModal
      v-model="createCertificateOpen"
      @created="onCertificateCreated()" />
  </div>
</template>

<script setup lang="ts">
import {
  computed, type ComputedRef, ref, type Ref, type WritableComputedRef
} from 'vue'

import type { IPermitPhoto, IPermitWorker } from '@/models/modules/permit/Permit.model'
import type { IWorker } from '@/models/modules/worker/Worker.model'

import { PPE_ITEMS, ppeItemSlug } from '@/enums/modules/permit/PpeItem.enum'
import type { EPpeItem } from '@/enums/modules/permit/PpeItem.enum'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import { type EWorkerRole, WORKER_ROLES_BY_TYPE } from '@/enums/modules/permit/WorkerRole.enum'

import { EVIDENCE_SLOTS, findPhoto, type IEvidenceSlot, upsertPhoto } from '../../constants/PhotoEvidence'
import type { ISubmitCertificateFailure } from '../../constants/SubmitErrorRouting'
import { requiresHealthCheck, workerHealthIssues, workerRoleSlug, workerRowComplete } from '../../constants/WorkerHealth'

import DeleteModal from '@/components/modal/DeleteModal.vue'
import WorkerPicker from '@/components/worker/WorkerPicker.vue'

import { useI18n } from 'vue-i18n'

import type { ICertificateProblem } from '../../composables/useCertificatePreflight'
import type { IWizardStepEmits, IWizardStepProps } from '../../wizard/WizardSteps'
import CreateCertificateModal from '../CreateCertificateModal.vue'
import PhotoSlot from '../PhotoSlot.vue'

/**
 * PMT-007 / CRT-004 — step 4, PPE / photo evidence / workers.
 *
 * `workers` is REPLACED WHOLESALE by PATCH /permits/:id, so every mutation here emits the complete
 * list — never a partial one, which would silently delete the rest. `photos` upsert per `slotKey`.
 */
interface IWorkerRow {
  index: number
  worker: IPermitWorker
  healthPassed: boolean
  bloodPressureFailed: boolean
  alcoholFailed: boolean
  /** The SERVER refused this worker's certificate on the last submit — not a client-side check. */
  certificateRejected: boolean
  /**
   * `useWizard`'s shared client-side pre-flight verdict (`certificateProblems` prop) for this
   * named worker — undefined when the worker has no name yet, or the lookup found nothing wrong.
   */
  certificateProblem: ICertificateProblem['reason'] | undefined
}

/** Client-side certificate badge shown per worker row. Never authoritative — see the module doc. */
type TCertificateBadge = 'none' | 'checking' | 'pass' | 'missing' | 'expired' | 'unknown'

const CERTIFICATE_BADGE_CLASS: Record<TCertificateBadge, string> = {
  none: '',
  checking: 'bg-surface-muted text-text-tertiary',
  pass: 'bg-status-active-bg text-status-active-fg-emphasis',
  missing: 'bg-status-rejected-bg text-status-rejected-fg',
  expired: 'bg-status-rejected-bg text-status-rejected-fg',
  unknown: 'bg-status-pending-bg text-status-pending-fg'
}

const props = defineProps<IWizardStepProps>()
const emit = defineEmits<IWizardStepEmits>()

const { t } = useI18n()

const removalOpen: Ref<boolean> = ref(false)
const pendingIndex: Ref<number | undefined> = ref(undefined)
const createCertificateOpen: Ref<boolean> = ref(false)

/**
 * wayfinder 063 — the worker field binds a Worker record via the shared `WorkerPicker`
 * (search over the contractor's own `GET /api/v1/workers`, inline "Create worker …" asking role
 * only, `WORKER_ALREADY_EXISTS` 409-adopt). Selection is atomic — there is no keystroke-driven
 * pre-flight to debounce any more, unlike the old free-text AutoComplete this replaces: the
 * certificate check now fires once, right after a worker actually resolves to an id.
 */
function onWorkerSelected (index: number, worker: IWorker | undefined): void {
  patchWorker(index, { workerId: worker?.id, workerName: worker?.name ?? '' })
  emit('recheck-certificates')
}

/** A certificate created in-wizard (for a worker already on this permit) invalidates the pre-flight. */
function onCertificateCreated (): void {
  emit('recheck-certificates')
}

const permitType: ComputedRef<TPermitType | undefined> = computed(
  (): TPermitType | undefined => props.formData.type
)
const workers: ComputedRef<IPermitWorker[]> = computed((): IPermitWorker[] => props.formData.workers ?? [])
const healthRequired: ComputedRef<boolean> = computed((): boolean => requiresHealthCheck(permitType.value))

/**
 * Wayfinder 097. Bound directly to `formData` and emitted the same way every other field on this
 * step is (`patchWorker`/`emitWorkers` above) — this step has no `<Form>`/zodResolver at all (see
 * `Step4PpeWorkersSchema`, which validates the whole slice via `safeParse`, not a registered
 * field), so there is no "bare native input the resolver can't see" trap here; a Volt `Checkbox`
 * bound to a `WritableComputedRef` array is the same live-state pattern `Step3WhereWhen`'s
 * `scheduleNoteModel` uses for its own free-text field. Optional to submit — no client gate.
 */
const ppeDeclaredModel: WritableComputedRef<EPpeItem[]> = computed<EPpeItem[]>({
  get: (): EPpeItem[] => props.formData.ppeDeclared ?? [],
  set: (value: EPpeItem[]): void => emit('update:formData', { ppeDeclared: value })
})

const ppeNoteModel: WritableComputedRef<string> = computed<string>({
  get: (): string => props.formData.ppeNote ?? '',
  set: (value: string): void => emit('update:formData', { ppeNote: value || undefined })
})

const evidenceSlots: ComputedRef<IEvidenceSlot[]> = computed(
  (): IEvidenceSlot[] => (permitType.value ? EVIDENCE_SLOTS[permitType.value] ?? [] : [])
)
const roleOptions: ComputedRef<EWorkerRole[]> = computed(
  (): EWorkerRole[] => (permitType.value ? WORKER_ROLES_BY_TYPE[permitType.value] ?? [] : [])
)

/**
 * wayfinder 103 — the `roleOnPermit` AutoComplete's suggestion list. The dropdown button fires
 * `@complete` with an empty query (shows the whole template list); typing narrows it, and can
 * narrow to nothing — that is fine, `force-selection: false` means whatever was typed still
 * lands in `roleOnPermit` on blur/select regardless of whether it matched a suggestion. The
 * template is a set of suggestions, never a closed set the field can refuse.
 */
const roleSuggestions: Ref<EWorkerRole[]> = ref([])

function onRoleComplete (query: string): void {
  const needle = query.trim().toLowerCase()
  roleSuggestions.value = needle
    ? roleOptions.value.filter((role: EWorkerRole): boolean => role.toLowerCase().includes(needle))
    : roleOptions.value
}

/**
 * Workers the SERVER refused on the last submit (`certificateFailures[]` on the 400 body). The
 * client cannot see certificate validity while typing, so this is the only place the wizard
 * learns which specific workers are blocked — and its verdict overrides anything shown locally.
 */
const serverRejectedCertificates: ComputedRef<ISubmitCertificateFailure[]> = computed(
  (): ISubmitCertificateFailure[] => props.submitFailures?.certificates ?? []
)

/**
 * CRT-004. `useWizard`'s shared client-side pre-flight verdict for THIS step's workers — the
 * same instance step 6 reads, kept in sync via a debounced watch on `formData.workers`.
 */
const certificateProblems: ComputedRef<ICertificateProblem[]> = computed(
  (): ICertificateProblem[] => props.certificateProblems
)

// wayfinder 088: keyed on `workerId`, never the name. A row with no id yet (a freshly added,
// unpicked row) has no problem to show rather than borrowing a same-named worker's.
function certificateProblemFor (workerId: number | undefined): ICertificateProblem['reason'] | undefined {
  if (typeof workerId !== 'number') return undefined
  return certificateProblems.value.find(
    (problem: ICertificateProblem): boolean => problem.workerId === workerId
  )?.reason
}

/**
 * Never claims 'pass' while the shared check is still 'loading'/'idle', and never claims 'pass'
 * on 'unknown' (a failed lookup) — an unresolved or failed answer must not look like a pass.
 */
function certificateBadge (row: IWorkerRow): TCertificateBadge {
  if (!row.worker.workerName?.trim()) return 'none'
  if (row.certificateProblem === 'MISSING') return 'missing'
  if (row.certificateProblem === 'EXPIRED') return 'expired'
  if (props.certificateState === 'loading' || props.certificateState === 'idle') return 'checking'
  if (props.certificateState === 'pass' || props.certificateState === 'fail') return 'pass'
  return 'unknown'
}

const workerRows: ComputedRef<IWorkerRow[]> = computed((): IWorkerRow[] =>
  workers.value.map((worker: IPermitWorker, index: number): IWorkerRow => {
    const issues = workerHealthIssues(worker)
    return {
      index,
      worker,
      healthPassed: issues.length === 0,
      bloodPressureFailed: issues.includes('BLOOD_PRESSURE'),
      alcoholFailed: issues.includes('ALCOHOL'),
      certificateRejected: typeof worker.workerId === 'number' && serverRejectedCertificates.value.some(
        (failure: ISubmitCertificateFailure): boolean => failure.workerId === worker.workerId
      ),
      certificateProblem: certificateProblemFor(worker.workerId)
    }
  })
)

const anyHealthFailure: ComputedRef<boolean> = computed(
  (): boolean => healthRequired.value && workerRows.value.some((row: IWorkerRow): boolean => !row.healthPassed)
)
const anyIncompleteRow: ComputedRef<boolean> = computed(
  (): boolean => workers.value.some((worker: IPermitWorker): boolean => !workerRowComplete(worker))
)

const pendingWorkerName: ComputedRef<string> = computed((): string => {
  if (pendingIndex.value === undefined) return ''
  return workers.value[pendingIndex.value]?.workerName ?? ''
})

function emitWorkers (next: IPermitWorker[]): void {
  emit('update:formData', { workers: next })
}

function patchWorker (index: number, patch: Partial<IPermitWorker>): void {
  emitWorkers(workers.value.map(
    (worker: IPermitWorker, position: number): IPermitWorker => (position === index ? { ...worker, ...patch } : worker)
  ))
}

function addWorker (): void {
  emitWorkers([
    ...workers.value,
    // wayfinder 063: `IPermitWorker.workerId` is `NOT NULL` on the wire, but a freshly added row
    // has no Worker picked yet — `WorkerPicker` resolves one via `onWorkerSelected`, and
    // `workerRowComplete` (this step's schema + Next gate) blocks until it does. This placeholder
    // is never sent to the wire as-is.
    { workerId: undefined, workerName: '', roleOnPermit: roleOptions.value[0] ?? '' } as unknown as IPermitWorker
  ])
}

function askRemove (index: number): void {
  pendingIndex.value = index
  removalOpen.value = true
}

function confirmRemove (): void {
  const index = pendingIndex.value
  if (index === undefined) return
  emitWorkers(workers.value.filter((_worker: IPermitWorker, position: number): boolean => position !== index))
  pendingIndex.value = undefined
  emit('recheck-certificates')
}

function onPhotoUploaded (photo: IPermitPhoto): void {
  emit('update:formData', { photos: upsertPhoto(props.formData.photos, photo) })
}
</script>

<style scoped>
</style>
