<template>
  <div class="flex min-h-70 flex-col items-center justify-center gap-2 py-10 text-center">
    <h2 class="text-lg font-bold text-text-primary">
      {{ title }}
    </h2>
    <p class="text-xs font-semibold tracking-wide text-primary uppercase">
      {{ t('permit.create.steps.jsa.marker') }}
    </p>
    <p class="max-w-md text-sm text-text-secondary">
      {{ t('permit.create.steps.jsa.body') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IWizardStepProps, IWizardStepEmits } from '../../wizard/WizardSteps'

/**
 * STEP 5 STUB — real content (Pre/Process/Post phase tab pills from EJsaPhase,
 * 3-col Work Step/Hazard/Control table, "+ Add Step" per phase) lands in
 * PMT-008. See Step1Type.vue for the shared contract notes.
 */
defineProps<IWizardStepProps>()
defineEmits<IWizardStepEmits>()

const { t } = useI18n()
</script>

<style scoped>
</style>
