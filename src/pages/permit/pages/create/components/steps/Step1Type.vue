<template>
  <div class="flex flex-col gap-4">
    <h2 class="text-lg font-bold text-text-primary">
      {{ title }}
    </h2>
    <p class="text-sm text-text-secondary">
      {{ t('permit.create.steps.type.prompt') }}
    </p>

    <div class="grid grid-cols-1 gap-3.5 md:grid-cols-3">
      <button
        v-for="option in typeOptions"
        :key="option.value"
        :class="[
          selected === option.value ? option.selectedClass : 'border-border bg-surface-card',
        ]"
        class="flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-colors hover:border-text-tertiary"
        type="button"
        @click="select(option.value)">
        <span
          :class="[option.chipBg, option.chipFg]"
          class="flex size-9 items-center justify-center rounded-lg text-lg">
          <span aria-hidden="true">{{ option.icon }}</span>
        </span>
        <span class="text-sm font-bold text-text-primary">
          {{ t(`permit.type.${option.value}`) }}
        </span>
        <span class="text-xs text-text-secondary">
          {{ t(`permit.create.steps.type.blurb.${option.value}`) }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { EPermitType, type TPermitType } from '@/enums/modules/permit/PermitType.enum'
import type { IWizardStepEmits, IWizardStepProps } from '../../wizard/WizardSteps'

interface ITypeOption {
  value: TPermitType
  icon: string
  chipBg: string
  chipFg: string
  selectedClass: string
}

const TYPE_OPTIONS: ITypeOption[] = [
  {
    value: EPermitType.HOT,
    icon: '🔥',
    chipBg: 'bg-permit-type-hot-bg',
    chipFg: 'text-permit-type-hot-fg',
    selectedClass: 'border-permit-type-hot-fg bg-permit-type-hot-bg'
  },
  {
    value: EPermitType.CONFINED,
    icon: '🕳️',
    chipBg: 'bg-permit-type-confined-bg',
    chipFg: 'text-permit-type-confined-fg',
    selectedClass: 'border-permit-type-confined-fg bg-permit-type-confined-bg'
  },
  {
    value: EPermitType.HEIGHTS,
    icon: '🪜',
    chipBg: 'bg-permit-type-heights-bg',
    chipFg: 'text-permit-type-heights-fg',
    selectedClass: 'border-permit-type-heights-fg bg-permit-type-heights-bg'
  }
]

const props = defineProps<IWizardStepProps>()
const emit = defineEmits<IWizardStepEmits>()

const { t } = useI18n()

const typeOptions: ITypeOption[] = TYPE_OPTIONS
const selected: ComputedRef<TPermitType | undefined> = computed((): TPermitType | undefined => props.formData.type)

function select (value: TPermitType): void {
  emit('update:formData', { type: value })
}
</script>

<style scoped>
</style>
