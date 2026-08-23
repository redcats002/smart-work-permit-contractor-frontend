<template>
  <div>
    <p class="mb-2.5 text-[12px] font-semibold text-text-secondary">
      {{ t('permit.detail.sections.workers.rosterTitle', { count: permit.workers.length }) }}
    </p>

    <p
      v-if="!permit.workers.length"
      class="rounded-[9px] border border-dashed border-border-input bg-surface-app px-4 py-5 text-center text-[12.5px] text-text-secondary"
      data-test="workers-empty">
      {{ t('permit.detail.sections.workers.empty') }}
    </p>

    <div
      v-else
      class="overflow-x-auto">
      <table
        class="w-full min-w-[32rem] border-collapse text-[13px]"
        data-test="workers-table">
        <thead>
          <tr class="border-b border-border text-left text-[11px] text-text-tertiary">
            <th class="py-2 pr-3 font-medium">
              {{ t('permit.detail.sections.workers.columnNo') }}
            </th>
            <th class="py-2 pr-3 font-medium">
              {{ t('permit.detail.sections.workers.columnWorker') }}
            </th>
            <th class="py-2 pr-3 font-medium">
              {{ t('permit.detail.sections.workers.columnRole') }}
            </th>
            <template v-if="healthChecked">
              <th class="py-2 pr-3 font-medium">
                {{ t('permit.detail.sections.workers.columnBloodPressure') }}
              </th>
              <th class="py-2 pr-3 font-medium">
                {{ t('permit.detail.sections.workers.columnAlcohol') }}
              </th>
              <th class="py-2 font-medium">
                {{ t('permit.detail.sections.workers.columnHealth') }}
              </th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in rows"
            :key="`${row.worker.workerName}-${index}`"
            :data-test="`worker-row-${index}`"
            class="border-b border-surface-muted last:border-b-0">
            <td class="py-2.5 pr-3 font-mono text-text-tertiary">
              {{ index + 1 }}
            </td>
            <td class="py-2.5 pr-3 text-text-primary break-words">
              {{ row.worker.workerName }}
            </td>
            <td class="py-2.5 pr-3 text-text-secondary">
              {{ roleLabel(row.worker.roleOnPermit) }}
            </td>
            <template v-if="healthChecked">
              <td class="py-2.5 pr-3 font-mono text-text-primary">
                {{ row.worker.bloodPressure || t('permit.detail.sections.safety.notRecorded') }}
              </td>
              <td class="py-2.5 pr-3 font-mono text-text-primary">
                {{ row.worker.alcoholReading || t('permit.detail.sections.safety.notRecorded') }}
              </td>
              <td class="py-2.5">
                <span
                  :class="row.passed
                    ? 'bg-status-active-bg text-status-active-fg'
                    : 'bg-status-rejected-bg text-status-rejected-fg'"
                  :data-test="`worker-health-${index}`"
                  class="inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap">
                  {{ row.passed ? t('permit.detail.sections.workers.healthPass') : t('permit.detail.sections.workers.healthFail') }}
                </span>
                <ul
                  v-if="!row.passed"
                  class="mt-1 flex flex-col gap-0.5">
                  <li
                    v-for="issue in row.issues"
                    :key="issue"
                    class="text-[11px] leading-snug text-status-rejected-fg">
                    {{ issueLabel(issue) }}
                  </li>
                </ul>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="mt-5 mb-2.5 text-[12px] font-semibold text-text-secondary">
      {{ t('permit.detail.sections.workers.photosTitle') }}
    </p>

    <p
      v-if="!photoRows.length"
      class="rounded-[9px] border border-dashed border-border-input bg-surface-app px-4 py-5 text-center text-[12.5px] text-text-secondary"
      data-test="photos-empty">
      {{ t('permit.detail.sections.workers.photosEmpty') }}
    </p>

    <ul
      v-else
      class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4"
      data-test="photo-slots">
      <li
        v-for="slot in photoRows"
        :key="slot.slotKey"
        :class="slot.photo
          ? 'border-solid border-status-active-border bg-status-active-bg'
          : 'border-dashed border-border-input bg-surface-app'"
        :data-test="`photo-slot-${slot.slotKey}`"
        class="flex flex-col gap-1 rounded-[9px] border px-3 py-2.5">
        <span class="text-[12px] font-semibold text-text-primary">
          {{ slot.label }}
        </span>
        <span
          v-if="slot.photo"
          class="text-[11px] text-text-secondary break-words">
          {{ slot.photo.originalName || slot.photo.fileRef }}
        </span>
        <span
          v-else
          class="text-[11px] text-status-rejected-fg">
          {{ t('permit.detail.sections.workers.photoMissing') }}
        </span>
        <button
          v-if="slot.photo"
          class="mt-0.5 cursor-pointer self-start border-none bg-transparent p-0 text-[11.5px] font-semibold text-primary underline"
          type="button"
          @click="openPhoto(slot.photo)">
          {{ t('permit.detail.sections.workers.photoOpen') }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from '@/plugins/toast'
import { useApiError } from '@/composables/useApiError'
import { EVIDENCE_SLOTS, findPhoto, type IEvidenceSlot } from '@/pages/permit/pages/create/constants/PhotoEvidence'
import { requiresHealthCheck, workerHealthIssues, workerRoleSlug, type TWorkerHealthIssue } from '@/pages/permit/pages/create/constants/WorkerHealth'
import type { IPermitPhoto, IPermitWorker } from '@/models/modules/permit/Permit.model'
import type { IPermitDetail } from '@/models/response/permit/PermitRes.model'
import UploadProvider, { type IUploadProvider } from '@/resources/provider/Upload.provider'

/**
 * §3 Workers & PPE (05-permit-detail-sections.md).
 *
 * The health badge is Confined Space only — that is where the Thai ministerial regulation applies
 * and where the wizard collects `bloodPressure` / `alcoholReading`; the same evaluation the wizard
 * uses is imported rather than re-implemented so the two screens can never disagree.
 *
 * Photos are keyed by `slotKey`, so a slot this permit type REQUIRES but never got is rendered as
 * explicitly missing rather than silently absent. `fileRef` is a storage path, not a URL — it is
 * resolved through `GET /api/v1/file` on demand, the same call the rest of the app uses.
 */
interface IProps {
  permit: IPermitDetail
}

interface IWorkerRow {
  worker: IPermitWorker
  issues: TWorkerHealthIssue[]
  passed: boolean
}

interface IPhotoRow {
  slotKey: string
  label: string
  photo?: IPermitPhoto
}

const props = defineProps<IProps>()

const { t } = useI18n()
const { mapError } = useApiError()

const UploadService: IUploadProvider = new UploadProvider()

const healthChecked: ComputedRef<boolean> = computed((): boolean => requiresHealthCheck(props.permit.type))

const rows: ComputedRef<IWorkerRow[]> = computed((): IWorkerRow[] => props.permit.workers.map(
  (worker: IPermitWorker): IWorkerRow => {
    const issues = workerHealthIssues(worker)
    return { worker, issues, passed: issues.length === 0 }
  }
))

/** Required slots first (missing ones included), then anything else the permit carries. */
const photoRows: ComputedRef<IPhotoRow[]> = computed((): IPhotoRow[] => {
  const required = EVIDENCE_SLOTS[props.permit.type] ?? []
  const requiredKeys = required.map((slot: IEvidenceSlot): string => slot.slotKey)

  const requiredRows: IPhotoRow[] = required.map((slot: IEvidenceSlot): IPhotoRow => ({
    slotKey: slot.slotKey,
    label: t(`permit.create.steps.ppeWorkers.slot.${slot.slotKey}`),
    photo: findPhoto(props.permit.photos, slot.slotKey)
  }))

  // Instrument photos (`instrument-lel`, …) and anything else attached outside the evidence grid.
  const extraRows: IPhotoRow[] = props.permit.photos
    .filter((photo: IPermitPhoto): boolean => !requiredKeys.includes(photo.slotKey))
    .map((photo: IPermitPhoto): IPhotoRow => ({
      slotKey: photo.slotKey,
      label: `${t('permit.detail.sections.workers.photoOther')} · ${photo.slotKey}`,
      photo
    }))

  return [...requiredRows, ...extraRows]
})

function roleLabel (role: string): string {
  const key = `permit.create.steps.ppeWorkers.role.${workerRoleSlug(role)}`
  const label = t(key)
  return label === key ? role : label
}

function issueLabel (issue: TWorkerHealthIssue): string {
  return issue === 'BLOOD_PRESSURE'
    ? t('permit.detail.sections.workers.healthIssueBloodPressure')
    : t('permit.detail.sections.workers.healthIssueAlcohol')
}

async function openPhoto (photo?: IPermitPhoto): Promise<void> {
  if (!photo) return
  try {
    const { data } = await UploadService.getFileUrl(photo.fileRef)
    window.open(data.url, '_blank', 'noopener')
  } catch (error: unknown) {
    // Localized off `errorCode` — the backend's own `message` is never rendered.
    console.error('[PermitWorkersSection] file url failed', mapError(error).code)
    toast.error(t('permit.detail.sections.workers.photoOpenFailed'))
  }
}
</script>

<style scoped>

</style>
