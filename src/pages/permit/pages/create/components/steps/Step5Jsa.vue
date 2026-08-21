<template>
  <div class="flex flex-col gap-5">
    <div class="flex flex-col gap-1">
      <h2 class="text-lg font-bold text-text-primary">
        {{ title }}
      </h2>
      <p class="text-sm text-text-secondary">
        {{ t('permit.create.steps.jsa.subtitle') }}
      </p>
    </div>

    <div class="flex w-fit max-w-full gap-2 overflow-x-auto rounded-xl bg-surface-subtle p-1.5">
      <button
        v-for="tab in phaseTabs"
        :key="tab.phase"
        :class="tab.phase === activePhase
          ? 'bg-shell-sidebar text-white'
          : 'bg-transparent text-text-secondary'"
        class="rounded-lg px-3.5 py-2 text-[13px] font-semibold whitespace-nowrap"
        type="button"
        @click="activePhase = tab.phase">
        {{ t(`permit.create.steps.jsa.phase.${tab.phase}`) }}
        <span class="text-[11px] opacity-75">({{ tab.count }})</span>
      </button>
    </div>

    <div class="overflow-x-auto rounded-xl border border-border">
      <table class="w-full min-w-[640px] border-collapse text-left">
        <thead>
          <tr class="bg-surface-subtle text-[11.5px] font-semibold text-text-secondary">
            <th class="px-3.5 py-2.5 font-semibold">
              {{ t('permit.create.steps.jsa.column.step') }}
            </th>
            <th class="px-3.5 py-2.5 font-semibold">
              {{ t('permit.create.steps.jsa.column.hazard') }}
            </th>
            <th class="px-3.5 py-2.5 font-semibold">
              {{ t('permit.create.steps.jsa.column.control') }}
            </th>
            <th class="w-12 px-3 py-2.5" />
          </tr>
        </thead>
        <tbody>
          <tr v-if="!phaseRows.length">
            <td
              class="px-3.5 py-6 text-center text-[13px] text-text-tertiary"
              colspan="4">
              {{ t('permit.create.steps.jsa.emptyPhase') }}
            </td>
          </tr>
          <tr
            v-for="row in phaseRows"
            v-else
            :key="row.index"
            class="border-t border-surface-muted">
            <td class="px-3.5 py-3">
              <InputText
                :model-value="row.entry.step"
                :placeholder="t('permit.create.steps.jsa.placeholder.step')"
                class="h-9 w-full"
                @update:model-value="patchRow(row.index, { step: $event ?? '' })" />
            </td>
            <td class="px-3.5 py-3">
              <InputText
                :model-value="row.entry.hazard"
                :placeholder="t('permit.create.steps.jsa.placeholder.hazard')"
                class="h-9 w-full bg-status-pending-bg! text-status-pending-fg! font-semibold"
                @update:model-value="patchRow(row.index, { hazard: $event ?? '' })" />
            </td>
            <td class="px-3.5 py-3">
              <InputText
                :model-value="row.entry.control"
                :placeholder="t('permit.create.steps.jsa.placeholder.control')"
                class="h-9 w-full"
                @update:model-value="patchRow(row.index, { control: $event ?? '' })" />
            </td>
            <td class="px-3 py-3">
              <button
                :aria-label="t('permit.create.steps.jsa.removeRow')"
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

    <div class="flex flex-col gap-2">
      <button
        class="w-fit rounded-md border border-border-strong bg-surface-muted px-3.5 py-2 text-[12.5px]
          font-semibold text-text-primary"
        type="button"
        @click="addRow()">
        <span aria-hidden="true">＋</span>
        {{ t('permit.create.steps.jsa.addRow', { phase: t(`permit.create.steps.jsa.phase.${activePhase}`) }) }}
      </button>

      <p
        v-if="anyIncompleteRow"
        class="text-[12.5px] font-semibold text-status-pending-fg">
        <span aria-hidden="true">⚠</span> {{ t('permit.create.steps.jsa.validation.incompleteRow') }}
      </p>
    </div>

    <DeleteModal
      v-model="removalOpen"
      :confirm-label="t('permit.create.steps.jsa.remove.confirm')"
      :description1="t('permit.create.steps.jsa.remove.description')"
      :description2="pendingRowLabel"
      :title="t('permit.create.steps.jsa.remove.title')"
      @confirm="confirmRemove()" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DeleteModal from '@/components/modal/DeleteModal.vue'
import { EJsaPhase, JSA_PHASE_ORDER, type TJsaPhase } from '@/enums/modules/permit/JsaPhase.enum'
import type { IJsaStep } from '@/models/modules/permit/Permit.model'
import { jsaRowComplete } from '../../schema/Step5Jsa.schema'
import type { IWizardStepEmits, IWizardStepProps } from '../../wizard/WizardSteps'

/**
 * PMT-008 — step 5, Job Safety Analysis.
 *
 * `jsaSteps` is REPLACED WHOLESALE by PATCH /permits/:id, so every mutation emits the complete
 * list across ALL phases, not just the visible tab — sending only the active phase's rows would
 * silently delete the other two.
 *
 * `sortOrder` is recomputed per phase on every mutation so the order the user sees is the order
 * the backend stores, and stays stable when a row is removed from the middle.
 */
interface IPhaseTab {
  phase: TJsaPhase
  count: number
}

/** Carries the row's index in the FULL list — the tab only ever shows a filtered view. */
interface IPhaseRow {
  index: number
  entry: IJsaStep
}

const props = defineProps<IWizardStepProps>()
const emit = defineEmits<IWizardStepEmits>()

const { t } = useI18n()

const activePhase: Ref<TJsaPhase> = ref(EJsaPhase.PRE)
const removalOpen: Ref<boolean> = ref(false)
const pendingIndex: Ref<number | undefined> = ref(undefined)

const rows: ComputedRef<IJsaStep[]> = computed((): IJsaStep[] => props.formData.jsaSteps ?? [])

const phaseTabs: ComputedRef<IPhaseTab[]> = computed((): IPhaseTab[] =>
  JSA_PHASE_ORDER.map((phase: TJsaPhase): IPhaseTab => ({
    phase,
    count: rows.value.filter((entry: IJsaStep): boolean => entry.phase === phase).length
  }))
)

const phaseRows: ComputedRef<IPhaseRow[]> = computed((): IPhaseRow[] =>
  rows.value
    .map((entry: IJsaStep, index: number): IPhaseRow => ({ index, entry }))
    .filter((row: IPhaseRow): boolean => row.entry.phase === activePhase.value)
)

const anyIncompleteRow: ComputedRef<boolean> = computed(
  (): boolean => rows.value.some((entry: IJsaStep): boolean => !jsaRowComplete(entry))
)

const pendingRowLabel: ComputedRef<string> = computed((): string => {
  if (pendingIndex.value === undefined) return ''
  return rows.value[pendingIndex.value]?.step ?? ''
})

/** Renumbers `sortOrder` within each phase, preserving the current relative order. */
function withSortOrder (next: IJsaStep[]): IJsaStep[] {
  const seen: Record<string, number> = {}
  return next.map((entry: IJsaStep): IJsaStep => {
    const position = seen[entry.phase] ?? 0
    seen[entry.phase] = position + 1
    return { ...entry, sortOrder: position }
  })
}

function emitRows (next: IJsaStep[]): void {
  emit('update:formData', { jsaSteps: withSortOrder(next) })
}

function patchRow (index: number, patch: Partial<IJsaStep>): void {
  emitRows(rows.value.map(
    (entry: IJsaStep, position: number): IJsaStep => (position === index ? { ...entry, ...patch } : entry)
  ))
}

function addRow (): void {
  emitRows([...rows.value, { phase: activePhase.value, step: '', hazard: '', control: '' }])
}

function askRemove (index: number): void {
  pendingIndex.value = index
  removalOpen.value = true
}

function confirmRemove (): void {
  const index = pendingIndex.value
  if (index === undefined) return
  emitRows(rows.value.filter((_entry: IJsaStep, position: number): boolean => position !== index))
  pendingIndex.value = undefined
}
</script>

<style scoped>
</style>
