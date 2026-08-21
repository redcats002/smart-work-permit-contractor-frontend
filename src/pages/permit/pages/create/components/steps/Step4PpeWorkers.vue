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
        <button
          class="rounded-md border border-border-strong bg-surface-muted px-3 py-1.5 text-xs font-semibold text-text-primary"
          type="button"
          @click="addWorker()">
          <span aria-hidden="true">＋</span> {{ t('permit.create.steps.ppeWorkers.addWorker') }}
        </button>
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
              :class="row.certificateRejected ? 'bg-status-rejected-bg' : ''"
              class="border-t border-surface-muted align-top">
              <td class="px-3 py-3 font-mono text-[11px] text-text-quaternary">
                {{ row.index + 1 }}
              </td>
              <td class="px-3 py-3">
                <InputText
                  :model-value="row.worker.workerName"
                  :placeholder="t('permit.create.steps.ppeWorkers.placeholder.worker')"
                  class="h-9 w-full"
                  @update:model-value="patchWorker(row.index, { workerName: $event ?? '' })" />
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DeleteModal from '@/components/modal/DeleteModal.vue'
import type { TPermitType } from '@/enums/modules/permit/PermitType.enum'
import { WORKER_ROLES_BY_TYPE, type EWorkerRole, type TWorkerRole } from '@/enums/modules/permit/WorkerRole.enum'
import type { IPermitPhoto, IPermitWorker } from '@/models/modules/permit/Permit.model'
import PhotoSlot from '../PhotoSlot.vue'
import { EVIDENCE_SLOTS, findPhoto, upsertPhoto, type IEvidenceSlot } from '../../constants/PhotoEvidence'
import {
  requiresHealthCheck, workerHealthIssues, workerRoleSlug, workerRowComplete
} from '../../constants/WorkerHealth'
import type { ISubmitCertificateFailure } from '../../constants/SubmitErrorRouting'
import type { IWizardStepEmits, IWizardStepProps } from '../../wizard/WizardSteps'

/**
 * PMT-007 — step 4, PPE / photo evidence / workers.
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
}

const props = defineProps<IWizardStepProps>()
const emit = defineEmits<IWizardStepEmits>()

const { t } = useI18n()

const removalOpen: Ref<boolean> = ref(false)
const pendingIndex: Ref<number | undefined> = ref(undefined)

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
      )
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
}

function onPhotoUploaded (photo: IPermitPhoto): void {
  emit('update:formData', { photos: upsertPhoto(props.formData.photos, photo) })
}
</script>

<style scoped>
</style>
