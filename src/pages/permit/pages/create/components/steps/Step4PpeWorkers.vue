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
                <AutoComplete
                  :force-selection="false"
                  :model-value="row.worker.workerName"
                  :placeholder="t('permit.create.steps.ppeWorkers.placeholder.worker')"
                  :suggestions="workerSuggestions"
                  class="h-9 w-full min-w-[13.75rem]"
                  option-label="workerName"
                  fluid
                  @blur="scheduleWorkerNameCommit()"
                  @complete="onWorkerNameComplete($event.query)"
                  @option-select="scheduleWorkerNameCommit()"
                  @update:model-value="onWorkerNameUpdate(row.index, $event)">
                  <template #option="{ option }">
                    <WorkerCertificateSuggestionOption :certificate="option" />
                  </template>
                  <template #empty>
                    {{ t('permit.create.steps.ppeWorkers.suggestion.empty') }}
                  </template>
                </AutoComplete>
              </td>
              <td class="px-3 py-3">
                <div class="flex flex-wrap gap-1.5">
                  <button
                    v-for="role in roleOptions"
                    :key="role"
                    :class="row.worker.roleOnPermit === role
                      ? 'bg-shell-sidebar text-white'
                      : 'bg-surface-subtle text-text-secondary'"
                    class="rounded-md px-2.5 py-1 text-[11.5px] font-semibold whitespace-nowrap"
                    type="button"
                    @click="patchWorker(row.index, { roleOnPermit: role })">
                    {{ t(`permit.create.steps.ppeWorkers.role.${workerRoleSlug(role)}`) }}
                  </button>
                </div>
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
      @created="onCertificateCreated($event)" />
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

import type { ICertificate } from '@/models/modules/certificate/Certificate.model'
import type { IPermitPhoto, IPermitWorker } from '@/models/modules/permit/Permit.model'

import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import { type EWorkerRole, type TWorkerRole, WORKER_ROLES_BY_TYPE } from '@/enums/modules/permit/WorkerRole.enum'

import { EVIDENCE_SLOTS, findPhoto, type IEvidenceSlot, upsertPhoto } from '../../constants/PhotoEvidence'
import type { ISubmitCertificateFailure } from '../../constants/SubmitErrorRouting'
import { requiresHealthCheck, workerHealthIssues, workerRoleSlug, workerRowComplete } from '../../constants/WorkerHealth'

import DeleteModal from '@/components/modal/DeleteModal.vue'

import AutoComplete from '@/volt/AutoComplete.vue'

import { useI18n } from 'vue-i18n'

import type { ICertificateProblem } from '../../composables/useCertificatePreflight'
import { useWorkerCertificateSuggestions } from '../../composables/useWorkerCertificateSuggestions'
import type { IWizardStepEmits, IWizardStepProps } from '../../wizard/WizardSteps'
import CreateCertificateModal from '../CreateCertificateModal.vue'
import PhotoSlot from '../PhotoSlot.vue'
import WorkerCertificateSuggestionOption from '../WorkerCertificateSuggestionOption.vue'

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
 * wayfinder ticket 004 — worker-name AutoComplete suggestion source. Fetched once on mount and
 * filtered client-side (`GET /api/v1/certificates/` has no server-side search param, ticket 003).
 * `workerSuggestions` holds whatever the last `@complete` query matched; free text that matches
 * nothing stays a legal `workerName` regardless — `force-selection="false"` on the AutoComplete
 * below is what keeps that true.
 */
const {
  filter: filterCertificates,
  add: addSuggestedCertificate,
  fetch: fetchCertificateSuggestions
} = useWorkerCertificateSuggestions()
const workerSuggestions: Ref<ICertificate[]> = ref([])
/** Last worker-name list handed to the pre-flight — see `commitWorkerNames` below. */
let lastCommittedNames = ''
let commitTimer: ReturnType<typeof setTimeout> | undefined

onMounted((): void => {
  void fetchCertificateSuggestions()
})

function onWorkerNameComplete (query: string): void {
  workerSuggestions.value = filterCertificates(query)
}

/**
 * Fires on every keystroke (a plain string) AND on selecting a suggestion — PrimeVue's
 * AutoComplete emits the whole selected option object in that case, not its label, so this is
 * the one place that normalizes either shape back down to the plain `workerName` string
 * `IPermitWorker` actually wants.
 */
function onWorkerNameUpdate (index: number, value: string | ICertificate | null): void {
  if (value === null || value === '') {
    patchWorker(index, { workerName: '' })
    return
  }
  patchWorker(index, { workerName: typeof value === 'string' ? value : value.workerName })
}

/**
 * The certificate pre-flight deliberately does NOT run while a name is being typed. Its verdict
 * mounts (and clears) the `certificateProblems` banner below this table, and that reflow closes
 * PrimeVue's open suggestion overlay — AutoComplete binds a scroll listener on its scrollable
 * ancestors (this table is `overflow-x-auto`) and a window resize listener whenever the overlay
 * is up, and both call `hide()`. So the check fires here instead, on the events that actually
 * settle a name: picking a suggestion, and leaving the field.
 *
 * Deferred by a macrotask, and that timing is load-bearing rather than incidental. Clicking a
 * suggestion blurs the input on `mousedown`, BEFORE the `click` that selects it. Running the
 * check synchronously there would clear `problems` (the pre-flight empties it before its first
 * await), unmount the banner, shorten the page, and hide the overlay out from under the click —
 * reinstating the reported bug at the exact moment the user is trying to pick a name. `nextTick`
 * would not help: it is a microtask, and drains before `mouseup`. A `setTimeout` lands after the
 * whole click sequence, so selection completes first — and by then the parent's `formData`
 * write-back has rendered, so the guard below hashes the settled list and the blur that follows a
 * selection is a no-op rather than a second lookup.
 */
function commitWorkerNames (): void {
  const names = workers.value.map((worker: IPermitWorker): string => worker.workerName.trim()).join('\u0000')
  if (names === lastCommittedNames) return
  lastCommittedNames = names
  emit('recheck-certificates')
}

function scheduleWorkerNameCommit (): void {
  if (commitTimer !== undefined) clearTimeout(commitTimer)
  commitTimer = setTimeout((): void => {
    commitTimer = undefined
    commitWorkerNames()
  }, 0)
}

// A pending commit must not emit into a torn-down parent — the user can leave the wizard within
// the same tick as a blur (clicking the browser back button blurs the field first).
onBeforeUnmount((): void => {
  if (commitTimer !== undefined) clearTimeout(commitTimer)
})

/** wayfinder ticket 004 — a certificate created in-wizard suggests immediately, no refetch. */
function onCertificateCreated (certificate: ICertificate): void {
  addSuggestedCertificate(certificate)
  emit('recheck-certificates')
}

const permitType: ComputedRef<TPermitType | undefined> = computed(
  (): TPermitType | undefined => props.formData.type
)
const workers: ComputedRef<IPermitWorker[]> = computed((): IPermitWorker[] => props.formData.workers ?? [])
const healthRequired: ComputedRef<boolean> = computed((): boolean => requiresHealthCheck(permitType.value))

const evidenceSlots: ComputedRef<IEvidenceSlot[]> = computed(
  (): IEvidenceSlot[] => (permitType.value ? EVIDENCE_SLOTS[permitType.value] ?? [] : [])
)
const roleOptions: ComputedRef<EWorkerRole[]> = computed(
  (): EWorkerRole[] => (permitType.value ? WORKER_ROLES_BY_TYPE[permitType.value] ?? [] : [])
)

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

function certificateProblemFor (workerName: string): ICertificateProblem['reason'] | undefined {
  return certificateProblems.value.find(
    (problem: ICertificateProblem): boolean => problem.workerName === workerName
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
      certificateRejected: serverRejectedCertificates.value.some(
        (failure: ISubmitCertificateFailure): boolean => failure.workerName === worker.workerName
      ),
      certificateProblem: certificateProblemFor(worker.workerName)
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
    { workerName: '', roleOnPermit: (roleOptions.value[0] ?? '') as TWorkerRole }
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
  lastCommittedNames = ''
  emit('recheck-certificates')
}

function onPhotoUploaded (photo: IPermitPhoto): void {
  emit('update:formData', { photos: upsertPhoto(props.formData.photos, photo) })
}
</script>

<style scoped>
</style>
