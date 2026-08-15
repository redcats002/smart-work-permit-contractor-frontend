<template>
  <div class="mb-6">
    <!-- Below sm (375px etc.) — compact "Step X of N" treatment instead of the 6-node
         row, which cannot fit legibly at that width. See PMT-004 report for why this
         was picked over a horizontal-scrolling stepper (styling-rules.md reserves
         page-level horizontal scroll for DataTable only). -->
    <div class="sm:hidden">
      <p class="text-xs font-semibold text-text-tertiary">
        {{ t('permit.wizard.stepOf', { current: currentStepIndex + 1, total: steps.length }) }}
      </p>
      <p class="mt-0.5 text-sm font-semibold text-text-primary">
        {{ t(steps[currentStepIndex].labelKey) }}
      </p>
      <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          :style="{ width: `${progressPercent}%` }"
          class="h-full rounded-full bg-primary transition-[width]" />
      </div>
    </div>

    <!-- sm and up — full 6-node stepper with connecting rules (design lines 146-165). -->
    <div class="hidden items-center sm:flex">
      <div
        v-for="(node, index) in nodes"
        :key="node.key"
        class="flex flex-1 items-center">
        <div class="flex items-center gap-2">
          <button
            :class="[node.clickable ? 'cursor-pointer' : 'cursor-default', node.circleClass]"
            :disabled="!node.clickable"
            class="flex size-7.5 shrink-0 items-center justify-center rounded-full border-2 text-[13px] font-semibold"
            type="button"
            @click="node.clickable && emit('select', index)">
            <span
              v-if="node.state === 'done'"
              aria-hidden="true">✓</span>
            <span v-else>{{ index + 1 }}</span>
          </button>
          <span
            :class="node.state === 'upcoming' ? 'font-normal text-text-tertiary' : 'font-semibold text-text-primary'"
            class="text-xs whitespace-nowrap">
            {{ t(node.labelKey) }}
          </span>
        </div>
        <div
          v-if="index < nodes.length - 1"
          :class="node.state === 'done' ? 'bg-primary' : 'bg-border'"
          class="mx-3 h-0.5 flex-1" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IWizardStepDef } from '../wizard/WizardSteps'

type TStepNodeState = 'done' | 'current' | 'upcoming'

interface IStepNodeVm {
  key: string
  labelKey: string
  state: TStepNodeState
  clickable: boolean
  circleClass: string
}

interface IProps {
  steps: IWizardStepDef[]
  currentStepIndex: number
  maxUnlockedStepIndex: number
}

interface IEmits {
  select: [index: number]
}

const props = defineProps<IProps>()
const emit = defineEmits<IEmits>()

const { t } = useI18n()

/**
 * Tailwind utilities generated from the @theme tokens in tailwind.css — same
 * STATE -> class-map pattern as PermitCard.vue's TYPE_CHIP_CLASS/STATUS_CLASS.
 */
const STATE_CIRCLE_CLASS: Record<TStepNodeState, string> = {
  done: 'bg-primary border-primary text-white',
  current: 'bg-surface-card border-primary text-primary',
  upcoming: 'bg-surface-card border-border-strong text-text-tertiary'
}

function stateFor (index: number): TStepNodeState {
  if (index < props.currentStepIndex) return 'done'
  if (index === props.currentStepIndex) return 'current'
  return 'upcoming'
}

const nodes: ComputedRef<IStepNodeVm[]> = computed((): IStepNodeVm[] => props.steps.map(
  (step: IWizardStepDef, index: number): IStepNodeVm => {
    const state = stateFor(index)
    return {
      key: step.key,
      labelKey: step.labelKey,
      state,
      clickable: index <= props.maxUnlockedStepIndex && index !== props.currentStepIndex,
      circleClass: STATE_CIRCLE_CLASS[state]
    }
  }
))

const progressPercent: ComputedRef<number> = computed(
  (): number => ((props.currentStepIndex + 1) / props.steps.length) * 100
)
</script>

<style scoped>
</style>
