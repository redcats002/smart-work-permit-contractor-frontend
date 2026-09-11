<template>
  <li
    :data-test="`report-visit-${visit.id}`"
    class="rounded-[10px] border border-border bg-surface-card px-4 py-3.5">
    <header class="mb-2.5 flex flex-wrap items-baseline justify-between gap-2">
      <div>
        <p class="text-[13px] font-semibold text-text-primary">
          {{ inspectorName }}
        </p>
        <p class="text-[11.5px] text-text-tertiary">
          {{ t('permit.detail.report.visit.started', { when: stamp(visit.startedAt) }) }}
          <template v-if="visit.submittedAt">
            · {{ t('permit.detail.report.visit.submitted', { when: stamp(visit.submittedAt) }) }}
          </template>
          <template v-else>
            · {{ t('permit.detail.report.visit.notSubmitted') }}
          </template>
        </p>
      </div>
      <span
        v-if="visit.source"
        class="rounded-full bg-surface-muted px-2.25 py-0.75 text-[10.5px] font-semibold text-text-secondary">
        {{ t(`permit.detail.report.source.${visit.source}`) }}
      </span>
    </header>

    <!-- Entrant activity during this visit's window (read-time association, derived from audit). -->
    <div
      v-if="entrantEvents.length"
      class="mb-2.5"
      data-test="report-visit-entrants">
      <p class="mb-1 text-[11px] font-semibold text-text-secondary">
        {{ t('permit.detail.report.visit.entrantsTitle') }}
      </p>
      <ul class="flex flex-col gap-0.5">
        <li
          v-for="(event, index) in entrantEvents"
          :key="index"
          class="text-[11.5px] text-text-primary">
          {{ t(`permit.detail.report.entrant.${event.direction}`, {
            who: event.workerName ?? t('permit.detail.sections.overview.none'),
            when: stamp(event.createdAt)
          }) }}
        </li>
      </ul>
    </div>

    <!-- PPE — three shapes, see src/utils/InspectorVisitPpe.ts. -->
    <div
      class="mb-2.5"
      data-test="report-visit-ppe">
      <p class="mb-1 text-[11px] font-semibold text-text-secondary">
        {{ t('permit.detail.report.visit.ppeTitle') }}
      </p>

      <p
        v-if="ppeShape === 'none'"
        class="text-[11.5px] text-text-tertiary"
        data-test="report-visit-ppe-none">
        {{ t('permit.detail.report.ppe.none') }}
      </p>

      <div
        v-else-if="ppeShape === 'new'"
        class="flex flex-col gap-1.5"
        data-test="report-visit-ppe-new">
        <ul
          v-if="wornRows.length"
          class="flex flex-wrap gap-1.5">
          <li
            v-for="row in wornRows"
            :key="row.item"
            :class="row.worn ? 'bg-status-active-bg text-status-active-fg' : 'bg-status-rejected-bg text-status-rejected-fg'"
            class="rounded-full px-2.25 py-0.75 text-[11px] font-semibold">
            {{ row.labelKey ? t(row.labelKey) : row.item }}
            <span aria-hidden="true">{{ row.worn ? '✓' : '✗' }}</span>
          </li>
        </ul>
        <p
          v-if="gapRows.length"
          class="text-[11.5px] font-semibold text-status-rejected-fg"
          data-test="report-visit-ppe-gaps">
          {{ t('permit.detail.report.ppe.gapsTitle') }}
          {{ gapsLabel }}
        </p>
        <p
          v-if="ppeNote"
          class="text-[11.5px] text-text-secondary">
          {{ ppeNote }}
        </p>
      </div>

      <div
        v-else
        class="flex flex-col gap-1"
        data-test="report-visit-ppe-legacy">
        <p class="text-[11px] text-text-tertiary">
          {{ t('permit.detail.report.ppe.legacy') }}
        </p>
        <ul class="flex flex-wrap gap-1.5">
          <li
            v-for="entry in legacyEntries"
            :key="entry.key"
            class="rounded-full bg-surface-muted px-2.25 py-0.75 text-[11px] text-text-secondary">
            {{ entry.key }}: {{ String(entry.value) }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Gas readings taken during this visit's window (read-time association, no stored join). -->
    <div
      v-if="gasReadings.length"
      class="mb-2.5"
      data-test="report-visit-gas">
      <p class="mb-1 text-[11px] font-semibold text-text-secondary">
        {{ t('permit.detail.report.visit.gasTitle') }}
      </p>
      <ul class="flex flex-col gap-0.5 font-mono text-[11.5px] text-text-primary">
        <li
          v-for="entry in gasReadings"
          :key="entry.id">
          {{ stamp(entry.recordedAt) }} — LEL {{ entry.lel ?? '—' }} · O₂ {{ entry.o2 ?? '—' }} ·
          CO {{ entry.co ?? '—' }} · SO₂ {{ entry.so2 ?? '—' }}
        </li>
      </ul>
    </div>

    <!-- Notes, colored by noteType. Ruling 18: the contractor reads every note, including CORRECTIVE_ACTION. -->
    <div
      v-if="visit.notes.length"
      class="mb-2.5"
      data-test="report-visit-notes">
      <p class="mb-1 text-[11px] font-semibold text-text-secondary">
        {{ t('permit.detail.report.visit.notesTitle') }}
      </p>
      <ul class="flex flex-col gap-1.5">
        <li
          v-for="note in visit.notes"
          :key="note.id"
          class="rounded-md border border-border px-2.5 py-1.5">
          <span
            :class="noteTypeClass(note.noteType)"
            class="mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold">
            {{ t(`permit.detail.report.noteType.${note.noteType}`) }}
          </span>
          <p class="text-[12px] text-text-primary break-words">
            {{ note.text }}
          </p>
        </li>
      </ul>
    </div>

    <!-- Photos, if any — reuses the app's existing file-URL resolution pattern (Upload.provider). -->
    <div
      v-if="visit.photos.length"
      data-test="report-visit-photos">
      <p class="mb-1 text-[11px] font-semibold text-text-secondary">
        {{ t('permit.detail.report.visit.photosTitle') }}
      </p>
      <FileAttachment :files="photoMedia" />
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { permitAuthorName } from '@/models/modules/permit/Permit.model'
import { InspectorVisitNoteTypeEnum } from '@/enums/modules/inspector-visit/InspectorVisitNoteType.enum'
import type { IGasLogEntryWire } from '@/models/response/gas-log/GasLogRes.model'
import type { IInspectorVisitPhoto, IInspectorVisitWire } from '@/models/response/inspector-visit/InspectorVisitRes.model'
import type { IMedia } from '@/resources/provider/Upload.provider'
import FileAttachment from '@/components/display/FileAttachment.vue'
import {
  classifyPpeChecklist, extractPpeGaps, extractPpeNote, extractPpeWornRows, legacyPpeEntries,
  type IPpeLabelledItem, type IPpeWornRow, type TPpeChecklistShape
} from '@/utils/InspectorVisitPpe'
import type { IEntrantAuditEvent } from '@/pages/permit/pages/detail/composables/usePermitReport'

/**
 * wayfinder 112 — one inspector visit inside the report's "visits" view. Full content, notes
 * included, is deliberate: map ruling 18 grants a contractor full visibility on their own permit.
 */
interface IProps {
  visit: IInspectorVisitWire
  gasReadings: IGasLogEntryWire[]
  entrantEvents: IEntrantAuditEvent[]
}

const props = defineProps<IProps>()

const { t, d } = useI18n()

const NOTE_TYPE_CLASS: Record<string, string> = {
  [InspectorVisitNoteTypeEnum.GENERAL]: 'bg-surface-muted text-text-secondary',
  [InspectorVisitNoteTypeEnum.WARNING]: 'bg-status-pending-bg text-status-pending-fg',
  [InspectorVisitNoteTypeEnum.CORRECTIVE_ACTION]: 'bg-status-rejected-bg text-status-rejected-fg',
  [InspectorVisitNoteTypeEnum.EMERGENCY]: 'bg-status-rejected-bg text-status-rejected-fg',
  [InspectorVisitNoteTypeEnum.INCIDENT]: 'bg-status-rejected-bg text-status-rejected-fg'
}

function noteTypeClass (noteType: string): string {
  return NOTE_TYPE_CLASS[noteType] ?? 'bg-surface-muted text-text-secondary'
}

function stamp (value: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return d(parsed, 'long')
}

const inspectorName: ComputedRef<string> = computed(
  (): string => permitAuthorName(props.visit.inspector) || t('permit.detail.sections.overview.none'))

const ppeShape: ComputedRef<TPpeChecklistShape> = computed((): TPpeChecklistShape => classifyPpeChecklist(props.visit.ppeChecklist))
const wornRows: ComputedRef<IPpeWornRow[]> = computed(
  (): IPpeWornRow[] => (props.visit.ppeChecklist ? extractPpeWornRows(props.visit.ppeChecklist) : []))
const gapRows: ComputedRef<IPpeLabelledItem[]> = computed(
  (): IPpeLabelledItem[] => (props.visit.ppeChecklist ? extractPpeGaps(props.visit.ppeChecklist) : []))
const ppeNote: ComputedRef<string | null> = computed(
  (): string | null => (props.visit.ppeChecklist ? extractPpeNote(props.visit.ppeChecklist) : null))
const legacyEntries: ComputedRef<Array<{ key: string, value: unknown }>> = computed(
  (): Array<{ key: string, value: unknown }> => (props.visit.ppeChecklist ? legacyPpeEntries(props.visit.ppeChecklist) : []))
const gapsLabel: ComputedRef<string> = computed((): string => gapRows.value
  .map((row: IPpeLabelledItem): string => (row.labelKey ? t(row.labelKey) : row.item))
  .join(', '))

const photoMedia: ComputedRef<IMedia[]> = computed((): IMedia[] => props.visit.photos.map((photo: IInspectorVisitPhoto): IMedia => ({
  name: photo.originalName ?? photo.fileRef,
  url: photo.fileRef,
  path: photo.fileRef
})))
</script>

<style scoped>

</style>
