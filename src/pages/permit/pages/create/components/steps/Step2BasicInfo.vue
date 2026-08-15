<template>
  <div class="flex min-h-70 flex-col items-center justify-center gap-2 py-10 text-center">
    <h2 class="text-lg font-bold text-text-primary">
      {{ title }}
    </h2>
    <p class="text-xs font-semibold tracking-wide text-primary uppercase">
      {{ t('permit.create.steps.basicInfo.marker') }}
    </p>
    <p class="max-w-md text-sm text-text-secondary">
      {{ t('permit.create.steps.basicInfo.body') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { IWizardStepProps, IWizardStepEmits } from '../../wizard/WizardSteps'

/**
 * STEP 2 STUB — real content (Project/Contractor/Foreman/Date/Start/End/
 * Work description/Location + map-pin panel) lands in PMT-005, alongside
 * Step1Type.vue. See Step1Type.vue for the shared contract notes.
 */
defineProps<IWizardStepProps>()
defineEmits<IWizardStepEmits>()

const { t } = useI18n()
</script>

<style scoped>
</style>
