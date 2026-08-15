<template>
  <div class="flex min-h-70 flex-col items-center justify-center gap-2 py-10 text-center">
    <h2 class="text-lg font-bold text-text-primary">
      {{ title }}
    </h2>
    <p class="text-xs font-semibold tracking-wide text-primary uppercase">
      {{ t('permit.create.steps.type.marker') }}
    </p>
    <p class="max-w-md text-sm text-text-secondary">
      {{ t('permit.create.steps.type.body') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IWizardStepProps, IWizardStepEmits } from '../../wizard/WizardSteps'

/**
 * STEP 1 STUB — real content (3 permit-type cards: Hot Work / Confined Space /
 * Working at Heights) lands in PMT-005. Fill this component's <template> with
 * the type picker and update ../../schema/Step1Type.schema.ts to actually
 * validate `type`. Do not touch the wizard shell (useWizard, WizardSteps,
 * StepperHeader, WizardFooter) to do it — this component receives `formData`
 * and emits `update:formData` for exactly that purpose.
 */
defineProps<IWizardStepProps>()
defineEmits<IWizardStepEmits>()

const { t } = useI18n()
</script>

<style scoped>
</style>
