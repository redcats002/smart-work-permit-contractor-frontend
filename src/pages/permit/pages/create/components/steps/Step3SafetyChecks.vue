<template>
  <div class="flex min-h-70 flex-col items-center justify-center gap-2 py-10 text-center">
    <h2 class="text-lg font-bold text-text-primary">
      {{ title }}
    </h2>
    <p class="text-xs font-semibold tracking-wide text-primary uppercase">
      {{ t('permit.create.steps.safetyChecks.marker') }}
    </p>
    <p class="max-w-md text-sm text-text-secondary">
      {{ t('permit.create.steps.safetyChecks.body') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IWizardStepProps, IWizardStepEmits } from '../../wizard/WizardSteps'

/**
 * STEP 3 STUB — real content (blocked/safe banner, indoor/outdoor toggle,
 * reading cards backed by SAFETY_RANGES/validateReadings from
 * src/utils/PermitSafety.ts, instrument-photo slots, Yes/No/N/A checklist)
 * lands in PMT-006. See Step1Type.vue for the shared contract notes.
 */
defineProps<IWizardStepProps>()
defineEmits<IWizardStepEmits>()

const { t } = useI18n()
</script>

<style scoped>
</style>
