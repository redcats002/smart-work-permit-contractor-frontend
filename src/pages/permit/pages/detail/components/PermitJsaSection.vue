<template>
  <div class="flex flex-col gap-5">
    <div
      v-for="group in groups"
      :key="group.phase"
      :data-test="`jsa-phase-${group.phase}`">
      <p class="mb-2 flex flex-wrap items-baseline gap-2">
        <span class="text-[13px] font-bold text-text-primary">
          {{ t(`permit.create.steps.jsa.phase.${group.phase}`) }}
        </span>
        <span class="text-[11.5px] text-text-tertiary">
          {{ t('permit.detail.sections.jsa.phaseCount', { count: group.steps.length }) }}
        </span>
      </p>

      <p
        v-if="!group.steps.length"
        :data-test="`jsa-phase-${group.phase}-empty`"
        class="rounded-[9px] border border-dashed border-border-input bg-surface-app px-4 py-4 text-center text-[12px] text-text-secondary">
        {{ t('permit.detail.sections.jsa.phaseEmpty') }}
      </p>

      <div
        v-else
        class="overflow-x-auto">
        <table class="w-full min-w-[34rem] border-collapse text-[13px]">
          <thead>
            <tr class="border-b border-border text-left text-[11px] text-text-tertiary">
              <th class="py-2 pr-3 font-medium">
                {{ t('permit.detail.sections.jsa.columnStep') }}
              </th>
              <th class="py-2 pr-3 font-medium">
                {{ t('permit.detail.sections.jsa.columnHazard') }}
              </th>
              <th class="py-2 font-medium">
                {{ t('permit.detail.sections.jsa.columnControl') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in group.steps"
              :key="row.id ?? `${group.phase}-${index}`"
              class="border-b border-surface-muted align-top last:border-b-0">
              <td class="py-2.5 pr-3 text-text-primary break-words">
                {{ row.step }}
              </td>
              <td class="py-2.5 pr-3">
                <span class="inline-block rounded-md bg-status-pending-bg px-2 py-1 text-[11.5px] text-status-pending-fg break-words">
                  {{ row.hazard }}
                </span>
              </td>
              <td class="py-2.5 text-text-secondary break-words">
                {{ row.control }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { JSA_PHASE_ORDER, type EJsaPhase } from '@/enums/modules/permit/JsaPhase.enum'
import type { IJsaStep } from '@/models/modules/permit/Permit.model'

/**
 * §4 JSA (05-permit-detail-sections.md): grouped by `phase` in the wizard's own display order,
 * ordered by `sortOrder` inside each phase, with the per-phase row count shown. A phase with no
 * rows keeps its heading and shows an empty state — hiding it would make "no steps" and "not
 * loaded" look identical.
 */
interface IProps {
  steps: IJsaStep[]
}

interface IPhaseGroup {
  phase: EJsaPhase
  steps: IJsaStep[]
}

const props = defineProps<IProps>()

const { t } = useI18n()

/** `sortOrder` is optional on the wire — rows without one keep their payload order, after the sorted ones. */
function bySortOrder (left: IJsaStep, right: IJsaStep): number {
  return (left.sortOrder ?? Number.MAX_SAFE_INTEGER) - (right.sortOrder ?? Number.MAX_SAFE_INTEGER)
}

const groups: ComputedRef<IPhaseGroup[]> = computed((): IPhaseGroup[] => JSA_PHASE_ORDER.map(
  (phase: EJsaPhase): IPhaseGroup => ({
    phase,
    steps: props.steps.filter((step: IJsaStep): boolean => step.phase === phase).sort(bySortOrder)
  })
))
</script>

<style scoped>

</style>
